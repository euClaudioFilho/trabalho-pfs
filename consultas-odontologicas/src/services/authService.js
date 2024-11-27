import axios from "axios";

const BASE_URL = "http://localhost:5112";

const authService = {
  login: async (email, senha) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, senha });

      const token = response.data.token;

      const payload = JSON.parse(atob(token.split(".")[1]));

      const usuario = {
        token,
        pacienteId: response.data.pacienteId || null,
        dentistaId: response.data.dentistaId || null,
        tipo: payload.role || "Desconhecido",
        nome: response.data.nome,
      };

      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("token", token); 

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return usuario;
    } catch (error) {
      console.error("Erro no login:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Erro ao realizar login. Tente novamente."
      );
    }
  },

  register: async (dadosUsuario) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, dadosUsuario);
      return response.data;
    } catch (error) {
      console.error("Erro no registro:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Erro ao registrar usuário. Tente novamente."
      );
    }
  },

  logout: () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  },

  getUsuario: () => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      return !isExpired;
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      return false;
    }
  },
};

export default authService;
