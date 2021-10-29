import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image } from 'react-native';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from './exports'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import axios from 'axios';
import { header } from './styles';

const ProductDescription = (props) => {

      const navigation = useNavigation();
      
      return(
          <TouchableOpacity 
          style = {styles.container}
          onPress = {()=> navigation.navigate('ProductDetails' , {product_id: props.product_id , product_name: props.product_name ,image: props.image})}
          >
              <View style = {styles.imageview}>
                <Image source={{uri:props.image}}
                style = {{height: 70 , width: 70  } }/>
              </View>
              <View style = {{ flex : 1,   marginLeft:5  ,  marginRight : 5, marginTop:5, }}>
                <View style = {{flex : 1, flexShrink: 1,}}>
                  <Text style = {{fontWeight: 'bold' , fontSize:15 , flexShrink : 1}}>
                    {props.product_name}
                  </Text>
                </View>
                <View>
                  <Text>{props.brand}</Text>
                </View>
                <View>
                  <Text>{props.category_name}</Text>
                </View>
                <View style = {styles.reviewnumber}>
                  <View>
                    <Text>Reviews</Text>
                  </View>
                  <View>
                    <Text style = {{marginLeft: 10}}>{props.number_of_reviews}</Text>
                  </View>
                </View>
              </View>
          </TouchableOpacity>
      );
  }
  




const FeedSearch = () =>{

    const [productData , setProductData] = React.useState([])
    const route = useRoute()
    const navigation = useNavigation()
    const value = route?.params?.value ? route.params.value : ""

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
        <View style = {{backgroundColor : background, flex : 1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title={value}
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.goBack()}
                rightDisable
                />
            </View>

            {productData.length? 
            
            <FlatList

            keyExtractor = {(item) => item.product_id.toString()}
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
            />
            : null}
        </View>

    );
}

const styles = StyleSheet.create({
  container:{
      // flex: 1
      flexDirection:'row',
      marginLeft : 10,
      marginRight: 10,
      backgroundColor:background,
      marginTop: 10,
      // marginRight: 5,
      elevation : 5,
  },

  imageview :{
      width : '25%',
      alignItems:'center',
      justifyContent:'center',
  },

  contentview:{
      marginLeft:5  , 
      marginRight : 5,
      marginTop:5,
    
  }, 
  reviewnumber:{
      flexDirection: 'row',
      
  }
})


export default FeedSearch;