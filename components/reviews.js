import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import fontawesome from 'react-native-vector-icons/fontawesome';
import { AuthContext , theme , background, ErrorPage, URL, borderColor, width, height} from '../Screens/exports'

import axios from 'axios';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';

const ReviewComponent = ({item}) => {


  return(
      <View style = {{backgroundColor : background , margin : 10, borderBottomWidth : 1, borderBottomColor : "#EEE",}}>
          <View style ={{flexDirection : 'row'}}>
              <View style = {{margin:5}}>
                  <Image
                  source={{uri : item.profile_image}}
                  style = {{height: 40 , width:  40 , borderRadius: 40} }
                  />
              </View>
              <View style = {{flex : 1,justifyContent : 'center' , marginLeft : 10 ,marginRight : 10 }}>
                  <View style = {{flexDirection : 'row' , justifyContent : 'space-between'}}>
                      <View>
                          <Text style = {{fontWeight : 'bold'}}>{item.username}</Text>
                      </View>
                      <View>
                          <Text style = {{fontSize : 12, fontStyle: 'italic'}}>{moment(item.created_at,"YYYY-MM-DD hh:mm:ss").add(5,'hours').add(30, 'minutes').fromNow()}</Text>
                      </View>
                  </View>
              </View>
              
          </View>

          <View style = {{}}>
              <View style = {{}}>
                  <Image
                          source={{uri:item.image}}
                          style = {{width : width*0.92 , height : width*0.69, marginHorizontal : width*0.02 } }
                  />
              </View>
              <View>
                  {item.content_like ?
                  <View style = {{flexDirection : 'row', marginLeft : 5, marginBottom : 10,  marginTop : 10 , marginRight : 10, flexShrink : 1, paddingRight : 10,  }}>
                    <AntDesign name = "like2" size = {20} color = "green"/>
                    <Text style = {{marginLeft : 10, flexShrink : 1, }}>{item.content_like} dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddfasdasdaasdasfafasfasfsafsafsafasfsafsafasfsafsafasfasfasdcfcssssssssssssssssssssssscavasdfasdfasdfasfasfasdafcadcascascasfwafas</Text>
                  </View>
                  : null }
                  {item.content_dislike ?
                  <View style = {{flexDirection : 'row', marginLeft : 5, marginBottom : 10 ,  marginRight : 10, flexShrink : 1, paddingRight : 10,}}>
                    <AntDesign name = "dislike2" size = {20} color = "red"/>
                    <Text style = {{marginLeft : 10, flexShrink : 1,  }}>{item.content_dislike}</Text>
                  </View>
                  : null }
              </View>  
          </View>
      </View>
  );
}




const Reviews = ({product_id}) => {

    const [reviewData , setReviewData]  = React.useState([])
    React.useEffect(() => {
        
      const getReviewData = () => {
        axios.get(URL + "/reviews/getreview", {
            params: {
             "product_id": product_id
            }
          }, {timeout : 5000})
        .then(res => res.data)
        .then(function (responseData) {
          //  console.log( "productData : ", responseData)
           setReviewData(responseData)
            // setLoading(false)
            // setFirstLoaded(true)
        })
        .catch(function (error) {
           console.log("error: ",error);
        //   setError(true);      
        })
      }
    
    //   setLoading(true)
      getReviewData()
      
     // console.log( "productData : ", reviewData)
    
        // setLoading(false)
        // setError(false)
        // setRefreshing(false)
    
      
      
    },[])
    

    return(
        <View style = {{backgroundColor : background, flex : 1,}}>
            {reviewData.length? <FlatList
            keyExtractor = {(item) => item.review_id.toString()}
            data = {reviewData}
            renderItem = {({item})=> (
                <ReviewComponent 
                    review_sum_id = {item.review_id.toString()}
                    item = {item}                   
                /> 
            )}
            />: null}
        </View>
    )
}

export default Reviews;