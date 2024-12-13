const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const config = require('./config');
const userController = require('./controllers/user-controller');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger-docs');

const app = express();

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// MySQL connection
let dbConnection;

(async () => {
  try {
    dbConnection = await mysql.createConnection({
      host: '127.0.0.1', // Altere para o host do seu MySQL
      user: 'root', // Altere para o usuário do seu MySQL
      password: 'root', // Altere para a senha do seu MySQL
      database: 'car_sales', // Altere para o nome do banco de dados
    });
    console.log('Conexão com o banco MySQL estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error.message);
  }
})();

app.use(cors(config.corsOptions));
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: false }));

app.use((error, req, res, next) => {
  if (error.message === 'request entity too large') {
    return res.status(413).json({ message: 'Requisição maior que 100KB' });
  } else {
    next();
  }
});

// Injetando conexão MySQL nas rotas (se necessário)
app.use((req, res, next) => {
  req.db = dbConnection;
  next();
});

// Rotas
require('./routes/user-routes')(app, dbConnection);
require('./routes/login-routes')(app, dbConnection);
require('./routes/logout-routes')(app, dbConnection);
require('./routes/ping-routes')(app, dbConnection);
require('./routes/brand-routes')(app, dbConnection);
require('./routes/vehicle-routes')(app, dbConnection);
require('./routes/customer-routes')(app, dbConnection);
require('./routes/sale-routes')(app, dbConnection);

app.listen(config.apiPort, () =>
  console.log(`Servidor Express escutando na porta ${config.apiPort}...`)
);

userController.createAdmin(dbConnection);

module.exports = app;
