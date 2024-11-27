import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import consultaService from "../services/consultaService";

const GerenciamentoConsultasView = () => {
  const [consultas, setConsultas] = useState([]);
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const dentistaId = usuario?.dentistaId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        if (!dentistaId) {
          throw new Error("ID do dentista não encontrado.");
        }
        const response = await consultaService.getConsultasDentista(dentistaId);
        setConsultas(response);
      } catch (error) {
        console.error("Erro ao carregar consultas do dentista:", error);
        alert("Erro ao carregar consultas. Verifique os dados e tente novamente.");
      }
    };
    fetchConsultas();
  }, [dentistaId]);

  const handleAlterarStatus = async (id, novoStatus) => {
    try {
      if (!dentistaId) {
        throw new Error("ID do dentista não encontrado.");
      }
      await consultaService.atualizarStatusConsulta(id, novoStatus, dentistaId);
      setConsultas(
        consultas.map((consulta) =>
          consulta.id === id ? { ...consulta, status: novoStatus } : consulta
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar o status da consulta:", error);
      alert("Erro ao atualizar o status da consulta.");
    }
  };

  return (
    <Container>
      <Card>
        <Title>Gerenciamento de Consultas</Title>
        <Subtitle>Lista de consultas agendadas:</Subtitle>
        <List>
          {consultas.length > 0 ? (
            consultas.map((consulta) => (
              <ConsultaCard key={consulta.id}>
                <Details>
                  <Info>
                    <strong>Data:</strong>{" "}
                    {new Date(consulta.dataHora).toLocaleDateString()} às{" "}
                    {new Date(consulta.dataHora).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Info>
                  <Status status={consulta.status}>
                    <strong>Status:</strong> {consulta.status}
                  </Status>
                </Details>
                <ButtonGroup>
                  <ActionButton
                    onClick={() => handleAlterarStatus(consulta.id, "Concluída")}
                  >
                    Concluir
                  </ActionButton>
                  <ActionButton
                    $remover={true}
                    onClick={() => handleAlterarStatus(consulta.id, "Cancelada")}
                  >
                    Cancelar
                  </ActionButton>
                </ButtonGroup>
              </ConsultaCard>
            ))
          ) : (
            <EmptyMessage>Nenhuma consulta pendente.</EmptyMessage>
          )}
        </List>
        <BackButton onClick={() => navigate("/homeDentista")}>Voltar</BackButton>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f8ff;
`;

const Card = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 800px;
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
`;

const ConsultaCard = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Details = styled.div`
  text-align: left;
`;

const Info = styled.p`
  font-size: 14px;
  color: #6b7c93;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: ${(props) => (props.$remover ? "#e63946" : "#004aad")};
  color: white;
  font-size: 14px;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  &:hover {
    background-color: ${(props) => (props.$remover ? "#b00020" : "#003080")};
  }
`;

const EmptyMessage = styled.p`
  font-size: 16px;
  color: #6b7c93;
  text-align: center;
  margin-top: 20px;
  font-family: "Montserrat", sans-serif;
`;

const BackButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  &:hover {
    background-color: #5a6268;
  }
`;

export default GerenciamentoConsultasView;
