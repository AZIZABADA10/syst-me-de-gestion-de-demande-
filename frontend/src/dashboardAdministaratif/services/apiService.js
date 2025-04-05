// src/services/apiService.js
import axios from 'axios';
import axiosClient from '../../axios-client';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiService = {
  // Méthode pour soumettre une demande de matériel
  submitMaterialRequest: async (requestData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post(`/material-requests`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la soumission de la demande:', error);
      throw error;
    }
  },

  // Méthode pour récupérer les demandes de matériel
  getMaterialRequests: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.get(`/material-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      throw error;
    }
  }
};

export default apiService;