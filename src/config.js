const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1', // Endereço do servidor MySQL
  user: 'root', // Usuário do banco de dados
  password: 'root', // Senha do banco de dados (substitua conforme necessário)
  database: 'car_sales', // Nome do banco de dados
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message);
  } else {
    console.log('Conectado ao banco de dados MySQL com sucesso!');
  }
});

module.exports = {
  privateKey: '2f639018-7c65-44df-a3a2-a070bd2a10a8',
  connectionUrlDatabase: connection,
  apiPort: 8080,
  corsOptions: {
    origin: ['http://127.0.0.1:4200', 'http://localhost:4200'],
  },
};
