const knex = require('../services/database');
const bcrypt = require('bcrypt');
const schemaUserEmail = require('../validations/schemaUserEmail');
const schemaEditUser = require('../validations/schemaEditUser');

const userRegister = async (req, res) => {
    const { email, password, name, cpf, telephone } = req.body;

    try {
        
        const hash = await bcrypt.hash(password, 10);

        const user = { email, password: hash, name, cpf, telephone }; 

        const query = await knex('users').insert(user);

        if (query.rowCount > 0) {
            return res.status(200).json('Usuário cadastrado com sucesso');
        }

        return res.status(400).json('Usuário não cadastrado');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const userEdit = async (req, res) => {
    const body = req.body;

    const { id } = req.user;

    try {
        await schemaEditUser.verifyName.validate({name: body.name});

        if (!body.password) {

            const getPassword = await knex('users').where({ id }).first();

            const user = { ...body, password: getPassword.password }; 

            const query = await knex('users').where({ id }).update(user);

            if (query.rowCount > 0) {
                return res.status(400).json('Usuário não editado');
            }

            return res.status(200).json('Cadastro alterado com sucesso!');
        }

        await schemaEditUser.verifyPassword.validate({ password: body.password});

        const hash = await bcrypt.hash(body.password, 10); 

        const queryUser = await knex('users').where({ id }).update({ ...body, password: hash });

        if (queryUser > 0) {
            return res.status(200).json('Cadastro alterado com sucesso!');
        }

        return res.status(400).json('Usuário não editado');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const getUserEmail = async (req, res) => {
    const { email } = req.body;
    
    try {
        await schemaUserEmail.validate({email});

        const verifyEmail = await knex('users').where('email', email);
        
        if (verifyEmail.length > 0) {
            return res.status(400).json('E-mail já cadastrado');
        }

        return res.status(200).json('E-mail disponível');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    userRegister,
    userEdit,
    getUserEmail
};