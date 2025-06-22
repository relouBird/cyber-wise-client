import useAuthStore from "~/stores/auth.store";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to , from) => {
  const auth = useAuthStore();
  console.log("route actuelle =>", to.path);
  if (to.path.includes("enterprise") && auth.type != "enterprise") {
    return navigateTo("/");
  } else if(!to.path.includes("enterprise") && auth.type != "employee") {
    return navigateTo("/enterprise");
  } else if(to.path.includes("configuration") && auth.is_configuring == false) {
    return navigateTo("/enterprise");
  }
});
