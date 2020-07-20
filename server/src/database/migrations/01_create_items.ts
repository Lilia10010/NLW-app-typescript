import Knex from 'knex'; //K maiúculo pq geralmente os tipos de começam com a letra maiuscula que não são nativos da biblioteca
// (knex) instancia para acesso ao banco de dados
export async function up(knex: Knex) {
    //criar a tabela
    //p1 nome da tabela p2 nfunção
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();        
    });
}

export async function down(knex: Knex) {
    // voltar atrás (deletar a tabela criada)
    return knex.schema.dropTable('items')

}