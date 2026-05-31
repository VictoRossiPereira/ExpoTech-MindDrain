const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, enum: ['Fem', 'Mas', 'Outros'], required: true },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    console.log('Criptografando senha...');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Senha criptografada com sucesso.');
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) {
        console.error('Erro: Documento do usuário não contém o campo password.');
        return false;
    }
    console.log('Comparando senha fornecida com hash do banco...');
    const match = await bcrypt.compare(candidatePassword, this.password);
    console.log('Resultado da comparação bcrypt:', match);
    return match;
};

module.exports = mongoose.model('User', UserSchema);
