require('dotenv').config()
const express = require('express')
const app = express();
const {PORT =  3000} = process.env
const endPointV1 = require('./routes/endpointV1')

app.use(express.json())
app.use('/api/v1',endPointV1)

// 404 err handling
app.use((req,res,next) => {
    res.status(400).json({
        status : false,
        message : 'data not fund',
        data : null
    })
})

// 500 error handling
app.use((err, req, res, next) => {
    res.status(500).json({
        status: false,
        message: 'Internal Server Error',
        data: err
    });
});

app.listen(PORT, () => console.log("SERVER SEDANG BERJALAN PADA PORT : ", PORT))