<template>
  <div class="auth-layout">
    <!-- Éléments décoratifs -->
    <div class="decorative-elements">
      <div class="floating-square square-1"></div>
      <div class="floating-square square-2"></div>
      <div class="floating-square square-3"></div>
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
    </div>

    <!-- Contenu principal -->
    <v-container fluid class="auth-container">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <div class="auth-card-wrapper">
            <!-- Slot pour le contenu de la page -->
            <slot />
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Footer optionnel -->
    <!-- <div class="auth-footer">
      <p>&copy; {{ currentYear }} Mimo. Tous droits réservés.</p>
    </div> -->
  </div>
</template>

<script setup>
// Métadonnées pour les pages d'authentification
useHead({
  bodyAttrs: {
    class: 'auth-page'
  }
})

</script>

<style scoped>


.auth-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2ea2 0%, #16213ea2 50%, #0f3460a2 100%),url("/assets/images/configuration/font1.jpg");
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-square {
  position: absolute;
  border-radius: 12px;
  opacity: 0.6;
}

.square-1 {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #ff6b9d, #ff8cc8);
  top: 15%;
  right: 10%;
  transform: rotate(15deg);
  animation: float 6s ease-in-out infinite;
}

.square-2 {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  bottom: 20%;
  left: 8%;
  transform: rotate(-20deg);
  animation: float 8s ease-in-out infinite reverse;
}

.square-3 {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #a8edea, #fed6e3);
  top: 60%;
  right: 15%;
  transform: rotate(30deg);
  animation: float 7s ease-in-out infinite;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
}

.circle-1 {
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(255,107,157,0.3) 0%, rgba(255,107,157,0.1) 70%);
  top: 10%;
  left: 5%;
  animation: pulse 4s ease-in-out infinite;
}

.circle-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(78,205,196,0.2) 0%, rgba(78,205,196,0.05) 70%);
  bottom: 10%;
  right: 20%;
  animation: pulse 6s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(15deg); }
  50% { transform: translateY(-20px) rotate(25deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.1); opacity: 0.6; }
}

.auth-container {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 2rem 1rem;
  position: relative;
  z-index: 2;
}

.auth-card-wrapper {
  width: 100%;
  position: relative;
  z-index: 3;
}

/* .auth-footer {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
}

.auth-footer p {
  margin: 0;
} */

/* Responsive */
@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;
  }
  
  .square-1 {
    width: 60px;
    height: 60px;
    right: 5%;
  }
  
  .square-2 {
    width: 45px;
    height: 45px;
    left: 5%;
  }
  
  .circle-1 {
    width: 80px;
    height: 80px;
  }
  
  .circle-2 {
    width: 120px;
    height: 120px;
  }
}

@media (max-width: 480px) {
  .decorative-elements .floating-square,
  .decorative-elements .floating-circle {
    display: none;
  }
}
</style>

<style>
/* Styles globaux pour les pages d'authentification */
body.auth-page {
  margin: 0;
  overflow-x: hidden;
}
</style>