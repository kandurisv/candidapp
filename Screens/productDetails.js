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
import ProductDetailsHeader from '../components/productDetailsHeader';
import { header, user } from './styles';
import ModernHeader from 'react-native-modern-header';

// const Tab = createMaterialTopTabNavigator();


const ProductDetails = () =>{

    const navigation  = useNavigation();
    const route = useRoute();
    const body = route.params?.body;
    
    React.useEffect(()=>{
        console.log(body)
    },[])

    // console.log(productData)
    return(
        <View style = {[user.container,{marginBottom : 0}]}>
            <View style = {header.headerView}>
                    <ModernHeader
                    title= {body.category_name}
                    titleStyle = {header.headerText}
                    backgroundColor= {background}
                    leftIconColor = {borderColor}
                    leftIconOnPress={() => navigation.navigate("UserDetails")}
                    rightDisable
                    />
            </View> 
            <View style = {{marginHorizontal : 10,}}>
                <ProductDetailsHeader
                    id = {body.product_id}
                    product_name = {body.product_name}
                    image = {body.image}
                    brand = {body.brand}
                />
            </View>
            
            <NavigationContainer
                independent = {true}
            >
                <Tabs
                    product_id = {body.product_id}
                />
            </NavigationContainer>
        </View>
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

export default ProductDetails;