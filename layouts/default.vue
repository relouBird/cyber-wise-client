<script setup>
import useAuthStore from "~/stores/auth.store";


const authStore = useAuthStore();

// État de la sidebar mobile
const drawer = ref(false);

// Données de navigation
const navigationItems = [
  { title: "Accueil", to: "/", icon: "mdi-home" },
  { title: "Cours", to: "/courses", icon: "mdi-school" },
  { title: "Projets", to: "/projects", icon: "mdi-folder-multiple" },
  { title: "Communauté", to: "/community", icon: "mdi-account-group" },
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

// Liens du footer
const footerLinks = [
  { title: "À propos", to: "/about" },
  { title: "Contact", to: "/contact" },
  { title: "Confidentialité", to: "/privacy" },
  { title: "Conditions", to: "/terms" },
];

// Année courante
const currentYear = new Date().getFullYear();

// Fonction de déconnexion
async function handleLogout() {
  // ceci appelle auth et le deconnecte
  await authStore.signOut();
}
</script>

<template>
  <v-app>
    <!-- Navigation principale -->
    <v-app-bar
      :elevation="2"
      color="primary"
      density="comfortable"
      class="main-header"
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
          <div class="logo-square-small"></div>
          <span class="logo-text-small">mimo</span>
        </div>
      </nuxt-link>

      <v-spacer></v-spacer>

      <!-- Navigation desktop -->
      <div class="d-none d-lg-flex align-center">
        <v-btn
          v-for="item in navigationItems"
          :key="item.title"
          :to="item.to"
          variant="text"
          class="nav-btn"
        >
          <v-icon start>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
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
          <v-list>
            <v-list-item
              v-for="action in userActions"
              :key="action.title"
              @click="action.action"
            >
              <template v-slot:prepend>
                <v-icon>{{ action.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ action.title }}</v-list-item-title>
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
              <div class="logo-square-small"></div>
              <span class="logo-text-small">mimo</span>
            </div>
            <p class="footer-text mt-2">
              Plateforme d'apprentissage moderne pour apprentis en hacking
            </p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <!-- <div class="footer-links">
              <nuxt-link
                v-for="link in footerLinks"
                :key="link.title"
                :to="link.to"
                class="footer-link"
              >
                {{ link.title }}
              </nuxt-link>
            </div> -->
            <p class="footer-copyright mt-3">
              &copy; {{ currentYear }} Mimo. Tous droits réservés.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped>
.main-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
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
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #ff6b9d, #ff8cc8);
  border-radius: 6px;
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
