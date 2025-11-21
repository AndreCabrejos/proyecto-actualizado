const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;
    if (role && !['viewer','streamer','admin'].includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email ya registrado' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nombre, email, password: hash, role: role || 'viewer' });

    const safe = { id: user.id, nombre: user.nombre, email: user.email, role: user.role };

    const token = jwt.sign(
      { id: user.id, role: user.role, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ message: 'Usuario registrado', user: safe, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al registrar' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, role: user.role, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login correcto',
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error en login' });
  }
};

exports.me = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Token inválido' });
  return res.json({ user: req.user });
};
