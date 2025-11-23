const jwt = require("jsonwebtoken");
const { User } = require("../db/models");

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_universitaria";

exports.authRequired = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
};