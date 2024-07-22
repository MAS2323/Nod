const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Obtener el token del encabezado de la solicitud
  const token = req.header("Authorization");

  // Verificar si el token existe
  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado. Token no proporcionado." });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar los datos decodificados del token a la solicitud para su uso posterior
    req.user = decoded.user;

    // Continuar con la solicitud
    next();
  } catch (error) {
    // Si hay un error en la verificación del token, devolver un error de autorización
    return res.status(401).json({ message: "Token no válido." });
  }
};

module.exports = authMiddleware;
