const knex = require('../services/database');
const schemaUpdateCharges = require('../validations/schemaUpdateCharges');

const chargesRegister = async (req, res) => {
    const { customer, description, amount, expiration } = req.body;
    let status = req.body.status;
    
    try {
        if (status !== 'paga'){
            const date = new Date();
            const expirationDate = new Date(expiration);
            +date > +expirationDate ? status = 'vencida' : status = 'pendente';
        }

        const charge = { description, status, amount, expiration, customer_id: customer};

        const query = await knex('charges').insert(charge);

        if(query.rowCount > 0){
            return res.status(200).json('Cobrança cadastrada com sucesso');
        }

        return res.status(400).json('Cobrança não cadastrada');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const getCharges = async (req, res) => {
    const { id } = req.user;

    try {
        const query = await knex('charges')
            .select('charges.id','charges.customer_id','customers.name','charges.description','charges.status','charges.amount','charges.expiration')
            .join('customers', 'charges.customer_id', 'customers.id')
            .where('customers.user_id', id);

        if(query.length === 0){
            return res.status(400).json('Nenhuma cobrança encontrada');
        }

        let status = ''
        const date = new Date();

        for(let charge of query){
            const expiration = new Date(charge.expiration);
            
            if(charge.status !== 'paga'){
                +date > +expiration ? status = 'vencida' : status = 'pendente';

                await knex('charges').update({ status }).where({ id: charge.id });
            }
        }

        const updatedQuery = await knex('charges')
            .select('charges.id','charges.customer_id','customers.name','charges.description','charges.status','charges.amount','charges.expiration')
            .join('customers', 'charges.customer_id', 'customers.id')
            .where('customers.user_id', id);

        return res.status(200).json(updatedQuery);     
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const deleteCharge = async (req, res) => {
    const { id } = req.params;

    try {
        const query = await knex('charges').where('id', id).del();

        if(query > 0){
            return res.status(200).json('Cobrança excluída com sucesso!');
        }

        return res.status(400).json('Esta cobrança não pode ser excluída!');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const updateCharges = async (req, res) => {
    const { id } = req.params;
    
    const { description, status, amount, expiration } = req.body;
   
    try {
        await schemaUpdateCharges.validate( req.body );
        
        const charge = await knex('charges').where('id', id).first();
        
        if (!charge) {
            return res.status(404).json({ mensagem: 'A cobrança não existe' });
        }
        
        const updating = await knex('charges')
            .where({
                id
            }).update({
                description,
                status,
                amount,
                expiration
            });

            if (!updating) {
                return res.status(400).json("A cobrança não foi atualizado");
            }

        return res.status(200).json(updating);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    chargesRegister,
    getCharges,
    deleteCharge,
    updateCharges
}