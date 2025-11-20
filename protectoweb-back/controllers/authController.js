const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      email,
      password: hashed,
      rol: rol || 'viewer'
    });

    res.json({ message: 'Usuario registrado', user });
  } catch (error) {
    res.status(400).json({ error: "El email ya existe" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ where: { email } });
    if (!usuario) return res.status(400).json({ error: "Usuario no encontrado" });

    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.json({
      message: "Login correcto",
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
};
