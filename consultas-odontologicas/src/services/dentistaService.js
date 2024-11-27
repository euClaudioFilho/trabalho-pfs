import axios from "axios";

const BASE_URL = "http://localhost:5112";

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const dentistaService = {
  async getDentistas() {
    try {
      const response = await axios.get(`${BASE_URL}/dentistas`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dentistas:", error);
      throw new Error(error.response?.data?.message || "Erro ao buscar dentistas.");
    }
  },

  async addDentista(dentista) {
    try {
      const response = await axios.post(`${BASE_URL}/dentistas`, dentista);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar dentista:", error);
      throw new Error(error.response?.data?.message || "Erro ao adicionar dentista.");
    }
  },

  async updateDentista(id, dentista) {
    try {
      const response = await axios.put(`${BASE_URL}/dentistas/${id}`, dentista);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar dentista:", error);
      throw new Error(error.response?.data?.message || "Erro ao atualizar dentista.");
    }
  },

  async deleteDentista(id) {
    try {
      await axios.delete(`${BASE_URL}/dentistas/${id}`);
    } catch (error) {
      console.error("Erro ao excluir dentista:", error);
      throw new Error(error.response?.data?.message || "Erro ao excluir dentista.");
    }
  },
};

export default dentistaService;
