const yup = require('./settings');

const schemaLogin = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(15, 'Senha deve ter no máximo 15 caracteres').required()
});

module.exports = {
    schemaLogin
}

