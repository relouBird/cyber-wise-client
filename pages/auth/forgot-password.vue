<script setup>
// Définir le layout à utiliser
definePageMeta({
  layout: "auth",
});

// Meta tags
useHead({
  title: "Mot de passe oublié ? - SafeSteps",
  meta: [
    { name: "description", content: "Retrouvez votre mot de passe maintenant" },
  ],
});

// Variables réactives

// Variables réactives
const email = ref("");
const loading = ref(false);
const otpState = ref("step1");
const otpValue = ref("");

// mot de passe
const password = ref("");
const confirmpassword = ref("");
const showPassword = ref(false);

// Méthodes
const handleLogin = async () => {
  loading.value = true;
  try {
    // Simulation d'une connexion
    if (otpState.value == "step1") {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Ici vous ajouteriez votre logique de connexion
      console.log("Email à verifier :", email.value);
      otpState.value = "step2";
    } else if (otpState.value == "step2") {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Ici vous ajouteriez votre logique de connexion
      console.log("OTP à verifier :", otpValue.value);
      otpState.value = "step3";
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    // Redirection après connexion réussie
    // await navigateTo("/dashboard");
  } catch (error) {
    console.error("Erreur de connexion:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-card class="login-card" elevation="0">
    <v-card-text class="text-center pa-6">
      <!-- Logo -->
      <div class="logo-section mb-0">
        <div class="logo-square">
          <img src="@/assets/images/image1.png" alt="">
        </div>
        <h2 class="logo-text font-manrope font-manrope-400">SafeSteps</h2>
      </div>

      <!-- Titre de bienvenue -->
      <h2 class="welcome-title mb-2">Forgot password</h2>

      <!-- Formulaire -->
      <v-form @submit.prevent="handleLogin">
        <div v-if="otpState == 'step1'" class="">
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

        <div v-if="otpState == 'step2'">
          <v-otp-input
            type="number"
            v-model="otpValue"
            max-width="360px"
            class="mb-2"
            height="80px"
            length="6"
            rounded="md"
            :height="undefined"
          />
        </div>

        <div v-if="otpState == 'step3'">
          <div class="">
            <label class="form-label">Password</label>
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Your New password"
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
              v-model="confirmpassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Confirm Your password"
              variant="outlined"
              class="custom-input"
              required
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
            ></v-text-field>
          </div>
        </div>

        <!-- Bouton de connexion -->
        <v-btn type="submit" class="login-btn mb-6" block :loading="loading">
          {{
            otpState == "step1"
              ? "Verify Now"
              : otpState == "step2"
              ? "Verify OTP"
              : "Change Password"
          }}
        </v-btn>
      </v-form>

      <!-- Liens utiles -->
      <div class="auth-links">
        <!-- Liens utiles -->
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
