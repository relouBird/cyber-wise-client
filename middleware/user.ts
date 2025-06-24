import useAuthStore from "~/stores/auth.store";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  console.log("route actuelle =>", to.path);
  if (
    to.path.includes("enterprise") &&
    auth.type != "Manager" &&
    auth.type != "enterprise"
  ) {
    return navigateTo("/");
  } else if (
    !to.path.includes("enterprise") &&
    (auth.type == "enterprise" || auth.type == "Manager")
  ) {
    return navigateTo("/enterprise");
  } else if (
    to.path.includes("enterprise") &&
    to.path.includes("configuration") &&
    auth.is_configuring == false
  ) {
    return navigateTo("/enterprise");
  } else if (
    to.path.includes("enterprise") &&
    !to.path.includes("configuration") &&
    auth.is_configuring == true
  ) {
    return navigateTo("/enterprise/configuration/first-step");
  }
});
