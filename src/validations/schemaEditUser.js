const yup = require('./settings');

const verifyName = yup.object().shape({
    name: yup.string().required()
});

const verifyEmail = yup.object().shape({
    email: yup.string().email().required()
});

const verifyCpf = yup.object().shape({
    cpf: yup.string().min(11, "O cpf deve ter 11 números.").max(11, 'O cpf deve ter 11 números.')
});

const verifyTelephone = yup.object().shape({
    telephone: yup.string().min(10, "O telefone deve ter no mínimo 10 números.").max(11, 'O telefone deve ter no máximo 11 números.')
});

const verifyPassword = yup.object().shape({
    password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(15, 'Senha deve ter no máximo 15 caracteres')
});

module.exports = {
    verifyName,
    verifyEmail,
    verifyCpf,
    verifyTelephone,
    verifyPassword
};