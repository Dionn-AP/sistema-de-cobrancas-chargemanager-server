const yup = require('./settings');

const schemaCharges = yup.object().shape({
    expiration: yup.string().required(),
    amount: yup.string().required(),
    status: yup.string().required(),
    description: yup.string().required(),
    customer: yup.string().required(),
});

module.exports = schemaCharges;