import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image } from 'react-native';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDescription from '../components/productDescription';
import Overview from '../components/overview';
import Reviews from '../components/reviews';
import Tabs from '../components/tabs';


import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from './exports'

import axios from 'axios';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProductDeatilsHeader from '../components/productDetailsHeader';

// const Tab = createMaterialTopTabNavigator();


const ProductDeatils = () =>{

    const navigation  = useNavigation();
    const route = useRoute();
    const productData = route.params;
    
    // console.log(productData)
    return(
        <>
            <ProductDeatilsHeader
                id = {productData.product_id}
                product_name = {productData.product_name}
                image = {productData.image}
            />
            <NavigationContainer
                independent = {true}
            >
                <Tabs
                    product_id = {productData.product_id}
                />
            </NavigationContainer>
        </>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 10,
        justifyContent:'center'
    },

    listTab:{
        flexDirection: 'row',
        alignSelf:'center',
        marginBottom: 20
    },

    btnTab:{
        width: '30%',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor:'#EBEBEB',
        padding: 10,
        justifyContent: 'center',
        backgroundColor:'#fff'
    },

    textTab:{
        fontSize: 16,
        color:'black'
    },

    btnTabActive:{
        backgroundColor:'#E68380'
    },

    textTabActive :{
        color: '#fff'
    },

    itemContainer:{
        width : '90%',
        alignSelf:'center'
    },
    
    textItem:{
        fontSize: 16,

    }

})

export default ProductDeatils;