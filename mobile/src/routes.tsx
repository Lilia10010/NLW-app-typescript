import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; // é o tipo de navegação entre as páginas no caso será através de um botão

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';

//AppStack vai funcionar como o roteamento
const AppStack = createStackNavigator();

////componente é o que será exibido em tela quando esta rota estiver ativada
//(a primeira chave indica que o conteúdo é js e a segundo que é um ob)
const Routes = () => {
    return(
        <NavigationContainer>
            <AppStack.Navigator headerMode="none" screenOptions={{cardStyle: {backgroundColor: '#f0f0f5'}}}>
                <AppStack.Screen name="Home" component={Home} />                
                <AppStack.Screen name="Points" component={Points} />                
                <AppStack.Screen name="Detail" component={Detail} />                
            </AppStack.Navigator>
        </NavigationContainer>
    );
};

export default Routes; 


