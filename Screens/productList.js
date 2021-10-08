import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image } from 'react-native';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDescription from '../components/productDescription';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from './exports'

import axios from 'axios';

const ProductList = () =>{

    const [productData , setProductData] = React.useState([])

    React.useEffect(() => {
        console.log("item_id" , 1)

      const getProductData = () => {
        axios.get(URL + "/product/category", {
            params: {
             category_id: 1
            }
          }, {timeout : 5000})
        .then(res => res.data)
        .then(function (responseData) {
        //    console.log( "productData : ", responseData)
           setProductData(responseData)
            // setLoading(false)
            // setFirstLoaded(true)
        })
        .catch(function (error) {
           console.log("error: ",error);
        //   setError(true);      
        })
      }
    
    //   setLoading(true)
      getProductData()
      
      console.log( "productData : ", productData)
    
        // setLoading(false)
        // setError(false)
        // setRefreshing(false)
    
      
      
    },[])
    

    return (
        <View>
            {productData.length? <FlatList
            keyExtractor = {(item) => item.product_id}
            data = {productData}
            renderItem = {({item})=> (
                <ProductDescription 
                    product_id = {item.product_id}
                    category_id = {item.category_id}
                    brand_id = {item.brand_id}
                    product_name = {item.product_name}
                    brand = {item.brand}
                    category_name = {item.category_name}
                    claim = {item.claim}
                    image = {item.image}
                    number_of_reviews = {item.number_of_reviews}
                    
                /> 
            )}
            />: null}

        </View>

    );
}

const styles = StyleSheet.create({

})

export default ProductList;