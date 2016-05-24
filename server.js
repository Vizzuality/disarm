'use strict';

const path = require('path');
const http = require('http');
const debug = require('debug')('disarm:server');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');
const isDevelop = process.env.NODE_ENV !== 'production';
const auth = require('basic-auth')

// Configuring App
const app = express();

//Aouth
app.use(function(req, res, next){
  var credentials = auth(req)

    if (!credentials || credentials.name !==  process.env.BASIC_AUTH_USERNAME || credentials.pass !== process.env.BASIC_AUTH_PASSWORD ) {
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', 'Basic realm="example"')
      res.end('Access denied')
    } else {
      next();
    }
});

if (isDevelop) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });
  app.use(middleware);

  // Routes
  app.get('/', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });

} else {

  app.use(express.static(__dirname + '/dist'));

  // Routes
  app.get('/', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val; // named pipe
  }
  if (port >= 0) {
    return port; // port number
  }
  return false;
}

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // Handle specific listen errors with friendly messages.
  const errors = {
    EACCES: () => {
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    },
    EADDRINUSE: () => {
      console.error(`${bind} is already in use`);
      process.exit(1);
    }
  };

  if (errors[error.code]) {
    errors[error.code]();
  } else {
    throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

