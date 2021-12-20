const mongoose = require('mongoose');
const readLine = require('readline');

let dbURL = 'mongodb://127.0.0.1/apple_db';
console.log(process.env)
if (process.env.NODE_ENV === 'prod') {
  dbURL = process.env.MONGODB_URI;
}

const connect = () => {
  setTimeout(() => mongoose.connect(dbURL, 
    { 
      useNewUrlParser: true, 
      useCreateIndex: true, 
      useUnifiedTopology: true 
    }), 1000);
}

mongoose.connection.on('connected', () => {
  console.log('connected');
});

mongoose.connection.on('error', err => {
  console.log('error: ' + err);
  return connect();
});

mongoose.connection.on('disconnected', () => {
  console.log('disconnected');
});

if (process.platform === 'win32') {
  const readline = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  readline.on ('SIGINT', () => {
    process.emit("SIGINT");
  });
}

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close( () => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});

mongoose.set('useFindAndModify', false);

connect();

//load schemas
require('./users');
require('./books');
require('./reviews');
