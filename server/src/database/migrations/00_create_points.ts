import Knex from 'knex'; //K maiúculo pq geralmente os tipos de começam com a letra maiuscula que não são nativos da biblioteca
// (knex) instancia para acesso ao banco de dados
export async function up(knex: Knex) {
    //criar a tabela
    //p1 nome da tabela p2 nfunção
    return knex.schema.createTable('points', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf').notNullable(); 
    });
}

export async function down(knex: Knex) {
    // voltar atrás (deletar a tabela criada)
    return knex.schema.dropTable('points')

}