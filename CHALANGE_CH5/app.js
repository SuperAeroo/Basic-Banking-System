require('dotenv').config()
const express = require('express')
const logger = require('morgan');
const app = express();
const {PORT =  3000} = process.env
const endPointV1 = require('./routes/endpointV1')
const cors = require('cors');

// swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require("fs");
const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


var usersRouter = require('./routes/users.routes');
var profilesRouter = require('./routes/profiles.routes');
var accountsRouter = require('./routes/accounts.routes');
var transactionsRouter = require('./routes/transactions.routes');


app.use(cors());
app.use(logger('dev'));
app.use(express.json())
app.use('/api/v1',endPointV1)

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/profiles', profilesRouter);
app.use('/api/v1/accounts', accountsRouter);
app.use('/api/v1/transactions', transactionsRouter);

// 404 err handling
app.use((req,res,next) => {
    res.status(400).json({
        status : false,
        message : 'data not fund',
        data : null
    })
})

// 500 error handling
// app.use((err, req, res, next) => {
//     res.status(500).json({
//         status: false,
//         message: 'Internal Server Error',
//         data: err
//     });
// });

// app.listen(PORT, () => console.log("SERVER SEDANG BERJALAN PADA PORT : ", PORT))
module.exports = app;