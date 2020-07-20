import knex from 'knex';
import path from 'path'; // quando vai usar caminho no node tem que importar o path \/ padroniza o caminho/acesso a uma pasta SO

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname,'database.sqlite'),
    },
    useNullAsDefault: true,
});

export default connection;