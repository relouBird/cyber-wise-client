<script setup>
// Définir le layout à utiliser
definePageMeta({
  layout: "auth",
});

// Meta tags
useHead({
  title: "S'enregistrer - SafeSteps",
  meta: [{ name: "description", content: "Enregistrez-vous sur SafeSteps" }],
});

// Variables réactives

// Variables réactives
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);

const signWithCredentials = ref(false);

// Méthodes
const handleLogin = async () => {
  loading.value = true;

  try {
    // Simulation d'une connexion
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Ici vous ajouteriez votre logique de connexion
    console.log("Login avec:", {
      email: email.value,
      password: password.value,
    });

    // Redirection après connexion réussie
    await navigateTo("/configuration/first-step");
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

const loginWithCredentials = () => {
  signWithCredentials.value = true;
  // Logique de connexion Apple
};

const loginWithFacebook = () => {
  console.log("Connexion avec Facebook");
  // Logique de connexion Facebook
};
</script>

<template>
  <v-card class="login-card" elevation="0">
    <v-btn
      v-if="signWithCredentials"
      variant="text"
      @click="signWithCredentials = false"
      class="back-space"
      rounded
    >
      <v-icon start><IconsArrowLeftIcon color="white" /></v-icon>
      <p>Back</p>
    </v-btn>
    <v-card-text class="text-center pa-6">
      <!-- Logo -->
      <div :class="'logo-section', signWithCredentials == false ? ' mb-2': ' mb-0'">
      <!-- <div :class=" 'logo-section' + signWithCredentials == false ? ' mb-2': ' mb-0'"> -->
        <div class="logo-square">
          <img src="~/assets/images/image1.png" alt="">
        </div>
        <h2 class="logo-text font-manrope font-manrope-400">SafeSteps</h2>
      </div>

      <!-- Titre de bienvenue -->
      <h2 :class="signWithCredentials == false ? ' mb-7': ' mb-2' + 'welcome-title'">Register Now !</h2>

      <!-- Formulaire -->
      <v-form v-if="signWithCredentials" @submit.prevent="handleLogin">
        <div class="">
          <label class="form-label">Email</label>
          <v-text-field
            v-model="email"
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
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Your password"
            variant="outlined"
            class="custom-input"
            required
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>
        </div>

        <div class="">
          <label class="form-label">Confirm Password</label>
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Confirm Your password"
            variant="outlined"
            class="custom-input"
            required
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>
        </div>

        <v-btn type="submit" class="login-btn mb-6" block :loading="loading">
          Log in
        </v-btn>
      </v-form>

      <div v-if="!signWithCredentials">
        <v-btn
          variant="outlined"
          class="social-btn"
          block
          size="large"
          @click="loginWithCredentials"
        >
          <v-icon start>mdi-email-outline</v-icon>
          With Credentials
        </v-btn>

        <!-- Le diviseur -->
        <Divider title="Or signin with" :spacing="7" />

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
      </div>

      <!-- Liens utiles -->
      <div class="auth-links">
        <p class="mb-2">
          ALready have account ?
          <nuxt-link to="/auth/login" class="auth-link">connect now</nuxt-link>
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.login-card {
  background: rgba(255, 255, 255, 0.05) !important;
  position: relative;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px !important;
  width: 100%;
}

.back-space {
  position: absolute;
  top: 0.5em;
  left: 0.5em;
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

.logo-square img{
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
