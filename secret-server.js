const express = require('express')
const fs = require("fs-extra")
const bodyParser = require("body-parser")
const crypt = require("./crypt")
const fsWrapper = require("./fs_wrapper")
const app = express()
const port = 4001

app.use(bodyParser.json())

app.get('/secret', function (req, res) {
    fsWrapper.read("secret.txt")
        .then(content => crypt.decrypt(content))
        .then(function (value) {
            res.send(value)
        })
})

app.put('/secret', function (req, res) {
    if (req.body.secret) {
        const secret = req.body.secret
        fsWrapper.write("secret.txt", crypt.encrypt(secret))
            .then(status => {
                res.send(JSON.stringify(status))
            })
            .catch(err => {
                console.error(err)
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(400)
    }
})

app.listen(port, function () {
    console.log(`Secret server listening on port ${port}!`)
})