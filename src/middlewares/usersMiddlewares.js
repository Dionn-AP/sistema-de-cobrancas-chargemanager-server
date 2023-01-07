const schemaUsers = require('../validations/schemaUsers');
const knex = require('../services/database');
const schemaEditUser = require('../validations/schemaEditUser');

const signUpFilter = async (req, res, next) => {
    const { email } = req.body;
    
    try {
        await schemaUsers.validate(req.body);
        
        const verifyEmail = await knex('users').where('email', email);
        
        if (verifyEmail.length > 0) {
            return res.status(400).json('E-mail já cadastrado');
        }

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }

};

const editFilter = async (req, res, next) => {
    const { email, cpf, telephone } = req.body;

    const { id } = req.user;

    try {
        await schemaEditUser.verifyEmail.validate({ email });

        if (email) {
            const verifyEmailOwner = await knex('users').where({ id }).first();

            if (verifyEmailOwner.email !== email) {
               const verifyEmail = await knex('users').where({ email }).first();

                if (verifyEmail) {
                    return res.status(400).json('E-mail já cadastrado');
                } 
            }
        }
        
        if (cpf) {  
            await schemaEditUser.verifyCpf.validate({ cpf });

            const verifyCpfOwner = await knex('users').where({ id }).first();

            if (verifyCpfOwner.cpf !== cpf) {
                const verifyCpf = await knex('users').where({ cpf }).first();

                if (verifyCpf) {
                    return res.status(400).json('CPF já cadastrado');
                } 
            }
        }
        
        if (telephone) {
            await schemaEditUser.verifyTelephone.validate({ telephone });

            const verifyTelephoneOwner = await knex('users').where({ id }).first();

            if (verifyTelephoneOwner.telephone !== telephone) { 
                const verifyTelephone = await knex('users').where({ telephone }).first();

                if (verifyTelephone) {
                    return res.status(400).json('Telefone já cadastrado');
                } 
            }
        }
        
        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    signUpFilter,
    editFilter
}