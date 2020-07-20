import Knex from 'knex'; //K maiúculo pq geralmente os tipos de começam com a letra maiuscula que não são nativos da biblioteca
// (knex) instancia para acesso ao banco de dados
export async function up(knex: Knex) {
    //criar a tabela
    //p1 nome da tabela p2 nfunção
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();
//chave estrangeira         
//o campo point_id vai criar uma chave estrangeira na tb ponts no campo id
        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points');

        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('items');        
    });
}

export async function down(knex: Knex) {
    // voltar atrás (deletar a tabela criada)
    return knex.schema.dropTable('point_items')

}