const knex = require('../services/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretHash = require('../secretHash');
const {schemaLogin} = require('../validations/schemaLogin');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        await schemaLogin.validate(req.body);

        const user = await knex('users').where({ email }).first();

        if (!user) {
            return res.status(404).json('O usuario não foi encontrado');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json("Email ou senha não conferem");
        }

        const token = jwt.sign({ id: user.id }, secretHash, { expiresIn: '8h' });

        const { password: _, ...userData } = user;

        return res.status(200).json({
            user: userData,
            token
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    login
}