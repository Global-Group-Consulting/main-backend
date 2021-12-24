'use strict'

const fs = require("fs")
const path = require("path")
const https = require('https')
const {Ignitor} = require('@adonisjs/ignitor')

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstrap Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass relative path from the project root.
*/

// Certificate
const options = {
  key: fs.readFileSync(path.resolve(__dirname, 'localhost.key')),
  cert: fs.readFileSync(path.resolve(__dirname, 'localhost.crt'))
}

if (!fs.existsSync("tmp")) {
  fs.mkdirSync("tmp")
}


new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .wsServer()
  .fireHttpServer((handler) => {
    if (process.env.NODE_ENV === "development") {
      return https.createServer(options, handler)
    }
  })
  .catch(console.error)
