import axios, { AxiosError, type AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";

function useAuthentication(): { token: any } {
  throw new Error("Function not implemented.");
}

export default function axiosBuilder() {
  const { public: publicRuntimeConfig } = useRuntimeConfig();

  /**
   * axios setup to use mock service
   */

  const api: any = axios.create({
    baseURL: `${publicRuntimeConfig.API_BASE_URL}`,
    method: "get",
  });

  /**
   * Se produit juste avant l'envoi de la requête
   */
  api.interceptors.request.use((config: any) => {
    const auth = config?.auth ?? false;
    const requestId = config.headers["x-request-id"] ?? uuidv4();

    if (auth) {
      const { token } = useAuthentication();
      config.headers["Authorization"] = `${token.value}`;
    }

    console.log(`[${requestId}] api-request send -->`, config);
    console.log(`[${requestId}] currentConfig.value -->`, config);

    return config;
  });

  /**
   *  Se produit juste après que le serveur distant a repondu
   */
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      const response = error.response as AxiosResponse;

      const requestId = response.config.headers["X-Request-Id"];

      console.log(`[${requestId}] api-response-error  -->`, response);

      return error.response;

      //   return error;
    }
  );

  return {
    api,
  };
}
