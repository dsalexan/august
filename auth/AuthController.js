var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

router.post('/register', function (req, res) {

    var name = req.body.name
    var token = jwt.sign({
        id: name
    }, process.env.SECRET, {
        expiresIn: 86400
    })

    console.log(token)

    res.status(200).send({
        auth: true,
        token: token
    })
})

router.get('/me', function (req, res) {
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    })

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(500).send({
            auth: false,
            message: 'Failed to authenticate token.'
        });

        console.log(token)
        console.log(process.env.SECRET)
        console.log(decoded)
        res.status(200).send(decoded);
    })
})


module.exports = router