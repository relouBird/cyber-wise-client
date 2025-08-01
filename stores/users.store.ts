import type { AxiosResponse } from "axios";
import { usersPrototype } from "~/constants/users.constant";
import useUsersService from "~/services/users.service";
import type { ActivityType } from "~/types/activity.type";
import type {
  UserProps,
  UserResponseProps,
  UsersResponseProps,
} from "~/types/constant.type";

type StateProps = {
  users_list: UserProps[];
};

const service = useUsersService();

const useUsersStore = defineStore("users-store", {
  state: () =>
    <StateProps>{
      users_list: [],
    },
  persist: true,
  getters: {
    getUsers: (state) => state.users_list,
    getLength: (state) => state.users_list.length,
  },
  actions: {
    async getUsersOnUrl(id: string) {
      const response: AxiosResponse =
        service.fetch && (await service.fetch(id));

      if (response.status == 200 || response.status == 201) {
        let data = response.data as UsersResponseProps;
        console.log("data =>", data);
        this.users_list = [...data.data];
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      }

      return response;
    },

    async createUser(user: UserProps) {
      const response: AxiosResponse =
        service.create && (await service.create(user));

      if (response.status == 200 || response.status == 201) {
        let data = response.data as UserResponseProps;

        let activityInstance: ActivityType = {
          org_id: user.org_id as string,
          activity_id: String(data.data.id),
          type: "add",
          title: "",
          message: data.data.firstName + " " + data.data.lastName,
        };

        let activityResponse: AxiosResponse =
          service.createActivity &&
          (await service.createActivity(activityInstance));

        console.log("data =>", data);
        this.users_list.push(data.data);
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      }

      return response;
    },

    async updateUser(user: UserProps) {
      const response: AxiosResponse =
        service.update && (await service.update(user.id, user));

      if (response.status == 200 || response.status == 201) {
        let data = response.data as UserResponseProps;
        console.log("data =>", data);

        // remplace dans la liste
        const index = this.users_list.findIndex((u) => u.id === data.data.id);
        if (index !== -1) {
          this.users_list[index] = data.data;
        }
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      }

      return response;
    },

    async deleteUser(user: UserProps) {
      const response: AxiosResponse =
        service.remove && (await service.remove(user.id ?? "", {}));

      if (response.status == 200 || response.status == 201) {
        let data = response.data;

        let activityInstance: ActivityType = {
          org_id: user.org_id as string,
          activity_id: String(user.id),
          type: "delete",
          title: "",
          message: user.firstName + " " + user.lastName,
        };

        let activityResponse: AxiosResponse =
          service.createActivity &&
          (await service.createActivity(activityInstance));

        // remplace dans la liste
        this.users_list = this.users_list.filter((u) => u.id !== data.data);
      } else if (response.status == 500) {
        console.log("error =>", response.data.message);
      }
    },

    async deleterManyUsers(usersId: Array<number>) {
      for (let i = 0; i < usersId.length; i++)
        this.users_list = this.users_list.filter((u) => u.id !== usersId[i]);
    },
  },
});

export default useUsersStore;
