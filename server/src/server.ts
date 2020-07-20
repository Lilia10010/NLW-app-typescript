import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errors } from 'celebrate';
//como estamos usando o typeScript é necessário fazer a definição de tipos das bibliotecas (as vezes a biblioteca separa: a definição de tipos do código)
// quando da os três pontinho é pq faltou a definição de tipos 

const app = express();

//use no caso é como se fosse um plugin uma funcionalidade a mais para o express (no cado é para ele entender o corpo da nossa requisição em formato json)
app.use(cors()); // quando for colocar no ar, tem que colocar com dominio vai poder acessar a aplicação: app.use(cors({www.dominio.com})); 
app.use(express.json());
app.use(routes); 

//p1 rota p2 função expecifica do express que é utilizado para servir arquivos estáticos (img, pdf, word)
//__dirname: diretório atual (al invés da / colocar a virgula - pois o path faz com que isso seja feito de acordo com o SO)
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads' )));

app.use(errors());

app.listen(3333);  
