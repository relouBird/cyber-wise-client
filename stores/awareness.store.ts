import type { AxiosResponse } from "axios";
import { mockCampaignsConstant } from "~/constants/awareness.constant";
import useActivitiesService from "~/services/activities.service";
import type { ActivitiesResponse, ActivityType } from "~/types/activity.type";
import type { Campaign, UpdateCampaignData } from "~/types/awareness.type";

type StateProps = {
  campaign_list: Campaign[];
};

const service = useActivitiesService();

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
      setTimeout(() => {
        this.campaign_list = [...mockCampaignsConstant];
      }, 500);
    },

    async updateCampaignById(campaignToUpdate: UpdateCampaignData) {
      setTimeout(() => {
        const index = this.campaign_list.findIndex(
          (c) => c.id == campaignToUpdate.id
        );

        if (index !== -1) {
          const campagneAt: Campaign = {
            ...this.campaign_list[index],
            ...campaignToUpdate,
            updatedAt: new Date(),
          };
          this.campaign_list[index] = campagneAt;
          console.log("campaign-updated =>", this.campaign_list[index]);
        } else {
          throw new Error("Campagne non trouvée");
        }
      }, 500);
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
