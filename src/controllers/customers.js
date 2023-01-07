const knex = require('../services/database');
const schemaCustomers = require('../validations/schemaCustomers');

const customerRegister = async (req, res) => {
    const body = { ...req.body, user_id: req.user.id };

    try {
        const customer = await knex('customers').insert(body);

        if (customer.rowCount > 0) {
            return res.status(200).json('Cadastro concluído com sucesso');
        }

        return res.status(400).json('Cliente não cadastrado');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const customerBreakdown = async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    try {
        const customer = await knex('customers').where({ id }).andWhere({ user_id: user.id }).first();

        if (customer) {
            return res.status(200).json(customer);
        }

        return res.status(404).json('Cliente não encontrado');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const customerListing = async (req, res) => {
    const { user } = req;

    try {
        const customer = await knex('customers').where({ user_id: user.id });

        if (customer) {
            return res.status(200).json(customer);
        }

        return res.status(404).send();

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const customerUpdate = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    
    const { name, email, cpf, telephone, cep, address, compliment, district, city, state } = req.body;
   
    try {
        await schemaCustomers.validate( req.body );
        
        const customer = await knex('customers').where({ id }).first();
        
        if (!customer) {
            return res.status(404).json({ mensagem: 'O cliente não existe' });
        }
        
        const updating = await knex('customers')
            .where({
                id
            }).update({
                name,
                email,
                cpf,
                telephone,
                cep,
                address,
                compliment,
                district,
                city,
                state
            });

            if (!updating) {
                return res.status(400).json("O cliente não foi atualizado");
            }

        return res.status(204).send();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const customerByStatus = async (req, res) => {
    const { id } = req.user;

    try {
        const debtorCustomers = await knex.select('*').from('customers').join('charges', function() {
            this
              .on('customers.user_id', id)
              .onNotExists(function() {
                this.select('*')
                  .from('charges')
                  .whereRaw('charges.status = vencida');
              })
          })
        
        
        // knex('customers')
        //     .select('customers.id','customers.name','customers.email','customers.cpf','customers.telephone','customers.cep','customers.address','customers.compliment','customers.district','customers.city','customers.state')
        //     .distinct('customers.id')
        //     .leftJoin('charges', 'charges.customer_id', 'customers.id')
        //     .where('charges.status', 'vencida')
        //     .andWhere('customers.user_id', id);

        // const upToDateCustomers = await knex('customers')
        //     .select('customers.id','customers.name','customers.email','customers.cpf','customers.telephone','customers.cep','customers.address','customers.compliment','customers.district','customers.city','customers.state')
        //     .distinct('customers.id')
        //     .leftJoin('charges', 'charges.customer_id', 'customers.id')
        //     .where('charges.status', 'vencida')
        //     .andWhere('customers.user_id', id);

        /* const upToDateCustomers = await knex('customers')
            .select('customers.id','customers.name','customers.email','customers.cpf','customers.telephone','customers.cep','customers.address','customers.compliment','customers.district','customers.city','customers.state')
            .distinct('customers.id')
            .leftJoin('charges', 'charges.customer_id', 'customers.id')
            .where('charges.status', '!=', 'vencida')
            .andWhere('customers.user_id', id); */

        const customers = {
            inadimplentes: [...debtorCustomers]
            //emDia: [...upToDateCustomers]
        };
        
        return res.status(200).json(customers);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    customerRegister,
    customerBreakdown,
    customerUpdate,
    customerListing,
    customerByStatus
}