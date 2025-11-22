const jwt = require("jsonwebtoken");
const { User } = require("../db/models");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

exports.authRequired = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token faltante o mal formateado" });
    }

    const token = header.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: err.name === "TokenExpiredError" ? "Token expirado" : "Token inválido" });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: "Usuario ya no existe" });

    req.user = { id: user.id, role: user.role, username: user.username };
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ error: "Error interno de autenticación" });
  }
};

exports.allowRoles = (...rolesPermitidos) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Autenticación requerida" });
  if (!rolesPermitidos.includes(req.user.role)) return res.status(403).json({ error: "No autorizado" });
  next();
};
