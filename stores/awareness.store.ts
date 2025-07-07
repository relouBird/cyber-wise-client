import type { AxiosResponse } from "axios";
import { mockCampaignsConstant } from "~/constants/awareness.constant";
import useAwarenessService from "~/services/awareness.service";
import type {
  Campaign,
  CampaignResponse,
  CampaignsResponse,
  CreateCampaignData,
  UpdateCampaignData,
} from "~/types/awareness.type";

type StateProps = {
  campaign_list: Campaign[];
};

const service = useAwarenessService();

const useAwarenessStore = defineStore("awareness-store", {
  state: () =>
    <StateProps>{
      campaign_list: [],
    },
  persist: true,
  getters: {
    getCampaigns: (state) => state.campaign_list,
  },
  actions: {
    // ceci permet de recuperer toutes les campagnes d'un org
    async fetchAllCampaigns(id: string) {
      const response: AxiosResponse =
        service.fetch && (await service.fetch(id));

      if (response.status == 200 || response.status == 201) {
        let data = response.data as CampaignsResponse;
        console.log("data-to-response-store =>", data);

        this.campaign_list = [...data.data];
      } else if (response.status == 400) {
        console.log("error =>", response.data);
      }
    },

    async createCampaign(
      creator_id: string,
      org_id: string,
      dataToCreate: CreateCampaignData
    ) {
      const data: CreateCampaignData = {
        ...dataToCreate,
        org_id: org_id,
        createdBy: creator_id,
      };

      let formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("image", data.image as File);
      formData.append("org_id", data.org_id ?? "");
      formData.append("createdBy", data.createdBy ?? "");
      formData.append("startDate", data.startDate.toISOString());
      if (data.endDate) {
        formData.append("endDate", data.endDate?.toISOString());
      }

      formData.append("targetUsers", JSON.stringify(data.targetUsers));
      formData.append("formations", JSON.stringify(data.formations));

      const response: AxiosResponse = await service.createCampaign(formData);

      if (response.status == 200 || response.status == 201) {
        let data = response.data as CampaignResponse;
        console.log("data-to-response-store =>", data);

        this.campaign_list.push(data.data);
      } else if (response.status == 400) {
        console.log("error =>", response.data);
      }
    },

    async updateCampaignById(
      campaignToUpdate: UpdateCampaignData,
      state: boolean
    ) {
      if (state) {
        const index = this.campaign_list.findIndex(
          (c) => c.id == campaignToUpdate.id
        );

        const campagneAt: Campaign = {
          ...this.campaign_list[index],
          ...campaignToUpdate,
          updatedAt: new Date(),
        };

        const response: AxiosResponse =
          service.updateCampaign &&
          (await service.updateCampaign(campaignToUpdate.id, campagneAt));

        if (response.status == 200 || response.status == 201) {
          let data = response.data as CampaignResponse;

          console.log("campaign-updated =>", data.data);
          this.campaign_list[index] = data.data;
        } else if (response.status == 400) {
          console.log("error =>", response.data);
        }
      } else {
      }
    },

    async deleteCampaignById(campaignId: string | number) {
      const index = this.campaign_list.findIndex((c) => c.id == campaignId);
      if (index !== -1) {
        this.campaign_list.splice(index, 1);
      } else {
        throw new Error("Campagne non trouvée");
      }
    },

    async getCampaignParticipants(id: string) {
      return [];
    },
    async getCampaignFormations(id: string) {
      return [];
    },
    async getCampaignIncidents(id: string) {
      return [];
    },
    async removeParticipant(campaignId: string, userId: string) {},
    async removeFormation(campaignId: string, formationId: string) {},
  },
});

export default useAwarenessStore;
