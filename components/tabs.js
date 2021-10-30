import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Overview from './overview';
import Reviews from './reviews';
import Journey from './Journey';
import { background, theme } from '../Screens/exports';

const Tab = createMaterialTopTabNavigator()

const Tabs = (props) =>{
  

  return (
        <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { color : theme },
          tabBarStyle: { backgroundColor: background },
          tabBarIndicatorStyle : {backgroundColor : theme}
        }}
        >
            {/* <Tab.Screen name = "Overview" children={()=><Overview product_id={props.product_id}/>} /> */}
            <Tab.Screen name = "Reviews" children={()=><Reviews product_id={props.product_id}/>} />
            <Tab.Screen name = "Recommends" children={()=><Journey product_id={props.product_id}/>} /> 
            
        </Tab.Navigator>
        )
        ;
    
  
};

export default Tabs;
