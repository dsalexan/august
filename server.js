require('dotenv').config();

var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var router = express.Router()

var server = app.listen(port, () => {
    console.log(`server listening at port ${port}`)
})

var Test = require('./models/Test')
var authController = require('./controllers/AuthController')

// log request middleware
router.use(function(req, res, next) {
    console.log(req.method, req.url)

    next()
})

app.use('/api/auth', authController)
app.use('/', router);

// error handling middleware
// chamar next(err) nos error handling individuais em cada rota pra cair nesse error handler genérico aqui
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json(err);
});