import axios from "axios";

const API_URL = "http://localhost:5112";

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const pacienteService = {
  async getPacientes() {
    try {
      const response = await axios.get(`${API_URL}/pacientes`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      throw new Error(error.response?.data?.message || "Erro ao buscar pacientes.");
    }
  },

  async addPaciente(novoPaciente) {
    try {
      const response = await axios.post(`${API_URL}/pacientes`, novoPaciente);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar paciente:", error);
      throw new Error(error.response?.data?.message || "Erro ao adicionar paciente.");
    }
  },

  async updatePaciente(id, pacienteAtualizado) {
    try {
      const response = await axios.put(`${API_URL}/pacientes/${id}`, pacienteAtualizado);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      throw new Error(error.response?.data?.message || "Erro ao atualizar paciente.");
    }
  },

  async deletePaciente(id) {
    try {
      await axios.delete(`${API_URL}/pacientes/${id}`);
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      throw new Error(error.response?.data?.message || "Erro ao excluir paciente.");
    }
  },
};

export default pacienteService;
