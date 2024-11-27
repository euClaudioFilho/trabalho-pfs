import React, { useState } from "react";
import styled from "styled-components";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      console.log("Tentando login com:", { email, senha });
      const response = await authService.login(email, senha);
      console.log("Login bem-sucedido:", response);
  
      if (response.tipo === "Paciente") {
        navigate("/homePaciente");
      } else if (response.tipo === "Dentista") {
        navigate("/homeDentista");
      } else if (response.tipo === "Admin") {
        navigate("/homeAdmin");
      } else {
        alert("Tipo de usuário inválido.");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error.message);
      alert("Erro ao realizar login. Verifique os dados e tente novamente.");
    }
  };
  
  return (
    <Container>
      <LoginCard>
        <Title>Bem-vindo</Title>
        <Subtitle>Faça login para continuar</Subtitle>
        <Form onSubmit={handleLogin}>
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
          <Button type="submit">Entrar</Button>
          <RegisterLink>
            Não tem uma conta? <a href="/register">Registre-se</a>
          </RegisterLink>
        </Form>
      </LoginCard>
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

const LoginCard = styled.div`
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
  font-family: "Roboto", sans-serif;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7c93;
  margin-bottom: 20px;
  font-family: "Montserrat", sans-serif;
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
  font-family: "Montserrat", sans-serif;
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
  font-family: "Poppins", sans-serif;
  &:hover {
    background-color: #003080;
  }
`;

const RegisterLink = styled.p`
  font-size: 14px;
  color: #6b7c93;
  margin-top: 10px;
  font-family: "Montserrat", sans-serif;
  a {
    color: #004aad;
    text-decoration: none;
    font-family: "Poppins", sans-serif;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default LoginView;
