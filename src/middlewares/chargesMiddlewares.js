const knex = require('../services/database');
const schemaCharges = require('../validations/schemaCharges');
const schemaUpdateCharges = require('../validations/schemaUpdateCharges')

const chargesFilter = async (req, res, next) => {
    const { customer, description, status, amount, expiration} = req.body;
    const { id } = req.user;
    
    try {
        await schemaCharges.validate({ customer, description, status, amount, expiration });

        const query = knex('customers').where('id', customer);

        if(!query){
            return res.status(400).json('Cliente não encontrado');
        }

        const verifyUser = await knex('customers').where('user_id', id).andWhere('id', customer).first();

        if(!verifyUser){
            return res.status(400).json('Cliente não pertence à sua conta');
        }

        next();  
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const verifyChargeStatus = async (req, res, next) => {
    const { id } = req.params;

    try {
        const verifyStatus = await knex('charges').where('id', id).first();
        
        if(!verifyStatus){
            return res.status(404).json('Cobrança não encontrada');
        }

        if(verifyStatus.status === 'paga' || verifyStatus.status === 'vencida'){
            return res.status(400).json('Esta cobrança não pode ser excluída!');
        }

        const expiration = new Date(verifyStatus.expiration);

        const currentDate = new Date();
        
        if(+expiration < +currentDate){
            return res.status(400).json('Esta cobrança não pode ser excluída!');
        }
    
        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const chargesUpdateFilter = async (req, res, next) => {
    const { description, status, amount, expiration } = req.body;
    const { id } = req.params;

    try {
        await schemaUpdateCharges.validate({  description, status, amount, expiration });

        const verifyData = await knex('charges').where('id', id).first();

        if (verifyData.description !== description) {
            const chargesDescription = await knex('charges').where('description', description, 'id', id);

            if (chargesDescription.length > 0) {
                return res.status(400).json('Descrição já cadastrado');  
            }
        }

        if (verifyData.status !== status) {
            const chargesStatus = await knex('charges').where('status', status, 'id', id);

            if (chargesStatus.length > 0) {
                return res.status(400).json('Status ativo'); 
            }
        }

        if (verifyData.amount !== amount) {
            const chargesAmount = await knex('charges').where('amount', amount, 'id', id);

            if (chargesAmount.length > 0) {
                return res.status(400).json('Valor já existe');  
            }
        }

        if (verifyData.expiration !== expiration) {
            const chargesExpiration = await knex('charges').where('expiration', expiration);

            if (chargesExpiration.length > 0) {
                return res.status(400).json('Data expirada');  
            }
        }

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    chargesFilter,
    verifyChargeStatus,
    chargesUpdateFilter
};