require('dotenv').config();

var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var router = express.Router()

var server = app.listen(port, () => {
    console.log(`server listening at port ${port}`)
})

var Test = require('./models/Test')
var authController = require('./auth/AuthController')

router.use(function(req, res, next) {
    console.log(req.method, req.url)

    next()
})

router.get('/api/test/get', (req, res, next) => {
    Test.getTest().then(data => {
        res.status(200)
            .json({
                status: 'success',
                data: data,
                message: 'Get Test'
            })
    }).catch(err => {
        return next(err)
    })
})

app.use('/api/auth', authController)
app.use('/', router);