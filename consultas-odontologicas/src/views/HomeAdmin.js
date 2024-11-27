import React, { useEffect, useState } from "react";
import styled from "styled-components";
import consultaService from "../services/consultaService";
import { useNavigate } from "react-router-dom";

const HomeAdmin = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [dadosAdmin, setDadosAdmin] = useState({ consultas: 0, pacientes: 0, dentistas: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const consultas = await consultaService.getTotalConsultas();
        const pacientes = await consultaService.getTotalPacientes();
        const dentistas = await consultaService.getTotalDentistas();

        setDadosAdmin({ consultas, pacientes, dentistas });
      } catch (error) {
        console.error("Erro ao carregar dados administrativos:", error);
        alert("Erro ao carregar os dados. Tente novamente mais tarde.");
      }
    };

    fetchDados();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Container>
      <Card>
        <Title>Bem-vindo, {usuario.nome}!</Title>
        <Subtitle>Painel Administrativo:</Subtitle>
        <List>
          <AdminCard>
            <Info>
              <strong>Consultas Cadastradas:</strong> {dadosAdmin.consultas}
            </Info>
          </AdminCard>
          <AdminCard>
            <Info>
              <strong>Pacientes Cadastrados:</strong> {dadosAdmin.pacientes}
            </Info>
          </AdminCard>
          <AdminCard>
            <Info>
              <strong>Dentistas Cadastrados:</strong> {dadosAdmin.dentistas}
            </Info>
          </AdminCard>
        </List>
        <Button onClick={() => navigate("/gerenciarPacientes")}>Gerenciar Pacientes</Button>
        <Button onClick={() => navigate("/gerenciarDentistas")}>Gerenciar Dentistas</Button>
        <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
      </Card>
    </Container>
  );
};

const Button = styled.button`
  background-color: #004aad;
  color: white;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  &:hover {
    background-color: #003080;
  }
`;

const LogoutButton = styled(Button)`
  background-color: #dc3545;
  &:hover {
    background-color: #a71d2a;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f8ff;
`;

const Card = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #004aad;
  margin-bottom: 20px;
  font-family: "Roboto", sans-serif;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7c93;
  margin-bottom: 20px;
  font-family: "Montserrat", sans-serif;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const AdminCard = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

const Info = styled.p`
  font-size: 14px;
  color: #6b7c93;
  margin-bottom: 5px;
  font-family: "Montserrat", sans-serif;
`;

export default HomeAdmin;
