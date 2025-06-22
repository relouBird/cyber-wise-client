<script setup>
import { reasons, interest } from "~/constants/configuration.constant";

// Définir le layout à utiliser
definePageMeta({
  layout: "auth",
  middleware: ["auth", "user"],
});

// Meta tags
useHead({
  title: "Configuration - SafeSteps",
  meta: [{ name: "description", content: "Configurer votre espace" }],
});

const whyLearnBool = ref("");
const interestBool = ref("");
const step = ref(0);

const reasonsDatas = reactive(reasons);
const interestDatas = reactive(interest);

const previousFunction = (prev) => {
  if (step.value == 0) {
    // nothing
  } else {
    step.value = step.value - 1;
    prev();
  }
  console.log("step =>", step.value);
};

const nextFunction = async (next) => {
  if (interestBool.value != "" && step.value == 1) {
    await navigateTo("/enterprise/configuration/second-step");
  } else if (whyLearnBool.value != "" && step.value == 0) {
    next();
    step.value = step.value + 1;
  } else {
    // nothing...
  }
  console.log("step =>", step.value);
};
</script>

<template>
  <v-card class="login-card" elevation="0">
    <v-card-text class="text-center pa-6">
      <h2 class="logo-text pt-2 pb-4 font-manrope font-manrope-400">
        {{
          step == 0
            ? "Dans quel but principal allez-vous utiliser cette application ?"
            : "Quels types d'utilisateurs allez-vous inviter dans votre espace ?"
        }}
      </h2>
      <v-stepper>
        <template v-slot:default="{ prev, next }">
          <v-stepper-header>
            <v-stepper-item
              color="primary"
              title="Raison"
              value="1"
            ></v-stepper-item>
            <div class="step-divider"></div>
            <v-stepper-item
              color="primary"
              title="Most Interest"
              value="2"
            ></v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <v-stepper-window-item value="1">
              <learn-reason
                v-for="data in reasonsDatas"
                :img="data.image"
                :title="data.title"
                :option="data.option"
                v-model="whyLearnBool"
              />
            </v-stepper-window-item>
            <v-stepper-window-item value="2">
              <learn-reason
                v-for="data in interestDatas"
                :img="data.image"
                :title="data.title"
                :option="data.option"
                v-model="interestBool"
              />
            </v-stepper-window-item>
          </v-stepper-window>

          <div class="w-full d-flex justify-space-between">
            <v-btn
              variant="plain"
              class="opacity-70"
              @click="
                () => {
                  previousFunction(prev);
                }
              "
              >Previous</v-btn
            >
            <v-btn
              variant="tonal"
              color="primary"
              @click="
                () => {
                  nextFunction(next);
                }
              "
              >Next</v-btn
            >
          </div>
        </template>
      </v-stepper>
    </v-card-text>
  </v-card>
</template>

<style scoped>
:deep(.v-stepper),
:deep(.v-stepper-header),
:deep(.v-stepper-item),
:deep(.v-stepper-window),
:deep(.v-stepper-actions) {
  margin: 0 !important;
  padding: 0 !important;
  box-shadow: none !important;
  background: transparent;
}

:deep(.v-stepper-header) {
  padding: 0 20px !important;
  padding-bottom: 25px !important;
}

:deep(.v-stepper-window) {
  padding-bottom: 5px !important;
}

.step-divider {
  flex-grow: 1;
  height: 1px;
  background-color: #75757542;
  margin: 0 10px;
}

.login-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px !important;
  width: 100%;
  min-height: 65vh;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 300;
  color: white;
  padding: 0 1em;
  margin: 0 auto;
  letter-spacing: 2px;
}

/* Responsive */
@media (max-width: 600px) {
  .login-card {
    min-height: 40vh;
  }
}
</style>
