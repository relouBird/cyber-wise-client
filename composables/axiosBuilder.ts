import axios, { AxiosError, type AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
import { notify } from "~/helpers/notifications";
import { authAddToken } from "~/helpers/request_axios";
import type { ErrorBackend } from "~/types/error.type";

export default function axiosBuilder() {
  const { public: publicRuntimeConfig } = useRuntimeConfig();

  /**
   * axios setup to use mock service
   */

  const api = axios.create({
    baseURL: `${publicRuntimeConfig.API_BASE_URL}`,
    method: "get",
  });

  /**
   * Se produit juste avant l'envoi de la requête
   */
  api.interceptors.request.use((config) => {
    const auth = config.auth ?? false;
    const requestId = config.headers["x-request-id"] ?? uuidv4();

    if (!config.headers["x-request-id"]) {
      config.headers["x-request-id"] = requestId;
    }

    if (!config.url?.includes("auth")) {
      const token = authAddToken();
      console.log("token =>", token?.slice(0, 10));
      config.headers["Access-Control-Allow-Origin"] = "*";
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    console.log(`[${requestId}] api-request send -->`, config);

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
      const errorParticularity = response.data as ErrorBackend;

      const requestId = response.config.headers["X-Request-Id"];

      console.log(`[${requestId}] api-response-error  -->`, response);
      console.log(
        `[${requestId}] api-response-error  -->`,
        errorParticularity.details
      );

      // Ceci envoie la notification directement dans le store de notifications mais àa partir du helpers
      notify({
        color: "error",
        message: errorParticularity.details,
        visible: true,
      });

      return error.response;

      //   return error;
    }
  );

  return {
    api,
  };
}
