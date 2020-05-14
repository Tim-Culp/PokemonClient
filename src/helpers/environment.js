let APIURL = 'https://tc-pokemon-server.herokuapp.com';

switch (window.location.hostname) {
    case 'localhost' || '127.0.0.1':
        APIURL = 'http://localhost:3003';
        break;
    case 'tc-pokemon-client.herokuapp.com':
        APIURL = 'https://tc-pokemon-server.herokuapp.com';
        
}

export default APIURL;