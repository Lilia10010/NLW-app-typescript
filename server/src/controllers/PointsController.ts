import { Request, Response} from 'express';
import knex from '../database/connection';

class PointsController{
    async index(request: Request, response: Response){
        const {city, uf, items} = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
            
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems) // buscando item_id que esta dentro do filtro: parsedItems
            .where('city', String(city))// recebendo informações do query (no caso a city)
            .where('uf', String(uf))
            .distinct()
            .select('points.*'); // ou seja busca dados da tabela ponts e não da tb que fez o join

            const serializePoints = points.map(point => {   
                return{ 
                    //retornar todos os dados dos pontos
                    ...point,
                    image_url: `http://192.168.15.3:3333/uploads/${point.image}`,
                };
            });
        
            return response.json(serializePoints);

        //return response.json({ ok: true});
        return response.json(points);
    }

    async show(request: Request, response: Response) {
        // const id = request.params.id; (outra maneira de fazer usando desentruturação logo mais)
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({message: 'Point not found.'});
        }

        const serializePoint = {   
                           //retornar todos os dados dos pontos
                ...point,
                image_url: `http://192.168.15.3:3333/uploads/${point.image}`,
           
        };
    
      

        /**
         * SELECT * FROM items
         * JOIN point_items ON items.id = point_items.item_id
         * WHERE pont_itmes.point.id = id (este id é o que esta vindo ali de cima)
         */
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where ('point_items.point_id', id)
            .select('items.title');

        return response.json({point: serializePoint, items});
    }
    
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items 
        } = request.body;
   
        //para deixar os inserts dependendo um do outro, caso um não funcione não executar o outro
        const trx = await knex.transaction();

        const pont = {
            image: request.file.filename,
             name,
             email,
             whatsapp,
             latitude,
             longitude,
             city,
             uf
                      
         };
   
       const insertedIds = await trx('points').insert(pont);
   
        const point_id = insertedIds[0];
   
        const pointItems = items
        .split(',')
        // outra forma de conver para numero +(item.trim()
        .map((item: string )=> Number(item.trim()))
        .map((item_id:number) => {
            return{
                item_id,
                point_id,
            }
        });
   
        await trx('point_items').insert(pointItems);

        await trx.commit(); // sempre que usar txr(transaction) tem que colocar este commit para fazer de fato os inserts   
   
        return response.json({
            id: point_id,
            ... pont,
        });
    }
}

export default PointsController;