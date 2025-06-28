// plugins/vuetify.js
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            primary: "rgb(255,107,157)",
            secondary: "#764ba2",
            fontcolor:"rgba(26,26,46,0.25)",
            fontcolorSecond:"#1a1a2e",
            accent: "#ff6b9d",
            error: "#ff5252",
            info: "#2196f3",
            success: "#4caf50",
            warning: "#ffc107",
          },
        },
      },
    },
    defaults: {
      VCard: {
        VCardTitle: {
          style: "font-family: Manrope; font-weight: 700;",
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
