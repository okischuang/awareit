'use strict'

var express = require('express')
var app = express()

app.post('/webhook', function (req, res) {
  res.send('Webhook TEST!!!')
})

var server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Hi! http://%s:%s', host, port)
})
