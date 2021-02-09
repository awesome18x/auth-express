const express = require('express');
const createErrors = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
require('./helpers/init_mongodb');
const { verifyAccessToken } = require('./helpers/jwt_helper');

const AuthRoute = require('./routes/Auth.route');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', verifyAccessToken, async (req, res, next) =>{
    // console.log(req.headers['authorization']);
    res.send('Hello World');

})

app.use('/auth', AuthRoute);

app.use(async(req, res, next) => {
    // const error = new Error('Not Found');
    // error.status = 404;
    // next(error);

    next(createErrors.NotFound('This route does not exist'));
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status,
            message: err.message
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})
