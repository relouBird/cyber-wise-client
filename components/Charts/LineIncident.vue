<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line } from "vue-chartjs";

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Interface pour les données (TypeScript)
interface ChartData {
  labels: string[];
  datasets: any[];
}

// Données pour le graphique des incidents
const incidentsData = computed(
  (): ChartData => ({
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [
      {
        label: "Incidents critiques",
        data: [3, 7, 2, 8, 4, 1, 5],
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#1f2937",
        pointBorderWidth: 2,
      },
      {
        label: "Incidents modérés",
        data: [12, 19, 8, 15, 22, 14, 18],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#f59e0b",
        pointBorderColor: "#1f2937",
        pointBorderWidth: 2,
      },
      {
        label: "Incidents mineurs",
        data: [25, 32, 20, 28, 35, 24, 30],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#1f2937",
        pointBorderWidth: 2,
      },
    ],
  })
);

// Options pour le graphique des incidents
const incidentsOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      //   text: 'Tendance des incidents de sécurité',
      font: {
        size: 16,
      },
    },
    legend: {
      position: "bottom" as const,
      align: "end" as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        color: "#6b7280",
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
      backgroundColor: "rgba(31, 41, 55, 0.95)",
      titleColor: "#f9fafb",
      bodyColor: "#f9fafb",
      borderColor: "#374151",
      borderWidth: 1,
      cornerRadius: 8,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        // text: 'Nombre d\'incidents'
      },
      grid: {
        color: "rgba(107, 114, 128, 0.1)",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
}));
</script>

<template>
  <div>
    <!-- Graphique 1: Évolution des incidents de sécurité -->
    <v-card class="pa-6 bg-fontcolor mb-6">
      <v-card-title class="text-h5 mb-4 text-white">
        Evolution des incidents de sécurité - 7 derniers jours
      </v-card-title>
      <div class="chart-container" style="height: 270px">
        <Line :data="incidentsData" :options="incidentsOptions" />
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
}

.v-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
}

.v-card-title {
  font-weight: 600;
  color: #1a1a1a;
}
</style>
