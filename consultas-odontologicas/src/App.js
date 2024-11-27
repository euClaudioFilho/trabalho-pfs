import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginView from "./views/LoginView";
import RegistroView from "./views/RegistroView";
import AgendamentoView from "./views/AgendamentoView";
import GerenciamentoPacientesView from "./views/GerenciamentoPacientesView";
import GerenciamentoDentistasView from "./views/GerenciamentoDentsistasView";
import GerenciamentoConsultasView from "./views/GerenciamentoConsultasView";
import HomeAdmin from "./views/HomeAdmin";
import HomeDentista from "./views/HomeDentista";
import HomePaciente from "./views/HomePaciente";
import UnauthorizedView from "./views/UnauthorizedView";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(usuario.tipo)) {
    return <UnauthorizedView />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/register" element={<RegistroView />} />
        <Route path="/login" element={<LoginView />} />

        <Route
          path="/homeAdmin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <HomeAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homeDentista"
          element={
            <ProtectedRoute allowedRoles={["Dentista"]}>
              <HomeDentista />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homePaciente"
          element={
            <ProtectedRoute allowedRoles={["Paciente"]}>
              <HomePaciente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agendamento"
          element={
            <ProtectedRoute allowedRoles={["Paciente"]}>
              <AgendamentoView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gerenciarPacientes"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <GerenciamentoPacientesView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gerenciarDentistas"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <GerenciamentoDentistasView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gerenciarConsultas"
          element={
            <ProtectedRoute allowedRoles={["Dentista"]}>
              <GerenciamentoConsultasView />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedView />} />
      </Routes>
    </Router>
  );
}

export default App;
