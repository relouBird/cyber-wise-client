import type { AxiosResponse } from "axios";
import {
  domainsConstants,
  formationsConstants,
} from "~/constants/trainings.constant";
import { notify } from "~/helpers/notifications";
import useTrainingService from "~/services/trainings.service";
import type {
  Domain,
  DomainDeleteResponse,
  DomainResponse,
  DomainsResponse,
  Formation,
  TrainingResponse,
  TrainingsResponse,
} from "~/types/trainings.type";

type StateProps = {
  domains_list: Domain[];
  training_list: Formation[];
};

const service = useTrainingService();

const useTrainingsStore = defineStore("trainings-store", {
  state: () =>
    <StateProps>{
      domains_list: [],
      training_list: [],
    },
  persist: true,
  getters: {
    getDomains: (state) => state.domains_list,
    getTrainings: (state) => state.training_list,
  },
  actions: {
    // Partie qui gere le domain....
    async getAllDomains() {
      const response: AxiosResponse =
        service.fetchAllDomains && (await service.fetchAllDomains());

      if (response.status == 200 || response.status == 201) {
        let data = response.data as DomainsResponse;
        console.log("data-domains =>", data);
        this.domains_list = data.data;
      } else if (response.status == 404) {
        console.log("error =>", response.data);
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      }

      return response;
    },

    async createDomain(author_id: string, domainForm: Domain) {
      const newDomain: Domain = {
        creator_id: author_id,
        categorie: domainForm.categorie,
        name: domainForm.name,
        description: domainForm.description,
        icon: domainForm.icon,
        color: domainForm.color,
      };
      console.log("create-data =>", newDomain);

      const response: AxiosResponse = await service.createDomain(newDomain);

      if (response.status == 200 || response.status == 201) {
        let data = response.data as DomainResponse;
        console.log("data =>", data);

        this.domains_list.push(data.data);
      } else if (response.status == 400) {
        console.log("error =>", response.data);
      }

      console.log("all-domains =>", this.domains_list);
    },

    async updateDomain(author_id: string, updateDomain: Domain) {
      // Modifier le domaine existant
      if (author_id != updateDomain.creator_id) {
        notify({
          color: "error",
          message: "You aren't able to modify this...",
          visible: true,
        });
      } else {
        const newDomain: Domain = {
          ...updateDomain,
        };
        const index = this.domains_list.findIndex((u) => u.id == newDomain.id);

        if (index !== -1) {
          this.domains_list[index] = updateDomain;
        }
      }
    },

    async deleteDomain(domainId: number) {
      const response: AxiosResponse =
        service.deleteDomain && (await service.deleteDomain(domainId));

      if (response.status == 200 || response.status == 201) {
        let data = response.data as DomainDeleteResponse;

        // Supprimer les formations du domaine
        this.training_list = this.training_list.filter(
          (f) => f.domainId !== data.data.id
        );
        // Supprimer le domaine
        const index = this.domains_list.findIndex((d) => d.id === data.data.id);
        this.domains_list.splice(index, 1);
      } else if (response.status == 500) {
        console.log("error =>", response.data.message);
      }
    },

    // partie qui gere la formation...
    async getAllTraining() {
      const response: AxiosResponse =
        service.fetchAllTrainings && (await service.fetchAllTrainings());

      if (response.status == 200 || response.status == 201) {
        let data = response.data as TrainingsResponse;
        let newData: Formation[] = [];
        for (let i = 0; i < data.data.length; i++) {
          // let image = "";
          // if (data.data[i].image) {
          //   image = JSON.stringify(data.data[i].image);
          // }
          newData.push({ ...data.data[i], courses: [] });
        }
        console.log("data =>", newData);
        this.training_list = newData;
      } else if (response.status == 404) {
        console.log("error =>", response.data);
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      }

      return response;
    },

    async createTraining(author_id: string, trainingForm: Formation) {
      // Créer une nouvelle formation
      const newFormation: Formation = {
        creator_id: author_id,
        categorie: "",
        title: trainingForm.title,
        image: trainingForm.image,
        description: trainingForm.description,
        domainId: trainingForm.domainId,
        active: trainingForm.active,
      };

      const form = new FormData();
      for (const key in newFormation) {
        if (Object.prototype.hasOwnProperty.call(newFormation, key)) {
          form.append(key, newFormation[key]);
        }
      }
      // Objet JSON qu’on transforme en string avant d’ajouter
      const imageMeta = {
        alt: "Une image cool",
        size: "medium",
      };
      form.append("imageMeta", JSON.stringify(imageMeta)); // ✅ ici c'est du JSON

      newFormation.categorie =
        this.domains_list[
          this.domains_list.findIndex((u) => u.id == trainingForm.domainId)
        ].categorie;

      newFormation.color =
        this.domains_list[
          this.domains_list.findIndex((u) => u.id == trainingForm.domainId)
        ].color;

      console.log("Nouvelle formation - murel =>", newFormation);
      console.log("Nouvelle formation - form =>", form);

      const response: AxiosResponse = await service.createTraining(
        form as unknown as Formation
      );

      if (response.status == 200 || response.status == 201) {
        let data = response.data as TrainingResponse;
        console.log("data =>", data);

        this.training_list.push(data.data);
      } else if (response.status == 400) {
        console.log("error =>", response.data);
      }
    },

    async updateTraining(author_id: string, updateTraining: Formation) {
      if (author_id != updateTraining.creator_id) {
        notify({
          color: "error",
          message: "You aren't able to modify this...",
          visible: true,
        });
      } else {
        const index = this.training_list.findIndex(
          (f) => f.id === updateTraining!.id
        );
        this.training_list[index] = {
          ...updateTraining,
          title: updateTraining.title,
          description: updateTraining.description,
          image: updateTraining.image,
        };
      }
    },

    async deleteTraining(trainingId: number) {
      const index = this.training_list.findIndex((f) => f.id === trainingId);
      this.training_list.splice(index, 1);
    },
  },
});

export default useTrainingsStore;
