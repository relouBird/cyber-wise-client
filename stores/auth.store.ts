import type { AxiosResponse } from "axios";
import useAuthService from "~/services/auth.service";
import type {
  LoginCredentialType,
  RegisterCredentialType,
  User,
  UserResponse,
} from "~/types/user.type";

type StateProps = {
  identifier: string;
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
};

// le service qui gère les requetes
const service = useAuthService();

const useAuthStore = defineStore("auth-store", {
  state: () =>
    <StateProps>{
      identifier: "",
      user: null,
      access_token: null,
      refresh_token: null,
    },
  persist: true,
  getters: {
    getIdentifier: (state) => state.identifier,
  },
  actions: {
    async login(payload: LoginCredentialType) {
      // garde d'abord les données utiles pour le login dans le state
      this.identifier = payload.identifier;
      console.log("identifier =>", this.identifier);

      let response: AxiosResponse =
        service.login && (await service.login(payload));

      if (response.status == 200 || response.status == 201) {
        let data = response.data as UserResponse;
        console.log("data-income =>", data.data);
        this.user = data.data.user;
        this.access_token = data.data.session.access_token;
        this.refresh_token = data.data.session.refresh_token;
        await navigateTo("/");
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      }

      return response;
    },

    async register(payload: RegisterCredentialType) {
      this.identifier = payload.email;

      console.log("identifier =>", this.identifier);

      let response: AxiosResponse =
        service.register && (await service.register(payload));

      if (response.status == 200 || response.status == 201) {
        let data = response.data as UserResponse;
        console.log("data-income =>", data.data);
        this.user = data.data.user;
        this.access_token = data.data.session.access_token;
        this.refresh_token = data.data.session.refresh_token;
        await navigateTo("/");
      } else if (response.status == 500) {
        console.log("error =>", response.data);
      }

      return response;
    },

    async signOut() {
      // this is for signout user....
      this.user = null;
      this.access_token = null;
      this.refresh_token = null;
      await navigateTo("/auth/login");
    },
  },
});

export default useAuthStore;
