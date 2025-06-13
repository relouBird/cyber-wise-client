import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import useTestService from "~/services/test.service";
import type { UserDescription } from "~/types/test.type";

// importation des images
import user1 from "~/assets/images/profile/user-1.jpg";
import user2 from "~/assets/images/profile/user-2.jpg";
import user3 from "~/assets/images/profile/user-3.jpg";
import user4 from "~/assets/images/profile/user-4.jpg";

type StateProps = {
  id: string;
};

// le service qui gère les requetes
const service = useTestService();

const useTestStore = defineStore("test-store", {
  state: () =>
    <StateProps>{
      id: "",
    },
  persist: true,
  getters: {},
  actions: {
    async getAllTests() {
      const response: AxiosResponse =
        service.fetchAll && (await service.fetchAll());

      let data: UserDescription[] = [];
      let images = [user1, user2, user3, user4];

      if (response?.status == 200 || response.status == 201) {
        console.log("data =>", response.data);
        data = response.data;
        data.forEach((dat) => {
          dat.image = images[Math.round(Math.random())];
        });
      }

      return { data: data, response: response };
    },
  },
});

export default useTestStore;
