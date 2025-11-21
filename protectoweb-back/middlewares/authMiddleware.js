// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.authRequired = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token faltante o mal formateado" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // contiene id, role, nombre
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

exports.allowRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Autenticación requerida" });
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ error: "No autorizado para este rol" });
    }

    next();
  };
};
