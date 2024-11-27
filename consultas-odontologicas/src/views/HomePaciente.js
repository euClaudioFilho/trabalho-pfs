import React, { useEffect, useState } from "react";
import styled from "styled-components";
import consultaService from "../services/consultaService";
import { useNavigate } from "react-router-dom";

const HomePaciente = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [dadosPaciente, setDadosPaciente] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const consultas = await consultaService.getConsultasPaciente(usuario.pacienteId);
        setDadosPaciente(consultas);
      } catch (error) {
        console.error("Erro ao carregar consultas do paciente:", error);
        alert("Erro ao carregar as consultas. Tente novamente mais tarde.");
      }
    };

    fetchDados();
  }, [usuario.pacienteId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Container>
      <Card>
        <Title>Bem-vindo, {usuario.nome}!</Title>
        <Subtitle>Suas próximas consultas:</Subtitle>
        <List>
          {dadosPaciente.length > 0 ? (
            dadosPaciente.map((consulta) => (
              <ConsultaCard key={consulta.id}>
                <Info>
                  <strong>Data:</strong>{" "}
                  {new Date(consulta.dataHora).toLocaleDateString("pt-BR")} às{" "}
                  {new Date(consulta.dataHora).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Info>
                <Info>
                  <strong>Dentista:</strong> {consulta.dentistaNome || consulta.dentistaId}
                </Info>
                <Info>
                  <strong>Descrição:</strong> {consulta.descricao || "N/A"}
                </Info>
                <Status status={consulta.status}>
                  <strong>Status:</strong> {consulta.status || "Pendente"}
                </Status>
              </ConsultaCard>
            ))
          ) : (
            <EmptyMessage>Você não possui consultas futuras.</EmptyMessage>
          )}
        </List>
        <ButtonGroup>
          <ActionButton onClick={() => navigate("/agendamento")}>
            Agendar Nova Consulta
          </ActionButton>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </ButtonGroup>
      </Card>
    </Container>
  );
};

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
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
`;

const ConsultaCard = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
  word-wrap: break-word;
`;

const Info = styled.p`
  font-size: 14px;
  color: #6b7c93;
  margin-bottom: 5px;
  font-family: "Montserrat", sans-serif;
`;

const Status = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) =>
    props.status === "Pendente"
      ? "#ffa500"
      : props.status === "Concluída"
      ? "#28a745"
      : "#dc3545"};
  font-family: "Montserrat", sans-serif;
`;

const EmptyMessage = styled.p`
  font-size: 16px;
  color: #6b7c93;
  margin-bottom: 20px;
  font-family: "Montserrat", sans-serif;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: #004aad;
  color: white;
  font-size: 16px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  &:hover {
    background-color: #003080;
  }
`;

const LogoutButton = styled(ActionButton)`
  background-color: #dc3545;
  &:hover {
    background-color: #a71d2a;
  }
`;

export default HomePaciente;
