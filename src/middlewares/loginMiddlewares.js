const knex = require('../services/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretHash = require('../secretHash');


const loginValidation = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Não autorizado');
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, secretHash);

        const userCheck = await knex('users').where({ id }).first();

        if (!userCheck) {
            return res.status(404).json('Usuario não encontrado');
        }

        const { password, ...user } = userCheck;

        req.user = user;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = loginValidation