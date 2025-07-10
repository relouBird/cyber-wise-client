import type { AxiosResponse } from "axios";
import useActivitiesService from "~/services/activities.service";
import type { ActivitiesResponse, ActivityType } from "~/types/activity.type";

type StateProps = {
  activities_list: ActivityType[];
};

const service = useActivitiesService();

const useActivitiesStore = defineStore("activities-store", {
  state: () =>
    <StateProps>{
      activities_list: [],
    },
  persist: true,
  getters: {
    getActivities: (state) => [...state.activities_list].slice(-4).reverse(),
    getIncidents: (state) =>
      state.activities_list.filter((u) => u.type == "incident"),
  },
  actions: {
    async getAll(id: string) {
      console.log("mince...");
      const response: AxiosResponse =
        service.fetch && (await service.fetch(id));

      console.log("response-activities =>", response);

      if (response.status == 200 || response.status == 201) {
        let data = response.data as ActivitiesResponse;
        console.log("data =>", data);
        this.activities_list = [...data.data];
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      }

      return response;
    },
  },
});

export default useActivitiesStore;
