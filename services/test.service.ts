import type { AxiosResponse } from "axios";
import { request } from "~/helpers/request_axios";
import type { ServiceProps } from "~/types/common.type";

export default function useTestService(): ServiceProps {
  /**
   * Fetch all tests...
   */
  const fetchAll = async (): Promise<AxiosResponse> => {
    return await request(`/test`, {
      method: "get",
    });
  };

  return {
    fetchAll,
  };
}
