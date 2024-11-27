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

const consultaService = {
  async getConsultasPaciente(pacienteId) {
    try {
      const response = await axios.get(`${BASE_URL}/consultas/paciente/${pacienteId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar consultas do paciente:", error);
      throw new Error(error.response?.data?.message || "Erro ao buscar consultas.");
    }
  },

  async getConsultasDentista(dentistaId) {
    try {
      if (!dentistaId) {
        throw new Error("ID do dentista é obrigatório.");
      }
      const response = await axios.get(`${BASE_URL}/consultas/dentista/${dentistaId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar consultas do dentista:", error);
      throw new Error(error.response?.data?.message || "Erro ao buscar consultas.");
    }
  },

  async agendarConsulta(consulta) {
    try {
      const response = await axios.post(`${BASE_URL}/consultas`, consulta);
      return response.data;
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      if (error.response && error.response.data) {
        console.error("Erro do servidor:", error.response.data);
      }
      throw new Error(error.response?.data?.message || "Erro ao agendar consulta.");
    }
  },

  async atualizarStatusConsulta(consultaId, novoStatus, dentistaId) {
    try {
      const response = await axios.put(
        `${BASE_URL}/consultas/${consultaId}/status?novoStatus=${encodeURIComponent(
          novoStatus
        )}&dentistaId=${dentistaId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status da consulta:", error);
      throw new Error(error.response?.data?.message || "Erro ao atualizar status da consulta.");
    }
  },

  async updateStatusConsulta(consultaId, novoStatus) {
    try {
      const response = await axios.put(`${BASE_URL}/consultas/${consultaId}/status`, {
        status: novoStatus,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar o status da consulta:", error);
      throw new Error(error.response?.data?.message || "Erro ao atualizar o status da consulta.");
    }
  },

  async excluirConsulta(consultaId, dentistaId) {
    try {
      const response = await axios.delete(`${BASE_URL}/consultas/${consultaId}`, {
        data: { dentistaId },
      });
      return response.status === 204;  
    } catch (error) {
      console.error("Erro ao excluir consulta:", error);
      throw new Error(error.response?.data?.message || "Erro ao excluir consulta.");
    }
  },

  async getTotalConsultas() {
    try {
      const response = await axios.get(`${BASE_URL}/consultas/total`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar total de consultas:", error);
      throw new Error(error.response?.data?.message || "Erro ao buscar total de consultas.");
    }
  },

  async getTotalPacientes() {
    try {
      const response = await axios.get(`${BASE_URL}/pacientes/total`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar total de pacientes:", error);
      throw new Error(error.response?.data?.message || "Erro ao buscar total de pacientes.");
    }
  },

  async getTotalDentistas() {
    try {
      const response = await axios.get(`${BASE_URL}/dentistas/total`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar total de dentistas:", error);
      throw new Error(error.response?.data?.message || "Erro ao buscar total de dentistas.");
    }
  },
};

export default consultaService;
