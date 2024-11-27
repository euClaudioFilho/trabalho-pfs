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
