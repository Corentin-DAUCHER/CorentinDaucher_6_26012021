//PACKAGE HTTP

const http = require('http');

//Import de l'app express

const app = require('./app');

//Initialisation du port

const normalizePort = val => {
    const port = parseInt(val, 10);

    if(isNaN(port)){
        return val;
    };
    if(port >= 0){
        return port;
    }
    return false;
}

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

//Error handler

const errorHandler = error => {
    if(error.syscall !== 'listen'){
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port;

    switch(error.code){
        case 'EACCES': 
            console.error(bind + 'requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRESINUSE':
            console.error(bind + 'is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//Création du server

const server = http.createServer(app);

//Error event du server

server.on('error', errorHandler);

//Listening event du server

server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

//Mise sur écoute du server

server.listen(port);

