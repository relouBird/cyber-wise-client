import type { AxiosResponse } from "axios";
import { notify } from "~/helpers/notifications";
import useTrainingService from "~/services/trainings.service";
import type {
  Course,
  Domain,
  DomainDeleteResponse,
  DomainResponse,
  DomainsResponse,
  Formation,
  TrainingDeleteResponse,
  TrainingResponse,
  TrainingsResponse,
} from "~/types/trainings.type";

type StateProps = {
  domains_list: Domain[];
  training_list: Formation[];
  toDelete: Domain | Formation | null;
};

const service = useTrainingService();

const useTrainingsStore = defineStore("trainings-store", {
  state: () =>
    <StateProps>{
      domains_list: [],
      training_list: [],
      toDelete: null,
    },
  persist: true,
  getters: {
    getDomains: (state) => state.domains_list,
    getTrainings: (state) => state.training_list,
    getDelete: (state) => state.toDelete,
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

        const response: AxiosResponse = await service.updateDomain(
          updateDomain.id,
          newDomain
        );

        if (response.status == 200 || response.status == 201) {
          let data = response.data as DomainResponse;
          console.log("data =>", data);

          const index = this.domains_list.findIndex(
            (u) => u.id == data.data.id
          );
          if (index !== -1) {
            this.domains_list[index] = updateDomain;
          }
        } else if (response.status == 404) {
          console.log("error-not-found =>", response.data);
        } else if (response.status == 500) {
          console.log("error =>", response.data);
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
        console.log("data =>", data.data);
        this.training_list = data.data;
      } else if (response.status == 404) {
        console.log("error =>", response.data);
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      }

      return response;
    },

    async createTraining(author_id: string, trainingForm: Formation) {
      let categorie =
        this.domains_list[
          this.domains_list.findIndex((u) => u.id == trainingForm.domainId)
        ].categorie;

      let color =
        this.domains_list[
          this.domains_list.findIndex((u) => u.id == trainingForm.domainId)
        ].color;

      let formData = new FormData();

      formData.append("creator_id", author_id);
      formData.append("categorie", categorie);
      formData.append("color", color);
      formData.append("level", trainingForm.level);
      formData.append("title", trainingForm.title);
      formData.append("image", trainingForm.image as File);
      formData.append("description", trainingForm.description);
      formData.append("domainId", String(trainingForm.domainId));
      formData.append("active", String(trainingForm.active));

      console.log("Nouvelle formation - murel =>", trainingForm);

      const response: AxiosResponse = await service.createTraining(formData);

      if (response.status == 200 || response.status == 201) {
        let data = response.data as TrainingResponse;

        this.training_list.push(data.data);
      } else if (response.status == 400) {
        console.log("error =>", response.data);
      }
    },

    async updateTraining(
      author_id: string,
      updateTraining: Formation,
      isActive?: boolean
    ) {
      if (author_id != updateTraining.creator_id) {
        notify({
          color: "error",
          message: "You aren't able to modify this...",
          visible: true,
        });
        const index = this.training_list.findIndex(
          (u) => u.id == updateTraining.id
        );
        this.training_list[index] = isActive
          ? { ...this.training_list[index], active: !this.training_list[index] }
          : this.training_list[index];
      } else {
        let formData = new FormData();

        formData.append("creator_id", updateTraining.creator_id);
        formData.append("categorie", updateTraining.categorie);
        formData.append("color", updateTraining.color ?? "");
        formData.append("level", updateTraining.level);
        formData.append("title", updateTraining.title);
        if (
          typeof updateTraining.image == "string" ||
          typeof updateTraining.image == "undefined"
        ) {
          formData.append("image", String(updateTraining.image));
        } else {
          formData.append("image", updateTraining.image as File);
        }

        formData.append("description", updateTraining.description);
        formData.append("domainId", String(updateTraining.domainId));
        formData.append("active", String(updateTraining.active));

        const response: AxiosResponse = await service.updateTraining(
          updateTraining.id,
          formData
        );

        if (response.status == 200 || response.status == 201) {
          let data = response.data as TrainingResponse;
          let product = { ...data.data };

          const index = this.training_list.findIndex((u) => u.id == product.id);
          if (index !== -1) {
            this.training_list[index] = product;
          }
        } else if (response.status == 404) {
          console.log("error-not-found =>", response.data);
        } else if (response.status == 500) {
          console.log("error =>", response.data);
        }
      }
    },

    async deleteTraining(trainingId: number) {
      const response: AxiosResponse =
        service.deleteTraining && (await service.deleteTraining(trainingId));

      if (response.status == 200 || response.status == 201) {
        let data = response.data as TrainingDeleteResponse;

        console.log("data-training-deleted =>", data.data);

        // Supprimer le domaine
        const index = this.training_list.findIndex(
          (d) => d.id === data.data.id
        );
        this.training_list.splice(index, 1);
      } else if (response.status == 500) {
        console.log("error =>", response.data.message);
      }
    },

    setDelete(toDelete: Domain | Formation) {
      this.toDelete = toDelete;
    },

    addCourseToTraining(formationId: string | number, courseToAdd: Course) {
      const index = this.training_list.findIndex((u) => u.id == formationId);

      if (index && index != -1) {
        this.training_list[index].courses?.push(courseToAdd);
      }
    },
  },
});

export default useTrainingsStore;
