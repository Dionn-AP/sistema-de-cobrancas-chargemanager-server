const yup = require('./settings');

const schemaUserEmail = yup.object().shape({
    email: yup.string().email().required(),
});

module.exports = schemaUserEmail;