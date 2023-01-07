const express = require('express');
const routes = express();

const loginValidation = require('./middlewares/loginMiddlewares');
const login = require('./controllers/login');
const userMiddlewares = require('./middlewares/usersMiddlewares');
const users = require('./controllers/users');
const customerMiddlewares = require('./middlewares/customersMiddlewares');
const customers = require('./controllers/customers');
const charges = require('./controllers/charges');
const chargesMiddlewares = require('./middlewares/chargesMiddlewares');


routes.post('/cadastrar', userMiddlewares.signUpFilter, users.userRegister);
routes.post('/login', login.login);
routes.post('/email', users.getUserEmail);


routes.use(loginValidation);

routes.post('/cadastrar-cliente', customerMiddlewares.customersFilter, customers.customerRegister);
routes.put('/editar-usuario', userMiddlewares.editFilter, users.userEdit);

routes.get('/detalhar-cliente/:id', customers.customerBreakdown);
routes.put('/atualizar-cliente/:id', customerMiddlewares.customerUpdateFilter, customers.customerUpdate);
routes.get('/listar-cliente', customers.customerListing);
routes.get('/clientes-status', customers.customerByStatus);

routes.post('/cadastrar-cobranca', chargesMiddlewares.chargesFilter, charges.chargesRegister);
routes.get('/cobrancas', charges.getCharges);

routes.delete('/excluir-cobranca/:id', chargesMiddlewares.verifyChargeStatus, charges.deleteCharge);
routes.put('/atualizar-cobranca/:id', charges.updateCharges);

module.exports = routes;