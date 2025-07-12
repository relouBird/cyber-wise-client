import type { AxiosResponse } from "axios";
import { request } from "~/helpers/request_axios";
import type { ServiceProps } from "~/types/common.type";
import type { Domain, FormationSub } from "~/types/trainings.type";

export default function useTrainingService(): ServiceProps {
  /**
   * Fetch all les Domains...
   */
  const fetchAllDomains = async (): Promise<AxiosResponse> => {
    return await request(`/admin/domains`, {
      method: "get",
    });
  };

  /**
   * Cette fonction permet de créer un service...
   */
  const createDomain = async (payload: Domain) => {
    return await request(`/admin/domains`, {
      method: "post",
      data: payload,
    });
  };

  /**
   * Cette fonction permet de créer un service...
   */
  const updateDomain = async (id: string, payload: Domain) => {
    return await request(`/admin/domains/${id}`, {
      method: "put",
      data: payload,
    });
  };

  /**
   * Cette fonction permet de créer un service...
   */
  const deleteDomain = async (id: string) => {
    return await request(`/admin/domains/${id}`, {
      method: "delete",
    });
  };

  /**
   * Fetch all les Formations...
   */
  const fetchAllTrainings = async (): Promise<AxiosResponse> => {
    return await request(`/admin/trainings`, {
      method: "get",
    });
  };

  /**
   * Fetch all les Formations...
   */
  const fetchAllSubTrainings = async (id: string): Promise<AxiosResponse> => {
    return await request(`/trainings/${id}/all`, {
      method: "get",
    });
  };

  /**
   * Permet de creer un la soucrisption a une formation
   */
  const createSubTraining = async (
    id: string,
    payload: FormationSub
  ): Promise<AxiosResponse> => {
    return await request(`/trainings/${id}`, {
      method: "post",
      data: payload,
    });
  };

  /**
   * Cette fonction permet de créer un service...
   */
  const createTraining = async (payload: Domain) => {
    return await request(`/admin/trainings`, {
      method: "post",
      data: payload,
    });
  };

  /**
   * Cette fonction permet de créer un service...
   */
  const updateTraining = async (id: string, payload: Domain) => {
    return await request(`/admin/trainings/${id}`, {
      method: "put",
      data: payload,
    });
  };

  /**
   * Cette fonction permet de créer un service...
   */
  const deleteTraining = async (id: string) => {
    return await request(`/admin/trainings/${id}`, {
      method: "delete",
    });
  };

  return {
    fetchAllDomains,
    fetchAllTrainings,
    fetchAllSubTrainings,
    createDomain,
    createTraining,
    createSubTraining,
    updateDomain,
    updateTraining,
    deleteDomain,
    deleteTraining,
  };
}
