import type { AxiosResponse } from "axios";
import useAuthStore from "~/stores/auth.store";

export const request = async (
  uri: string,
  options: any = {}
): Promise<AxiosResponse> => {
  options.url = uri;
  const { api } = axiosBuilder() as any;
  return await api.request(options);
};

export const authAddToken = () => {
  const authStore = useAuthStore();

  return authStore.access_token;
};
