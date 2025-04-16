import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const apiService = {
  // Vérifie la présence du token avant de faire la requête
  getAuthToken: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Token introuvable, veuillez vous reconnecter.");
    }
    return token;
  },

  // Soumettre une demande de matériel
  submitMaterialRequest: async (formData) => {
    try {
      const token = apiService.getAuthToken();  // Vérifie si le token est présent
      const transformedData = {
        nom_materiel: formData.material_name,
        quantite: formData.quantity,
        justification: formData.justification
      };

      const response = await axios.post(`${API_URL}/demandes`, transformedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la soumission de la demande:', error);
      throw error;
    }
  },

  // Récupérer toutes les demandes de matériel
  getMaterialRequests: async () => {
    try {
      const token = apiService.getAuthToken();  // Vérifie si le token est présent
      const response = await axios.get(`${API_URL}/demandes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      if (error.response && error.response.status === 401) {
        alert('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw error;
    }
  },

  // Récupérer les demandes de l'utilisateur connecté
  getUserRequests: async () => {
    try {
      const token = apiService.getAuthToken();  // Vérifie si le token est présent
      const response = await axios.get(`${API_URL}/user/material-requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes de l\'utilisateur:', error);
      if (error.response && error.response.status === 401) {
        alert('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw error;
    }
  },

  // Obtenir le cookie CSRF pour les requêtes protégées
  getCSRFToken: async () => {
    try {
      const response = await axios.get(`${API_URL}/sanctum/csrf-cookie`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération du cookie CSRF:', error);
      throw error;
    }
  }
};

export default apiService;
