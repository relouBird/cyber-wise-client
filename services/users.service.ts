import type { AxiosResponse } from "axios";
import { request } from "~/helpers/request_axios";
import type { ActivityType } from "~/types/activity.type";
import type { ServiceProps } from "~/types/common.type";
import type { UserProps } from "~/types/constant.type";

export default function useUsersService(): ServiceProps {
  /**
   * Fetch all tests...
   */
  const fetchAll = async (): Promise<AxiosResponse> => {
    return await request(`/admin/users`, {
      method: "get",
    });
  };

  const fetch = async (id: string): Promise<AxiosResponse> => {
    return await request(`/admin/users/${id}`, {
      method: "get",
    });
  };

  const create = async (payload: UserProps): Promise<AxiosResponse> => {
    return await request(`/admin/users`, {
      method: "post",
      data: payload,
    });
  };

  const createActivity = async (
    payload: ActivityType
  ): Promise<AxiosResponse> => {
    return await request(`/admin/activity/user`, {
      method: "post",
      data: payload,
    });
  };

  const update = async (
    id: string,
    payload: UserProps
  ): Promise<AxiosResponse> => {
    return await request(`/admin/users/${id}`, {
      method: "put",
      data: payload,
    });
  };

  const remove = async (id: string) => {
    return await request(`/admin/users/${id}`, {
      method: "delete",
    });
  };

  return {
    fetchAll,
    fetch,
    create,
    createActivity,
    update,
    remove,
  };
}
