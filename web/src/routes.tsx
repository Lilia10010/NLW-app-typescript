import React from 'react';
//p2 instrui p/ a aplicação qual o tipo de rota
import { Route, BrowserRouter } from 'react-router-dom'; 

import Home from './pages/Home';
import CreatPoint from './pages/CreatPoint';

const Routes = () => {
    return(
        <BrowserRouter>
            <Route component={Home} path="/" exact />        
            <Route component={CreatPoint} path="/creat-point" />        
        </BrowserRouter>
    );
} 

export default Routes;