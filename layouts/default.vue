<script setup lang="ts">
import useAuthStore from "~/stores/auth.store";

const authStore = useAuthStore();
const route = useRoute();

// État de la sidebar mobile
const drawer = ref(false);

interface MenuItem {
  title: string;
  to: string;
  icon: string;
}

// Données de navigation
const navigationItems = [
  { title: "Accueil", to: "/", icon: "mdi-home" },
  { title: "Cours", to: "/courses", icon: "mdi-school" },
  { title: "Campagnes", to: "/awareness", icon: "mdi-shield-account" },
  { title: "Practice", to: "/projects", icon: "mdi-folder-multiple" },
  { title: "Profile", to: "/profile", icon: "mdi-account" },
];

// Notifications (exemple)
const notifications = ref(3);

// Actions utilisateur
const userActions = [
  {
    title: "Profil",
    icon: "mdi-account-circle",
    action: () => navigateTo("/profile"),
  },
  {
    title: "Paramètres",
    icon: "mdi-cog",
    action: () => navigateTo("/settings"),
  },
  { title: "Aide", icon: "mdi-help-circle", action: () => navigateTo("/help") },
  { title: "Déconnexion", icon: "mdi-logout", action: handleLogout },
];

// Année courante
const currentYear = new Date().getFullYear();

// Fonction pour vérifier si un élément de menu est actif
const isMenuItemActive = (item: MenuItem): boolean => {
  if (!item.to) return false;

  // Si c'est exactement la même route
  if (route.path === item.to) return true;

  // Si la route actuelle commence par le chemin de l'élément (pour les sous-pages)
  // ET que ce n'est pas juste le préfixe de base
  if (item.to !== "/enterprise" && route.path.startsWith(item.to + "/")) {
    return true;
  }

  return false;
};

// Fonction de déconnexion
async function handleLogout() {
  // ceci appelle auth et le deconnecte
  await authStore.signOut();
}
</script>

<template>
  <v-app class="admin-layout">
    <!-- Background avec les formes géométriques -->
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>

    <!-- Navigation principale -->
    <v-app-bar
      :elevation="2"
      color="primary"
      density="comfortable"
      class="main-header px-2"
    >
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
          class="d-lg-none"
        ></v-app-bar-nav-icon>
      </template>

      <!-- Logo -->
      <nuxt-link to="/" class="logo-link">
        <div class="logo-container">
          <div class="logo-square-small">
            <img src="~/assets/images/image1.png" alt="" />
          </div>
          <span class="logo-text-small font-manrope font-manrope-400">
            SecuriConscience
          </span>
        </div>
      </nuxt-link>

      <v-spacer></v-spacer>

      <!-- Navigation desktop -->
      <div class="d-none d-lg-flex align-center">
        <div v-for="item in navigationItems">
          <v-btn
            :key="item.title"
            :to="item.to"
            color="primary"
            variant="text"
            class="nav-btn"
            v-if="route.path == item.to"
          >
            <v-icon start>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>

          <v-btn
            :key="item.icon"
            :to="item.to"
            variant="text"
            class="nav-btn"
            :class="{ 'v-list-item--active': isMenuItemActive(item) }"
            v-else
          >
            <v-icon start>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
        </div>
      </div>

      <v-spacer></v-spacer>

      <!-- Actions utilisateur -->
      <div class="user-actions">
        <v-btn icon variant="text" class="mr-2">
          <v-icon>mdi-bell-outline</v-icon>
          <v-badge
            v-if="notifications > 0"
            :content="notifications"
            color="error"
            floating
          ></v-badge>
        </v-btn>

        <!-- Menu utilisateur -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar size="32" color="accent">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-list class="bg-fontcolor">
            <v-list-item
              v-for="action in userActions"
              :key="action.title"
              @click="action.action"
            >
              <v-list-item-title class="d-flex align-center"
                ><v-icon>{{ action.icon }}</v-icon>
                <p class="pt-1 pl-3">{{ action.title }}</p></v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Sidebar mobile -->
    <v-navigation-drawer v-model="drawer" temporary class="mobile-drawer">
      <v-list>
        <v-list-item
          v-for="item in navigationItems"
          :key="item.title"
          :to="item.to"
          @click="drawer = false"
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenu principal -->
    <v-main>
      <div class="main-content">
        <slot />
      </div>
    </v-main>

    <!-- Footer -->
    <v-footer class="main-footer py-0" color="surface">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <div class="footer-logo">
              <div class="logo-square-small">
                <img src="~/assets/images/image1.png" alt="" />
              </div>
              <span class="logo-text-small font-manrope font-manrope-400"
                >SecuriConscience</span
              >
            </div>
            <p class="footer-text mt-2">
              Plateforme d'apprentissage moderne pour apprentis en hacking
            </p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <p class="footer-copyright mt-3">
              &copy; {{ currentYear }} SecuriConscience. Tous droits réservés.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped>
.v-list-item--active {
  background: rgba(255, 107, 157,0.2);
  color: rgb(255, 107, 157);
}

.admin-layout {
  /* background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%); */
  background: linear-gradient(
      135deg,
      #1a1a2ea2 0%,
      #16213ea2 50%,
      #0f3460a2 100%
    ),
    url("/assets/images/configuration/font1.jpg");
  min-height: 100vh;
  position: relative;
}

.background-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.background-shapes .shape {
  position: absolute;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(233, 30, 99, 0.1),
    rgba(156, 39, 176, 0.1)
  );
  backdrop-filter: blur(20px);
}

.shape.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  right: 10%;
  transform: rotate(45deg);
  background: linear-gradient(
    135deg,
    rgba(233, 30, 99, 0.15),
    rgba(156, 39, 176, 0.1)
  );
  z-index: -1;
}

.shape.shape-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 5%;
  transform: rotate(-30deg);
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.1),
    rgba(33, 150, 243, 0.1)
  );
  z-index: -1;
}

.shape.shape-3 {
  width: 180px;
  height: 180px;
  top: 50%;
  right: 5%;
  transform: rotate(15deg);
  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.1),
    rgba(255, 152, 0, 0.1)
  );
  z-index: -1;
}

.shape.shape-4 {
  width: 120px;
  height: 120px;
  bottom: 10%;
  right: 30%;
  transform: rotate(-45deg);
  background: linear-gradient(
    135deg,
    rgba(156, 39, 176, 0.1),
    rgba(63, 81, 181, 0.1)
  );
  z-index: -1;
}

.main-header {
  background: rgba(26, 26, 46, 0.85) !important;
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
}

.logo-link {
  text-decoration: none;
  color: inherit;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-square-small {
  width: 30px;
  height: 30px;
  border-radius: 12px;
}

.logo-square-small img {
  width: 100%;
  height: auto;
  transform: translateY(-2px);
}

.logo-text-small {
  font-size: 1.25rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: white;
}

.nav-btn {
  margin: 0 4px;
  text-transform: none;
  font-weight: 500;
}

.user-actions {
  display: flex;
  align-items: center;
}

.mobile-drawer {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
}

.main-content {
  min-height: calc(100vh - 120px);
  padding: 0;
}

.main-footer {
  background: rgba(26, 26, 46, 0.85) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding: 2rem 0;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ff6b9d;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-links {
    justify-content: flex-start;
    margin-bottom: 1rem;
  }

  .footer-copyright {
    text-align: left !important;
  }
}
</style>
