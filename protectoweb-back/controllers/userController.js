const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, ViewerStat } = require("../db/models");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "username, email y password obligatorios" });
        }

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hash,
            role: role || "viewer",
            monedas: role === "viewer" ? 500 : 0,
        });

        // crear stats inicial si es viewer
        if (user.role === "viewer") {
          await ViewerStat.create({ userId: user.id, nivel: 1, puntos: 0 });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                monedas: user.monedas,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al registrar usuario" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "Email y contraseña requeridos" });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Credenciales inválidas" });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ message: "Credenciales inválidas" });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                monedas: user.monedas,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};

exports.updateCoins = async (req, res) => {
    try {
        const { id } = req.params;
        const { delta } = req.body; // número (+ o -)

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        user.monedas = (user.monedas || 0) + Number(delta || 0);
        await user.save();

        res.json({ monedas: user.monedas });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al actualizar monedas" });
    }
};
