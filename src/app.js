const http = require('http');

const express = require('express');

const passport = require('passport');

const cookieSession = require('cookie-session');

require('./passport/google');

const sequelize = require('./db/db');

const cookieParser = require('cookie-parser');

require('./db/mongo');

const socketio = require('socket.io');

const helmet = require('helmet');

const routers = require('./routers');

const globalErrHandler = require('./appError/globalErrHandler');

const app = express();

const server = http.createServer(app);

app.set('trust proxy', true);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use((req, res, next) => {
  if (req.headers.origin == 'https://www.bilboard.org') {
    res.append('Access-Control-Allow-Origin', 'https://www.bilboard.org');
  } else if (req.headers.origin == 'https://bilboard.org') {
    res.append('Access-Control-Allow-Origin', 'https://bilboard.org');
  } else {
    res.append('Access-Control-Allow-Origin', 'http://localhost:4040');
  }
  res.append('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,PUT');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.append('Access-Control-Allow-Credentials', true);
  next();
});

app.use(cookieParser());

app.use(express.json());

app.use(
  '/api/google',
  cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2'],
  })
);

app.use('/api/google', passport.initialize());
app.use('/api/google', passport.session());

for (let router of routers) {
  app.use(router);
}

const io = socketio(server, {
  cors: {
    origin: 'https://bilboard.org',
    credentials: true,
  },
  pingTimeout: 60000,
});

app.use(globalErrHandler);

module.exports = {
  server,
  sequelize,
  io,
};
