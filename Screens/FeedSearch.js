import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image } from 'react-native';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from './exports'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import axios from 'axios';
import { header } from './styles';
import { MaterialIcons } from '@expo/vector-icons';

const ProductDescription = (props) => {

      const navigation = useNavigation();
      
      return(
          <TouchableOpacity 
          style = {{flexDirection : 'row' , paddingBottom : 10, borderBottomWidth : 1 , borderBottomColor : '#EEE' , marginTop : 5, alignItems : 'center'}}
          onPress = {()=> navigation.navigate('ProductDetails' , {body:props})}
          >
              <View style = {{width : 100}}>
                <Image source={{uri:props.image}}
                style = {{height: 90 , width: 90 , borderRadius : 20 } }/>
              </View>
              
              <View style = {{ flex : 1,   marginLeft:5  ,  marginRight : 5, marginTop:5, }}>
                <View style = {{flexDirection : 'row' , justifyContent : 'space-between'}}>
                  <View>
                    <Text style = {{fontWeight : 'bold'}}>{props.brand}</Text>
                  </View>
                  <View style = {{backgroundColor : "#888", borderRadius : 5, paddingHorizontal : 5, justifyContent: 'center', alignItems : 'center'}}>
                    <Text style = {{fontSize : 12,fontStyle : 'italic', color : 'white'}}>{props.category_name}</Text>
                  </View>
                </View>
                <View style = {{flex : 1, flexShrink: 1,}}>
                  <Text style = {{fontSize:13 , flexShrink : 1}}>
                    {props.product_name}
                  </Text>
                </View>
                
                <View style = {{flexDirection : 'row-reverse' , justifyContent : 'space-between'}}>
                {/* {props.number_of_reviews ?
                  <View style = {{flexDirection : 'row', justifyContent : 'center' , alignItems : 'center'}}>
                    <MaterialIcons name = "recommend" size = {15}/> 
                    <Text style = {{marginLeft : 5, fontSize : 15, fontStyle : 'italic' , color : "#0E76A8"}}>{props.number_of_reviews}</Text>
                  </View>: <View><Text></Text></View>} */}
                  {props.number_of_reviews ?
                  <View style = {{flexDirection : 'row', justifyContent : 'center' , alignItems : 'center'}}>
                    <MaterialIcons name = "rate-review" size = {15}/> 
                    <Text style = {{marginLeft : 5,color : '#006241' , fontSize : 15 , fontWeight : 'bold'}}>{props.number_of_reviews} </Text>  
                  </View>  : <View><Text></Text></View>}            
                </View>
              </View>
          </TouchableOpacity>
      );
  }
  




const FeedSearch = () =>{

    const [productData , setProductData] = React.useState([])
    const [loading,setLoading] = React.useState(false)
    const [error,setError] = React.useState(false)
    const route = useRoute()
    const navigation = useNavigation()
    const varValue = route?.params?.varValue ? route.params.varValue : ""
    const id = route?.params?.id ? route.params.id : ""
    const name = route?.params?.value ? route.params.value : ""

    React.useEffect(() => {
        setLoading(true)
        console.log(varValue, id)

      const getProductData = () => {
        axios.get(URL + "/product/category", {
            params: {
             var: varValue,
             value : id
            }
          }, {timeout : 5000})
        .then(res => res.data)
        .then(function (responseData) {
        //    console.log( "productData : ", responseData)
            setProductData(responseData)
            setLoading(false)
            // setFirstLoaded(true)
        })
        .catch(function (error) {
           console.log("error: ",error);
           setLoading(false)
           setError(true);      
        })
      }
    

      getProductData()
      
     
    
  
    
      
      
    },[])
    

    return (
        <View style = {{backgroundColor : background, flex : 1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title={name}
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.goBack()}
                rightDisable
                />
            </View>

            { error ? 
            <View style = {{flex : 1 , justifyContent : 'center' , alignItems : 'center'}}>
              <Text> Error loading data, please try later</Text>
            </View> :
            loading ? 
            <LoadingPage /> :
            productData.length? 
            <FlatList
            style = {{margin : 10 }}
            contentContainerStyle = {{}}
            showsVerticalScrollIndicator = {false}
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
            : 
            <View style = {{flex : 1 , justifyContent : 'center' , alignItems : 'center'}}>
              <Text> No new posts </Text>
            </View>}
        </View>

    );
}

const styles = StyleSheet.create({
  // container:{
  //     // flex: 1
  //     flexDirection:'row',
  //     marginLeft : 10,
  //     marginRight: 10,
  //     backgroundColor:background,
  //     marginTop: 10,
  //     // marginRight: 5,
  //     elevation : 5,
  // },

  // imageview :{
  //     width : '25%',
  //     alignItems:'center',
  //     justifyContent:'center',
  // },

  // contentview:{
  //     marginLeft:5  , 
  //     marginRight : 5,
  //     marginTop:5,
    
  // }, 
  // reviewnumber:{
  //     flexDirection: 'row',
      
  // }
})


export default FeedSearch;