<script setup>
import * as yup from "yup";
import useAuthStore from "~/stores/auth.store";

// Définir le layout à utiliser
definePageMeta({
  layout: "auth",
  middleware: "auth-default"
});

// Meta tags
useHead({
  title: "Connexion - SafeSteps",
  meta: [
    { name: "description", content: "Connectez-vous à votre compte SafeSteps" },
  ],
});

const authStore = useAuthStore();
const store = storeToRefs(authStore);

// Creer un formulaire reactif
const form = useForm(
  yup.object().shape({
    email: yup.string().email(),
    password: yup.string().min(6, "Password is too weak").required(),
  }),
  {
    email: store.identifier.value ?? "",
    password: "",
  }
);

const showPassword = ref(false);
const loading = ref(false);

// Méthodes
const handleLogin = async () => {
  loading.value = true;

  try {
    await form.submit(async () => await authStore.login(form.data));

    form.clear();
    form.data.password = "";
    loading.value = false;
  } catch (error) {
    console.error("Erreur de connexion:", error);
  } finally {
    loading.value = false;
  }
};

const loginWithGoogle = () => {
  console.log("Connexion avec Google");
  // Logique de connexion Google
};

const loginWithFacebook = () => {
  console.log("Connexion avec Facebook");
  // Logique de connexion Facebook
};
</script>

<template>
  <v-card class="login-card" elevation="0">
    <v-card-text class="text-center pa-6">
      <!-- Logo -->
      <div class="logo-section mb-2">
        <div class="logo-square">
          <img src="~/assets/images/image1.png" alt="" />
        </div>
        <h2 class="logo-text font-manrope font-manrope-400">SafeSteps</h2>
      </div>

      <!-- Titre de bienvenue -->
      <h2 class="welcome-title mb-4">Welcome back!</h2>

      <!-- Formulaire -->
      <v-form @submit.prevent="handleLogin">
        <div class="">
          <label class="form-label">Email</label>
          <v-text-field
            v-model="form.data.email"
            :error-messages="form.errors.email"
            @change="form.validateField('email')"
            type="email"
            placeholder="Your e-mail"
            variant="outlined"
            class="custom-input"
            required
            dense
          ></v-text-field>
        </div>

        <div class="">
          <label class="form-label">Password</label>
          <v-text-field
            :error-messages="form.errors.password"
            v-model="form.data.password"
            @change="form.validateField('password')"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Your password"
            variant="outlined"
            class="custom-input"
            required
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>
        </div>

        <!-- Bouton de connexion -->
        <v-btn
          type="submit"
          class="login-btn mb-6"
          block
          :disabled="
            form.isInValid instanceof Object
              ? form.isInValid.value
              : form.isInValid ||
                (form.processing instanceof Object
                  ? form.processing.value
                  : form.processing)
          "
          :loading="loading"
        >
          Log in
        </v-btn>
      </v-form>

      <!-- Connexion sociale -->
      <div class="social-login mb-8">
        <v-row no-gutters class="ga-3">
          <v-col>
            <v-btn
              variant="outlined"
              class="social-btn"
              block
              size="large"
              @click="loginWithGoogle"
            >
              <v-icon start>mdi-google</v-icon>
              Google
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              variant="outlined"
              class="social-btn"
              block
              size="large"
              @click="loginWithFacebook"
            >
              <v-icon start>mdi-facebook</v-icon>
              Facebook
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Liens utiles -->
      <div class="auth-links">
        <p class="mb-2">
          Do you have enterprise ?
          <nuxt-link to="/enterprise/auth/register" class="auth-link"
            >Create an account</nuxt-link
          >
        </p>
        <nuxt-link to="/auth/forgot-password" class="auth-link">
          Reset your password
        </nuxt-link>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.login-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px !important;
  width: 100%;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.logo-square {
  width: 30px;
  height: 30px;
  border-radius: 12px;
}

.logo-square img {
  width: 100%;
  height: auto;
  transform: scale(290%);
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 300;
  color: white;
  margin: 0;
  letter-spacing: 2px;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.form-label {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  text-align: left;
}

:deep(.custom-input .v-field) {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 12px !important;
  --v-field-padding-start: 16px; /* Padding horizontal */
}

/* Pour réduire le padding vertical */
:deep(.custom-input .v-field__input) {
  padding-top: 12px !important; /* Ajustez cette valeur */
  padding-bottom: 12px !important; /* Ajustez cette valeur */
  min-height: auto !important; /* Enlève la hauteur minimum imposée */
}

:deep(.custom-input .v-field--focused) {
  border-color: #ff6b9d !important;
  box-shadow: 0 0 0 2px rgba(255, 107, 157, 0.2) !important;
}

:deep(.custom-input .v-field__input input) {
  color: white !important;
  padding: 0 !important; /* Le padding est maintenant géré par .v-field__input */
  opacity: 1 !important; /* Assure la visibilité */
}

:deep(.custom-input .v-field__input input::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
  opacity: 1 !important;
}

:deep(.custom-input .v-field__append-inner) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  text-transform: none !important;
  height: 48px !important;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3) !important;
  transition: all 0.3s ease !important;
}

.login-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4) !important;
}

.social-btn {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  border-radius: 12px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  height: 48px !important;
  backdrop-filter: blur(10px) !important;
  transition: all 0.3s ease !important;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
  transform: translateY(-1px) !important;
}

.auth-links {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.auth-link {
  color: #ff6b9d !important;
  text-decoration: none !important;
  font-weight: 500;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #ff8cc8 !important;
  text-decoration: underline !important;
}

/* Responsive */
@media (max-width: 600px) {
  .login-card {
    margin: 16px;
  }

  .logo-text {
    font-size: 2rem;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .social-login .v-row {
    flex-direction: column;
  }

  .social-login .v-col {
    margin-bottom: 8px;
  }
}
</style>
