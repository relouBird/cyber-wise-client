import {
  mockCampaignsConstant,
  mockIncidentsConstant,
} from "~/constants/awareness.constant";
import useAuthStore from "~/stores/auth.store";
import useAwarenessStore from "~/stores/awareness.store";
import type {
  Campaign,
  CampaignUser,
  Incident,
  CampaignStats,
  CreateCampaignData,
  UpdateCampaignData,
} from "~/types/awareness.type";

export const useSensibilisations = () => {
  const campaignStore = useAwarenessStore();
  const { me } = useAuthStore();

  // États réactifs
  const campaigns = computed(() => campaignStore.getCampaigns);
  const currentCampaign = ref<Campaign | null>(null);
  const campaignUsers = ref<CampaignUser[]>([]);
  const incidents = ref<Incident[]>([]);
  const stats = ref<CampaignStats | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Données mock pour développement
  const mockIncidents: Incident[] = [...mockIncidentsConstant];

  // Fonctions pour les campagnes
  const fetchCampaigns = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Simulation d'appel API
      if (me?.user_metadata.org_id) {
        await campaignStore.fetchAllCampaigns(me?.user_metadata.org_id);
      } else {
        await campaignStore.fetchAllCampaigns(me?.id ?? "");
      }
    } catch (err) {
      error.value = "Erreur lors du chargement des campagnes";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const getCampaignById = (id: string) => {
    const campaign = campaigns.value.find((c) => c.id === id);
    if (campaign) {
      currentCampaign.value = campaign;
      // ici on devrait charger tout les utili
      return campaign;
    }
    return null;
  };

  const getOtherCampaignById = async (id: string) => {
    const index = campaigns.value.findIndex((c) => c.id === id);
    if (index) {
    }
  };

  const createCampaign = async (data: CreateCampaignData) => {
    loading.value = true;
    error.value = null;

    try {
      console.log("data-to-create =>", data);

      if (me?.user_metadata.org_id) {
        await campaignStore.createCampaign(
          me?.id ?? "",
          me?.user_metadata.org_id,
          data
        );
      } else {
        await campaignStore.createCampaign(me?.id ?? "", me?.id ?? "", data);
      }
    } catch (err) {
      error.value = "Erreur lors de la création de la campagne";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCampaign = async (data: UpdateCampaignData, state?: boolean) => {
    loading.value = true;
    error.value = null;
    console.log("Voici l'id =>", data.id);
    console.log("Voici les datas =>", campaigns.value);

    try {
      if (state) {
        await campaignStore.updateCampaignById(data, true);
      }
    } catch (err) {
      error.value = "Erreur lors de la mise à jour de la campagne";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCampaign = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      await campaignStore.deleteCampaignById(id);
    } catch (err) {
      error.value = "Erreur lors de la suppression de la campagne";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const launchCampaign = async (id: string) => {
    return await updateCampaign({ id: id, status: "active" }, true);
  };

  const pauseCampaign = async (id: string) => {
    return await updateCampaign({ id: id, status: "paused" }, true);
  };

  const completeCampaign = async (id: string) => {
    return await updateCampaign({ id: id, status: "completed" }, true);
  };

  // Fonctions pour les incidents
  const fetchIncidents = async (campaignId?: string) => {
    loading.value = true;
    error.value = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      incidents.value = campaignId
        ? mockIncidents.filter((i) => i.campaignId === campaignId)
        : mockIncidents;
    } catch (err) {
      error.value = "Erreur lors du chargement des incidents";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const resolveIncident = async (id: string, notes?: string) => {
    const incident = incidents.value.find((i) => i.id === id);
    if (incident) {
      incident.resolved = true;
      incident.resolvedAt = new Date();
      incident.notes = notes;
    }
  };

  // Fonctions pour les statistiques
  const fetchStats = async () => {
    loading.value = true;
    error.value = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      stats.value = {
        totalCampaigns: campaigns.value.length,
        activeCampaigns: campaigns.value.filter((c) => c.status === "active")
          .length,
        completedCampaigns: campaigns.value.filter(
          (c) => c.status === "completed"
        ).length,
        totalParticipants: campaigns.value
          .flatMap((c) => c.targetUsers) // fusionne tous les targetUsers
          .filter((user, index, self) => self.indexOf(user) === index).length,
        averageCompletionRate:
          campaigns.value.reduce((sum, c) => sum + c.stats.completionRate, 0) /
          campaigns.value.length,
        totalIncidents: mockIncidents.length,
        recentIncidents: mockIncidents.slice(-5),
      };
    } catch (err) {
      error.value = "Erreur lors du chargement des statistiques";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Getters calculés
  const activeCampaigns = computed(() =>
    campaigns.value.filter((c) => c.status === "active")
  );

  const draftCampaigns = computed(() =>
    campaigns.value.filter((c) => c.status === "draft")
  );

  const completedCampaigns = computed(() =>
    campaigns.value.filter((c) => c.status === "completed")
  );

  const unresolvedIncidents = computed(() =>
    incidents.value.filter((i) => !i.resolved)
  );

  const criticalIncidents = computed(() =>
    incidents.value.filter((i) => i.severity === "critical" && !i.resolved)
  );

  return {
    // États
    campaigns,
    currentCampaign,
    campaignUsers,
    incidents,
    stats,
    loading,
    error,

    // Etats courant

    // Fonctions
    fetchCampaigns,
    getCampaignById,
    getOtherCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    launchCampaign,
    pauseCampaign,
    completeCampaign,
    fetchIncidents,
    resolveIncident,
    fetchStats,

    // Getters
    activeCampaigns,
    draftCampaigns,
    completedCampaigns,
    unresolvedIncidents,
    criticalIncidents,
  };
};
