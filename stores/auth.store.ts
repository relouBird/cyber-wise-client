import type { AxiosResponse } from "axios";
import useAuthService from "~/services/auth.service";
import type {
  LoginCredentialType,
  RegisterCredentialType,
} from "~/types/user.type";

type StateProps = {
  identifier: string;
  password: string;
};

// le service qui gère les requetes
const service = useAuthService();

const useAuthStore = defineStore("auth-store", {
  state: () =>
    <StateProps>{
      identifier: "",
      password: "",
    },
  persist: true,
  getters: {
    getIdentifier: (state) => state.identifier,
  },
  actions: {
    async login(payload: LoginCredentialType) {
      const response: AxiosResponse = {} as AxiosResponse;

      // garde d'abord les données utiles pour le login dans le state
      this.identifier = payload.identifier;
      this.password = payload.password ?? "";
    },

    async register(payload: RegisterCredentialType) {
      this.identifier = payload.email;

      console.log("identifier =>", this.identifier);

      let response: AxiosResponse =
        service.register && (await service.register(payload));

      return response;
    },
  },
});

export default useAuthStore;
