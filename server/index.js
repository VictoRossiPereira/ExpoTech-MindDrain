require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dns = require('dns');
const User = require('./models/User');

// Configura o DNS para usar o Cloudflare para resolver problemas de conexão com MongoDB Atlas
dns.setServers(["1.1.1.1"]);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado localmente'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Routes

// Register
app.post('/api/register', async (req, res) => {
    try {
        console.log('Recebida requisição de cadastro:', req.body);
        const { name, email, password, birthDate, gender } = req.body;

        if (!name || !email || !password || !birthDate || !gender) {
            console.log('Erro: Dados incompletos no cadastro');
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('Erro: Usuário já cadastrado com este e-mail:', email);
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }

        user = new User({
            name,
            email,
            password,
            birthDate,
            gender
        });

        await user.save();
        console.log('Usuário cadastrado com sucesso:', email);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: user._id, name, email } });
    } catch (err) {
        console.error('Erro detalhado no servidor durante o cadastro:', err);
        res.status(500).json({ message: 'Erro interno no servidor ao cadastrar' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Tentativa de login para: ${email}`);

        if (!password) {
            return res.status(400).json({ message: 'Senha é obrigatória' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Usuário não encontrado: ${email}`);
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        console.log(`Usuário encontrado. Verificando senha...`);
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`Senha incorreta para: ${email}`);
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        console.log(`Login bem-sucedido: ${email}`);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// Get user by email (public endpoint for demo)
app.get('/api/user', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).json({ message: 'Email é obrigatório' });

        const user = await User.findOne({ email }).select('name email birthDate gender');
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

        res.json({ user });
    } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
