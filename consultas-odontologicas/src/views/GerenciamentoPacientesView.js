import React, { useEffect, useState } from "react";
import styled from "styled-components";
import pacienteService from "../services/pacienteService";

const GerenciamentoPacientesView = () => {
  const [pacientes, setPacientes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [pacienteAtual, setPacienteAtual] = useState({ id: "", nome: "", email: "", senha: "" });
  const [novoPaciente, setNovoPaciente] = useState({ nome: "", email: "", senha: "" });

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await pacienteService.getPacientes();
        setPacientes(response);
      } catch (error) {
        alert("Erro ao carregar pacientes.");
      }
    };
    fetchPacientes();
  }, []);

  const abrirModal = (paciente) => {
    setPacienteAtual({ ...paciente, senha: "" });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setPacienteAtual({ id: "", nome: "", email: "", senha: "" });
  };

  const handleSalvarAlteracoes = async () => {
    if (!pacienteAtual.nome || !pacienteAtual.email) {
      alert("Nome e email são obrigatórios.");
      return;
    }

    try {
      await pacienteService.updatePaciente(pacienteAtual.id, pacienteAtual);
      setPacientes(
        pacientes.map((paciente) =>
          paciente.id === pacienteAtual.id ? { ...paciente, ...pacienteAtual } : paciente
        )
      );
      fecharModal();
    } catch (error) {
      alert("Erro ao salvar alterações.");
    }
  };

  const handleAdicionarPaciente = async () => {
    if (!novoPaciente.nome || !novoPaciente.email || !novoPaciente.senha) {
      alert("Preencha todos os campos!");
      return;
    }
  
    try {
      const response = await pacienteService.addPaciente(novoPaciente);
      setPacientes([...pacientes, response]);
      setNovoPaciente({ nome: "", email: "", senha: "" });
      alert("Paciente adicionado com sucesso!");  
    } catch (error) {
      alert("Erro ao adicionar paciente.");
    }
  };
  const handleRemoverPaciente = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este paciente?");
    if (!confirmar) return;

    try {
      await pacienteService.deletePaciente(id);
      setPacientes(pacientes.filter((paciente) => paciente.id !== id));
    } catch (error) {
      alert("Erro ao remover paciente.");
    }
  };

  return (
    <Container>
      <Card>
        <Title>Gerenciamento de Pacientes</Title>
        <Subtitle>Lista de pacientes cadastrados:</Subtitle>

        <Form>
          <Input
            type="text"
            placeholder="Nome"
            value={novoPaciente.nome}
            onChange={(e) => setNovoPaciente({ ...novoPaciente, nome: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={novoPaciente.email}
            onChange={(e) => setNovoPaciente({ ...novoPaciente, email: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={novoPaciente.senha}
            onChange={(e) => setNovoPaciente({ ...novoPaciente, senha: e.target.value })}
          />
          <AddButton onClick={handleAdicionarPaciente}>Adicionar Paciente</AddButton>
        </Form>

        <List>
          {pacientes.length > 0 ? (
            pacientes.map((paciente) => (
              <PacienteCard key={paciente.id}>
                <Info>
                  <strong>Nome:</strong> {paciente.nome}
                </Info>
                <Info>
                  <strong>Email:</strong> {paciente.email}
                </Info>
                <ButtonGroup>
                  <ActionButton onClick={() => abrirModal(paciente)}>Editar</ActionButton>
                  <ActionButton remover onClick={() => handleRemoverPaciente(paciente.id)}>
                    Excluir
                  </ActionButton>
                </ButtonGroup>
              </PacienteCard>
            ))
          ) : (
            <EmptyMessage>Nenhum paciente cadastrado.</EmptyMessage>
          )}
        </List>
      </Card>

      {modalAberto && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Editar Paciente</ModalTitle>
            <Input
              type="text"
              placeholder="Nome"
              value={pacienteAtual.nome}
              onChange={(e) => setPacienteAtual({ ...pacienteAtual, nome: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Email"
              value={pacienteAtual.email}
              onChange={(e) => setPacienteAtual({ ...pacienteAtual, email: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Nova Senha"
              value={pacienteAtual.senha}
              onChange={(e) => setPacienteAtual({ ...pacienteAtual, senha: e.target.value })}
            />
            <ButtonGroup>
              <ActionButton onClick={handleSalvarAlteracoes}>Salvar</ActionButton>
              <ActionButton remover onClick={fecharModal}>
                Cancelar
              </ActionButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
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

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #d1d9e6;
  border-radius: 5px;
  font-size: 16px;
  background-color: #f9f9f9;
  font-family: "Montserrat", sans-serif;
`;

const AddButton = styled.button`
  background-color: #004aad;
  color: white;
  font-size: 16px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  &:hover {
    background-color: #003080;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PacienteCard = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Info = styled.p`
  font-size: 14px;
  color: #6b7c93;
  font-family: "Montserrat", sans-serif;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-content: center;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: ${(props) => (props.remover ? "#e63946" : "#004aad")};
  color: white;
  font-size: 14px;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.remover ? "#b00020" : "#003080")};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: 28px;
  color: #004aad;
  margin-bottom: 20px;
  font-family: "Roboto", sans-serif;
`;

const EmptyMessage = styled.p`
  font-size: 16px;
  color: #6b7c93;
  text-align: center;
  margin-top: 20px;
  font-family: "Montserrat", sans-serif;
`;

export default GerenciamentoPacientesView;
