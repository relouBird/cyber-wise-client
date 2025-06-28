import type { AxiosResponse } from "axios";
import { request } from "~/helpers/request_axios";
import type { ServiceProps } from "~/types/common.type";
import type { LoginCredentialType, RegisterCredentialType } from "~/types/user.type";

export default function useAuthService(): ServiceProps {
  /**
   * S'Enregistrer via les credentials...
   */
  const register = async (
    payload: RegisterCredentialType
  ): Promise<AxiosResponse> => {
    return await request(`/auth/register`, {
      method: "post",
      data: payload,
    });
  };

  /**
   * Se connecter via les credentials...
   */
  const login = async (
    payload: LoginCredentialType
  ): Promise<AxiosResponse> => {
    return await request(`/auth/login`, {
      method: "post",
      data: payload,
    });
  };

  return {
    register,
    login,
  };
}
