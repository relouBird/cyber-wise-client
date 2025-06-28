<script setup>
import { times, days } from "~/constants/configuration.constant";
import useAuthStore from "~/stores/auth.store";

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

// declaration de la store...
const authStore = useAuthStore();

const periodOnDay = ref("");
const periodOnWeek = ref("");
const step = ref(0);

const timesData = reactive(times);
const daysData = reactive(days);

const previousFunction = (prev) => {
  if (step.value == 0) {
    // nothing
  } else {
    step.value--;
    prev();
  }
  console.log("step =>", step.value);
};

const nextFunction = (next) => {
  if (periodOnWeek.value != "" && step.value == 1) {
    authStore.SecondStepConfiguring();
  } else if (periodOnDay.value != "" && step.value == 0) {
    next();
    step.value++;
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
            ? "Combien de temps souhaitez-vous consacrer à l'apprentissage ?"
            : "Combien de jours par semaine à consacrer à l'apprentissage ?"
        }}
      </h2>
      <v-stepper>
        <template v-slot:default="{ prev, next }">
          <v-stepper-header>
            <v-stepper-item
              color="primary"
              title="Sur un jour"
              value="1"
            ></v-stepper-item>
            <div class="step-divider"></div>
            <v-stepper-item
              color="primary"
              title="On a Week"
              value="2"
            ></v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <v-stepper-window-item value="1">
              <v-radio-group v-model="periodOnDay">
                <ChoiceBox
                  v-for="data in timesData"
                  :title="data.title"
                  :option="data.option"
                  :isFirst="data.title.toLowerCase() == 'casual'"
                  :isLast="data.title.toLowerCase() == 'serious'"
                  v-model:model-value="periodOnDay"
                />
              </v-radio-group>
            </v-stepper-window-item>
            <v-stepper-window-item value="2">
              <v-radio-group v-model="periodOnWeek">
                <ChoiceBox
                  v-for="data in daysData"
                  :title="data.title"
                  :option="data.option"
                  :isFirst="data.title.toLowerCase() == 'a little'"
                  :isLast="data.title.toLowerCase() == 'a lot'"
                  v-model:model-value="periodOnWeek"
                />
              </v-radio-group>
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
  padding-bottom: 15px !important;
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
  min-height: 45vh;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 300;
  color: white;
  margin: 0 auto;
  padding: 0 1em;
  letter-spacing: 2px;
}

/* Responsive */
@media (max-width: 600px) {
  .login-card {
    min-height: 40vh;
  }
}
</style>
