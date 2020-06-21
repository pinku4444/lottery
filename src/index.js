import configuration from './config/config';
import Server from './server';

const server = new Server(configuration);
server.bootstrap();