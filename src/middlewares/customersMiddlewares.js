const knex = require('../services/database');
const schemaCustomers = require('../validations/schemaCustomers');

const customersFilter = async (req, res, next) => {
    const { email, cpf, telephone} = req.body;

    try {
        await schemaCustomers.validate( req.body );

        const customerEmail = await knex('customers').where('email', email);

        if (customerEmail.length > 0) {
            return res.status(400).json('E-mail já cadastrado');
        }

        const customerCpf = await knex('customers').where('cpf', cpf);

        if (customerCpf.length > 0) {
            return res.status(400).json('CPF já cadastrado');
        }
        
        const customerTelephone = await knex('customers').where('telephone', telephone);
        
        if (customerTelephone.length > 0) {
            return res.status(400).json('Telefone já cadastrado');
        }

        next()
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const customerUpdateFilter = async (req, res, next) => {
    const { email, cpf, telephone } = req.body;
    const { id } = req.params;

    try {
        const verifyData = await knex('customers').where('id', id).first();

        if (verifyData.email !== email) {
            const customerEmail = await knex('customers').where('email', email);

            if (customerEmail.length > 0) {
                return res.status(400).json('E-mail já cadastrado');  
            }
        }

        if (verifyData.cpf !== cpf) {
            const customerCpf = await knex('customers').where('cpf', cpf);

            if (customerCpf.length > 0) {
                return res.status(400).json('CPF já cadastrado'); 
            }
        }

        if (verifyData.telephone !== telephone) {
            const customerTelephone = await knex('customers').where('telephone', telephone);

            if (customerTelephone.length > 0) {
                return res.status(400).json('Telefone já cadastrado');  
            }
        }

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    customersFilter,
    customerUpdateFilter
}