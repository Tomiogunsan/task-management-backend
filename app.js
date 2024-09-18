const express = require('express')


app = express()

 app.get('/', (req, res) => res.status(200).send('Hello World!'))
module.exports = app;