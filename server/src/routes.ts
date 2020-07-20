import express from 'express';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import ItemsCotontroller from './controllers/ItemsController';

// padrão: (p/ listagem:) index, (um unico registro) show, create, update, delete
const routes = express.Router();
const upload = multer(multerConfig);

//instancia da class
const pointsController = new PointsController();
const itemsController = new ItemsCotontroller();



//p1 qual a rota p2 a funcao (a funcao recebe dois parametros p1 request:para obter dados da requisicao(ex: obter nome de um usuario) e response: devolver uma resposta para o brawser)
routes.get('/items', itemsController.index); 

 //rota para criação de ponto de coleta 

 routes.get('/points', pointsController.index);
 routes.get('/points/:id', pointsController.show);

 //se fosse fazer upload de várias imagens no lugar de single seria array
 routes.post(
     '/points', 
     upload.single('image'), 
     celebrate ({
         body: Joi.object().keys({
             name: Joi.string().required(),
             email: Joi.string().required().email(),
             whatsapp: Joi.number().required(),
             latitude: Joi.number().required(),
             longitude: Joi.number().required(),
             city: Joi.string().required(),
             uf: Joi.string().required().max(2),
             items: Joi.string().required()
         })
     }, {
         abortEarly:false
     }),
     pointsController.create
     );
 

 export default routes;

 