import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService"; 

const RegisterView = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    if (senha !== confirmSenha) {
      alert("As senhas não conferem!");
      return;
    }

    try {
      await authService.register({ nome, email, senha, role: "Paciente" }); 
      alert("Usuário registrado com sucesso!");
      navigate("/login"); 
    } catch (error) {
      alert("Erro ao registrar usuário: " + (error.response?.data || "Tente novamente."));
    }
  };

  return (
    <Container>
      <RegisterCard>
        <Title>Registrar-se</Title>
        <Subtitle>Crie sua conta para agendar consultas</Subtitle>
        <Form onSubmit={handleRegister}>
          <Input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirme a Senha"
            value={confirmSenha}
            onChange={(e) => setConfirmSenha(e.target.value)}
          />
          <Button type="submit">Registrar</Button>
          <LoginLink>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </LoginLink>
        </Form>
      </RegisterCard>
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

const RegisterCard = styled.div`
  background-color: #ffffff; 
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #004aad; 
  margin-bottom: 10px;
  font-family: 'Roboto', sans-serif; 
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7c93; 
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif; 
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #d1d9e6; 
  border-radius: 5px;
  font-size: 16px;
  background-color: #f9f9f9;
  font-family: 'Montserrat', sans-serif; 
  &:focus {
    border-color: #004aad; 
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #004aad; 
  color: white;
  font-size: 16px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif; 
  &:hover {
    background-color: #003080; 
  }
`;

const LoginLink = styled.p`
  font-size: 14px;
  color: #6b7c93;
  margin-top: 10px;
  font-family: 'Montserrat', sans-serif; 
  a {
    color: #004aad; 
    text-decoration: none;
    font-family: 'Poppins', sans-serif; 
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default RegisterView;