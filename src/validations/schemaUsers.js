const yup = require('./settings');

const schemaUsers = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(15, 'Senha deve ter no máximo 15 caracteres').required(),
    cpf: yup.string().min(11, "O cpf deve ter 11 números.").max(11),
    telephone: yup.string().min(10, "O telefone deve ter no mínimo 10 números.").max(11)
});

module.exports = schemaUsers;