<script setup lang="ts">
import { ref, onMounted } from "vue";
import useTrainingsStore from "~/stores/trainings.store";
import useUsersStore from "~/stores/users.store";

// Références pour les canvas
const mainGaugeCanvas = ref<HTMLCanvasElement | null>(null);
const activeUsersCanvas = ref<HTMLCanvasElement | null>(null);
const newFormationsCanvas = ref<HTMLCanvasElement | null>(null);
const avgScoreCanvas = ref<HTMLCanvasElement | null>(null);

// stores
const usersStore = useUsersStore();
const trainingsStore = useTrainingsStore();
// Données réactives
const completionRate = ref(0);
const avgScore = ref(0);

const newFormations = computed(() => {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  return trainingsStore.getTrainings.filter((t) => {
    const createdAt = new Date(t.created_at ?? "");
    return createdAt >= sevenDaysAgo;
  }).length;
});
const allFormations = computed(() => trainingsStore.getTrainings.length);

const activeUsers = computed(
  () => usersStore.getUsers.filter((u) => u.status == "Actif").length
);
const allUsers = computed(() => usersStore.getUsers.length);

// Fonction pour formater les nombres
const formatNumber = (num: number): string => {
  return num.toLocaleString("fr-FR");
};

// Fonction pour dessiner la gauge principale
const drawMainGauge = (
  canvas: HTMLCanvasElement,
  value: number,
  maxValue: number
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 80;
  const lineWidth = 12;

  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessiner le fond de la gauge
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 0.25 * Math.PI);
  ctx.strokeStyle = "#374151";
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.stroke();

  // Dessiner la progression avec la couleur rose de SafeSteps
  const progress = (value / maxValue) * 1.5 * Math.PI;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 0.75 * Math.PI + progress);
  ctx.strokeStyle = "#EC4899";
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.stroke();

  // Point final
  const endAngle = 0.75 * Math.PI + progress;
  const endX = centerX + radius * Math.cos(endAngle);
  const endY = centerY + radius * Math.sin(endAngle);
  ctx.beginPath();
  ctx.arc(endX, endY, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "#EC4899";
  ctx.fill();
};

// Fonction pour dessiner les mini gauges
const drawMiniGauge = (
  canvas: HTMLCanvasElement,
  value: number,
  maxValue: number,
  color: string
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 22;
  const lineWidth = 4;

  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessiner le fond
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#374151";
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Dessiner la progression
  const progress = (value / maxValue) * 2 * Math.PI;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + progress);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.stroke();
};

// Fonction pour animer les gauges
const animateGauges = () => {
  let frame = 0;
  const animate = () => {
    frame++;
    const progress = Math.min(frame / 60, 1);

    if (mainGaugeCanvas.value) {
      drawMainGauge(
        mainGaugeCanvas.value,
        completionRate.value * progress,
        100
      );
    }

    if (activeUsersCanvas.value) {
      drawMiniGauge(
        activeUsersCanvas.value,
        activeUsers.value,
        allUsers.value,
        "#10B981"
      );
    }

    if (newFormationsCanvas.value) {
      drawMiniGauge(
        newFormationsCanvas.value,
        newFormations.value,
        allFormations.value,
        "#F59E0B"
      );
    }

    if (avgScoreCanvas.value) {
      drawMiniGauge(
        avgScoreCanvas.value,
        avgScore.value * progress,
        100,
        "#8B5CF6"
      );
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

onMounted(() => {
  // Mettre à jour les données si props sont fournis

  // Démarrer l'animation
  setTimeout(() => {
    animateGauges();
  }, 200);
});
</script>

<template>
  <v-card class="dashboard-card bg-fontcolor">
    <v-card-title class="dashboard-title">
      <div class="title-content">
        <div class="title-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
            <path
              d="M12 6v6l4 2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <span>Progression des campagnes</span>
      </div>
    </v-card-title>

    <div class="dashboard-content">
      <!-- Gauge principal -->
      <div class="main-gauge-section">
        <div class="main-gauge-wrapper">
          <canvas ref="mainGaugeCanvas" width="200" height="200"></canvas>
          <div class="main-gauge-content pt-6">
            <div class="main-gauge-value">{{ completionRate }}%</div>
            <div class="main-gauge-subtitle">Taux de completion</div>
            <div class="main-gauge-description">Campagne globale terminée</div>
          </div>
        </div>
      </div>

      <!-- Métriques à droite -->
      <div class="metrics-section">
        <div class="metric-item bg-fontcolorthird">
          <div class="metric-icon users-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle
                cx="9"
                cy="7"
                r="4"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M22 21v-2a4 4 0 0 0-3-3.87"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M16 3.13a4 4 0 0 1 0 7.75"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </div>
          <div class="metric-gauge">
            <canvas ref="activeUsersCanvas" width="60" height="60"></canvas>
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ formatNumber(activeUsers) }}</div>
            <div class="metric-label">Utilisateurs actifs</div>
          </div>
        </div>

        <div class="metric-item bg-fontcolorthird">
          <div class="metric-icon formations-icon bg-">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </div>
          <div class="metric-gauge">
            <canvas ref="newFormationsCanvas" width="60" height="60"></canvas>
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ newFormations }}</div>
            <div class="metric-label">Nouvelles formations</div>
          </div>
        </div>

        <div class="metric-item bg-fontcolorthird">
          <div class="metric-icon score-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </div>
          <div class="metric-gauge">
            <canvas ref="avgScoreCanvas" width="60" height="60"></canvas>
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ avgScore }}%</div>
            <div class="metric-label">Score moyen</div>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.dashboard-card {
  border-radius: 12px;
  padding: 24px;
  color: #f9fafb;
}

.dashboard-title {
  padding: 0;
  margin-bottom: 24px;
}

.title-content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #f9fafb;
}

.title-icon {
  width: 24px;
  height: 24px;
  color: #ec4899;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
}

.main-gauge-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-gauge-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-gauge-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.main-gauge-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ec4899;
  line-height: 1;
  margin-bottom: 8px;
}

.main-gauge-subtitle {
  font-size: 14px;
  font-weight: 500;
  color: #d1d5db;
  margin-bottom: 4px;
}

.main-gauge-description {
  font-size: 12px;
  color: #9ca3af;
}

.metrics-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 9px 16px;
  border-radius: 8px;
  border: 1px solid #4b5563;
}

.metric-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.users-icon {
  background: #10b981;
  color: white;
}

.formations-icon {
  background: #f59e0b;
  color: white;
}

.score-icon {
  background: #8b5cf6;
  color: white;
}

.metric-gauge {
  flex-shrink: 0;
}

.metric-info {
  flex: 1;
  text-align: right;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #f9fafb;
  line-height: 1.2;
}

.metric-label {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
  margin-top: 2px;
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .metrics-section {
    flex-direction: row;
    gap: 16px;
  }

  .metric-item {
    flex: 1;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .metric-info {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .dashboard-card {
    padding: 16px;
  }

  .dashboard-content {
    gap: 20px;
  }

  .main-gauge-value {
    font-size: 2rem;
  }

  .metrics-section {
    flex-direction: column;
    gap: 12px;
  }

  .metric-item {
    flex-direction: row;
    text-align: left;
  }

  .metric-info {
    text-align: right;
  }
}
</style>
