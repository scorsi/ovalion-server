import {Pool} from 'pg';

const client = new Pool();

client.connect();

export default client;