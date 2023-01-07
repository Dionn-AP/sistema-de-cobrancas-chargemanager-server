const yup = require('./settings');

const schemaCustomers = yup.object().shape({
    state: yup.string(),
    city: yup.string(),
    cep: yup.string(),
    compliment: yup.string(),
    address: yup.string(),
    telephone: yup.string().min(10, " O telefone deve ter no mínimo 10 números.").max(11).required(),
    cpf: yup.string().min(11, "O cpf deve ter 11 números.").max(11).required(),
    email: yup.string().email().required(),
    name: yup.string().required(),
});

module.exports = schemaCustomers;