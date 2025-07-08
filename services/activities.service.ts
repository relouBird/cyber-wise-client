import type { AxiosResponse } from "axios";
import { request } from "~/helpers/request_axios";
import type { ServiceProps } from "~/types/common.type";

export default function useActivitiesService(): ServiceProps {
  /**
   * Fetch all tests...
   */
  const fetchAll = async (): Promise<AxiosResponse> => {
    return await request(`/admin/activity`, {
      method: "get",
    });
  };

  const fetch = async (id: string): Promise<AxiosResponse> => {
    return await request(`/admin/activity/${id}`, {
      method: "get",
    });
  };

  return {
    fetchAll,
    fetch,
  };
}
