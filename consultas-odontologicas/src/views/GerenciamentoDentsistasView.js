import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dentistaService from "../services/dentistaService";

const GerenciamentoDentistasView = () => {
  const [dentistas, setDentistas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [dentistaAtual, setDentistaAtual] = useState({ id: "", nome: "", email: "", senha: "" });
  const [novoDentista, setNovoDentista] = useState({ nome: "", email: "", senha: "" });

  useEffect(() => {
    const fetchDentistas = async () => {
      try {
        const response = await dentistaService.getDentistas();
        setDentistas(response);
      } catch (error) {
        alert("Erro ao carregar dentistas.");
      }
    };
    fetchDentistas();
  }, []);

  const abrirModal = (dentista) => {
    setDentistaAtual({ ...dentista, senha: "" });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setDentistaAtual({ id: "", nome: "", email: "", senha: "" });
  };

  const handleSalvarAlteracoes = async () => {
    if (!dentistaAtual.nome || !dentistaAtual.email) {
      alert("Nome e email são obrigatórios.");
      return;
    }

    try {
      await dentistaService.updateDentista(dentistaAtual.id, dentistaAtual);
      setDentistas(
        dentistas.map((dentista) =>
          dentista.id === dentistaAtual.id ? { ...dentista, ...dentistaAtual } : dentista
        )
      );
      fecharModal();
    } catch (error) {
      alert("Erro ao salvar alterações.");
    }
  };

  const handleAdicionarDentista = async () => {
    if (!novoDentista.nome || !novoDentista.email || !novoDentista.senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await dentistaService.addDentista(novoDentista);
      setDentistas([...dentistas, response]);
      setNovoDentista({ nome: "", email: "", senha: "" });
    } catch (error) {
      alert("Erro ao adicionar dentista.");
    }
  };

  const handleRemoverDentista = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este dentista?");
    if (!confirmar) return;

    try {
      await dentistaService.deleteDentista(id);
      setDentistas(dentistas.filter((dentista) => dentista.id !== id));
    } catch (error) {
      alert("Erro ao remover dentista.");
    }
  };

  return (
    <Container>
      <Card>
        <Title>Gerenciamento de Dentistas</Title>
        <Subtitle>Lista de dentistas cadastrados:</Subtitle>

        <Form>
          <Input
            type="text"
            placeholder="Nome"
            value={novoDentista.nome}
            onChange={(e) => setNovoDentista({ ...novoDentista, nome: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={novoDentista.email}
            onChange={(e) => setNovoDentista({ ...novoDentista, email: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={novoDentista.senha}
            onChange={(e) => setNovoDentista({ ...novoDentista, senha: e.target.value })}
          />
          <AddButton onClick={handleAdicionarDentista}>Adicionar Dentista</AddButton>
        </Form>

        <List>
          {dentistas.length > 0 ? (
            dentistas.map((dentista) => (
              <DentistaCard key={dentista.id}>
                <Info>
                  <strong>Nome:</strong> {dentista.nome}
                </Info>
                <Info>
                  <strong>Email:</strong> {dentista.email}
                </Info>
                <ButtonGroup>
                  <ActionButton onClick={() => abrirModal(dentista)}>Editar</ActionButton>
                  <ActionButton remover onClick={() => handleRemoverDentista(dentista.id)}>
                    Excluir
                  </ActionButton>
                </ButtonGroup>
              </DentistaCard>
            ))
          ) : (
            <EmptyMessage>Nenhum dentista cadastrado.</EmptyMessage>
          )}
        </List>
      </Card>

      {modalAberto && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Editar Dentista</ModalTitle>
            <Input
              type="text"
              placeholder="Nome"
              value={dentistaAtual.nome}
              onChange={(e) => setDentistaAtual({ ...dentistaAtual, nome: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Email"
              value={dentistaAtual.email}
              onChange={(e) => setDentistaAtual({ ...dentistaAtual, email: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Nova Senha"
              value={dentistaAtual.senha}
              onChange={(e) => setDentistaAtual({ ...dentistaAtual, senha: e.target.value })}
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

const DentistaCard = styled.div`
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

export default GerenciamentoDentistasView;
