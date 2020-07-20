//ChangeEvent quando tem mudança de valor de algum select, input do form
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
//useHistory: poder navegar de um componente para o outro sem ter um botão (ou seja atraves de uma linha de código)
import { Link, useHistory } from 'react-router-dom';
//import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet'; //para a função de clicar no mapa e capturar o ponto
import api from '../../services/api';

import Dropzone from '../../components/Dropzone'


import './style.css';

import logo from '../../assets/logo.svg';

//useEffect(() => {}, []) extrutura basica

//sempre que criamos um estado pra um array ou objeto precisamos manualmente informar o tipo da variavel que será armazenada ali dentro
interface Item{
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse{
    sigla: string;
}

interface IBGECityResponse{
    nome: string;
}


const CreatPoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    //criar um estado (chamado ufs) que armazena (=) um vetor ([]) que começa vazio
    const [ufs, setUfs] = useState<string[]>([]); //<String[]> : vertor de string
    const [cities, setCities] = useState<string[]>([]); //<String[]> : vertor de string
    
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    //para armazenar o select da uf que o usuário seleconou
    const [selectedUf, setSelecteUf] = useState('0'); //estados: para ter acesso depois qndo for criar o ponto de coleta
    const [selectedCity, setSelecteCity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);//avisando que é array de numero pois vamos armazenar o id dos items escolhido
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]); //informando que a primeira prosição é um número e a segunda tbm
    //p1 qual função eu quero executar p2 quando eu quero executar essa função (como determinar o quando, ex: quando tal informação mudar ) 
    //se deixar o [] vazio será disparado apenas uma vez, se colocar uma function (ex: [counter]) será executado sempre que componente mudar (CreatPoint)
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    //vai disparar assim que a tela for carregada
    useEffect(() => {
        //retorna a posição inicial do usuário assim que abrir a tela
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude } = position.coords;

            setInitialPosition([latitude, longitude]);
        })
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data); 
           
        });
    }, []);

    
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            
            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => { 
        if(selectedUf === '0'){
            return;        
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome);
            
            setCities(cityNames);
        });


    }, [selectedUf]); //array q determina quando a função deve ser executada 

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelecteUf(uf);
    } 
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
           
        setSelecteCity(city);
    }
    
    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
       // console.log(event.target.name, event.target.value);
       const {name, value} = event.target;
        //copiar tudo que tem no form pra não perder os dados ...formData
        setFormData({ ...formData, [name]: value})
    }

    function handleSelectItem(id: number){
     //findIndex retorna um número 0 ou acima se o que estou buscando já estiver dentro do array senão estiver retorna -1   
       // verificar se tem algum item iguel o id que esta entrando   
     const alreadySelected = selectedItems.findIndex(item => item === id);
     
     if (alreadySelected >= 0) {
         //para remover 
         const filteredItems = selectedItems.filter(item => item !== id);
         setSelectedItems(filteredItems);
     } else {
       // ()...selectedItems) aproveitar o que já tem dentro e selecionar um novo id
        setSelectedItems([ ...selectedItems, id]);  
     }

     
    }


    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const {name, email, whatsapp} = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = new FormData()

            data.append('name', name);
            data.append('email', email);
            data.append('whatsapp', whatsapp);
            data.append('uf', uf);
            data.append('city', city);
            data.append('latitude', String(latitude));
            data.append('longitude', String(longitude));
            data.append('items', items.join(','));
            
            if (selectedFile){
                data.append('image', selectedFile)
            }


        
        await api.post('points', data);

        alert('Ponto de coleta criado!');

        //rota para redirecionar o usuário após o submit do form
        history.push('/');
        
      
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    
                    - voltar para Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta </h1>

                <Dropzone onFileUploaded={setSelectedFile} />  

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange}/>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    
                    <Map center={initialPosition} zoom={15} onClick={handleMapClick} >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                     <option key={uf} value={uf}>{uf}</option>                                  
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Cidade</option>
                                {cities.map(city => (
                                     <option key={city} value={city}>{city}</option>                                  
                                ))}
                            </select>
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                           <li 
                            key={item.id} 
                            onClick={() => handleSelectItem(item.id)}
                            className = {selectedItems.includes(item.id) ? 'selected' : ''}
                           >
                            <img src={item.image_url} alt="teste"/>
                            <span>{item.title}</span>
                        </li>  
                        ))}
                                               
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta 
                </button>
            </form>



        </div>

    );
};

export default CreatPoint;