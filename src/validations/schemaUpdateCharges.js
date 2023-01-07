const yup = require('./settings');

const schemaUpdateCharges = yup.object().shape({
    expiration: yup.string().required(),
    amount: yup.string().required(),
    status: yup.string().required(),
    description: yup.string().required(),
    
});

module.exports = schemaUpdateCharges;