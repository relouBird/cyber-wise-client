<template>
  <v-card class="pa-6 bg-fontcolor">
    <v-card-title class="text-h5 mb-4 text-white">
      Métriques d'engagement
    </v-card-title>
    <div class="chart-container" style="height: 290px">
      <Radar
        :data="radarData"
        :options="radarOptions"
      />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'vue-chartjs'

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

// Interface pour les données
interface ChartData {
  labels: string[]
  datasets: any[]
}

// Données pour le graphique radar
const radarData = computed((): ChartData => ({
  labels: [
    'Nouveaux utilisateurs',
    'Taux de participation',
    'Formations créées',
    'Certifications obtenues',
    'Temps moyen/formation',
    'Satisfaction utilisateurs'
  ],
  datasets: [
    {
      label: 'Cette semaine',
      data: [85, 78, 92, 65, 88, 75],
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3b82f6',
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#1f2937',
      pointBorderWidth: 2,
      pointRadius: 6,
      borderWidth: 3
    },
    {
      label: 'Semaine précédente',
      data: [70, 82, 78, 58, 75, 68],
      fill: true,
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: '#10b981',
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#1f2937',
      pointBorderWidth: 2,
      pointRadius: 5,
      borderWidth: 2,
      borderDash: [5, 5]
    }
  ]
}))

// Options pour le graphique radar
const radarOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      align: 'end' as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        color: '#6b7280',
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      titleColor: '#f9fafb',
      bodyColor: '#f9fafb',
      borderColor: '#374151',
      borderWidth: 1,
      cornerRadius: 8,
      callbacks: {
        label: function(context: any) {
          return `${context.dataset.label}: ${context.parsed.r}%`
        }
      }
    }
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 20,
        color: '#6b7280',
        font: {
          size: 11
        }
      },
      grid: {
        color: 'rgba(107, 114, 128, 0.2)'
      },
      angleLines: {
        color: 'rgba(107, 114, 128, 0.2)'
      },
      pointLabels: {
        color: '#6b7280',
        font: {
          size: 12
        }
      }
    }
  },
  elements: {
    line: {
      borderWidth: 3
    },
    point: {
      radius: 5,
      hoverRadius: 8
    }
  }
}))

// Props pour recevoir des données réelles
interface Props {
  data?: {
    current: number[]
    previous: number[]
  }
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    current: [85, 78, 92, 65, 88, 75],
    previous: [70, 82, 78, 58, 75, 68]
  })
})
</script>

<style scoped>
.chart-container {
  position: relative;
}

.v-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
}

.v-card-title {
  font-weight: 600;
  color: #1a1a1a;
}
</style>