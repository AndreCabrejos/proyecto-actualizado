const { User, ViewerStat } = require("../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const validRoles = ['viewer', 'streamer'];
    const userRole = validRoles.includes(role) ? role : 'viewer';

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: userRole,
      monedas: 500
    });

    await ViewerStat.create({
      userId: newUser.id,
      nivel: 1,
      puntos: 0
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Usuario registrado correctamente",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        monedas: newUser.monedas
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el registro" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        monedas: user.monedas
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el login" });
  }
};
