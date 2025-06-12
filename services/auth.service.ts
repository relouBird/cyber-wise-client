import type { AxiosResponse } from "axios";
import { request } from "~/helpers/request_axios";
import type { ServiceProps } from "~/types/common.type";
import type { RegisterCredentialType } from "~/types/user.type";

export default function useAuthService(): ServiceProps {
  /**
   * S'Enregistrer via les credentials...
   */
  const register = async (
    payload: RegisterCredentialType
  ): Promise<AxiosResponse> => {
    return await request(`/users`, {
      method: "post",
      data: payload,
    });
  };

  return {
    register,
  };
}
