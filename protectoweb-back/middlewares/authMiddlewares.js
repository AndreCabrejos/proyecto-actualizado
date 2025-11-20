const jwt = require('jsonwebtoken');

exports.authRequired = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.user = usuario;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido" });
  }
};
