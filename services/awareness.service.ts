import type { AxiosResponse } from "axios";
import { request } from "~/helpers/request_axios";
import type { Campaign, CreateCampaignData } from "~/types/awareness.type";
import type { ServiceProps } from "~/types/common.type";

export default function useAwarenessService(): ServiceProps {
  /**
   * Fetch all tests...
   */
  const fetchAll = async (): Promise<AxiosResponse> => {
    return await request(`/admin/campaigns`, {
      method: "get",
    });
  };

  const fetch = async (id: string): Promise<AxiosResponse> => {
    return await request(`/admin/campaigns/${id}`, {
      method: "get",
    });
  };

  const createCampaign = async (
    payload: CreateCampaignData
  ): Promise<AxiosResponse> => {
    return await request(`/admin/campaigns`, {
      method: "post",
      data: payload,
    });
  };

  const updateCampaign = async (
    campaignId: string,
    payload: Campaign
  ): Promise<AxiosResponse> => {
    return await request(`/admin/campaigns/${campaignId}`, {
      method: "put",
      data: payload,
    });
  };

  return {
    fetchAll,
    fetch,
    createCampaign,
    updateCampaign,
  };
}
