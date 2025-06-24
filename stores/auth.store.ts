import type { AxiosResponse } from "axios";
import useAuthService from "~/services/auth.service";
import type {
  LoginCredentialType,
  RegisterCredentialType,
  User,
  UserResponse,
  UserType,
} from "~/types/user.type";

type StateProps = {
  identifier: string;
  type: UserType;
  access_token: string | null;
  refresh_token: string | null;
  expired_at: number | null;
  is_configuring: boolean;
};

// le service qui gère les requetes
const service = useAuthService();

const useAuthStore = defineStore("auth-store", {
  state: () =>
    <StateProps>{
      identifier: "",
      type: "Employé",
      access_token: null,
      refresh_token: null,
      expired_at: null,
      is_configuring: false,
    },
  persist: true,
  getters: {
    getIdentifier: (state) => state.identifier,
  },
  actions: {
    async login(payload: LoginCredentialType) {
      // garde d'abord les données utiles pour le login dans le state
      this.identifier = payload.email;
      console.log("identifier =>", this.identifier);

      let response: AxiosResponse = await service.login(payload);

      if (response.status == 200 || response.status == 201) {
        let data = response.data as UserResponse;
        console.log("data-income =>", data.data);
        this.access_token = data.data.session.access_token;
        this.refresh_token = data.data.session.refresh_token;
        this.expired_at = data.data.session.expires_at * 1000;
        this.type = data.type;
        if (this.type != "enterprise") {
          return navigateTo("/");
        } else {
          return navigateTo("/enterprise");
        }
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      }

      return response;
    },

    async register(payload: RegisterCredentialType) {
      this.identifier = payload.email;

      console.log("identifier =>", this.identifier);

      let response: AxiosResponse = await service.register(payload);

      if (response.status == 200 || response.status == 201) {
        let data = response.data as UserResponse;
        console.log("data-income =>", data.data);
        this.access_token = data.data.session.access_token;
        this.refresh_token = data.data.session.refresh_token;
        this.expired_at = data.data.session.expires_at * 1000;
        this.type = data.type;
        this.is_configuring = true;
        await navigateTo("/enterprise/configuration/first-step");
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      }

      return response;
    },

    async firstStepConfiguring(desc: string) {},

    async SecondStepConfiguring(desc: string) {
      this.is_configuring = false;

      return navigateTo("/enterprise");
    },

    signOut() {
      // Ne jamais l'appeler dans le middleware cause des erreurs inattendus en vide le localstorage meme avant utilisation...
      // this is for signout user....
      this.access_token = null;
      this.refresh_token = null;
      this.expired_at = null;
      return navigateTo("/auth/login");
    },
  },
});

export default useAuthStore;
