import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReviewComponenet from './reviewComponent';
// import fontawesome from 'react-native-vector-icons/fontawesome';
import { AuthContext , theme , background, ErrorPage, URL, borderColor, width, height} from '../Screens/exports'

import axios from 'axios';


const Reviews = (props) => {

    const [reviewData , setReviewData]  = React.useState([])
    React.useEffect(() => {
        
      const getReviewData = () => {
        axios.get(URL + "/reviews/getreview", {
            params: {
             "product_id": 1
            }
          }, {timeout : 5000})
        .then(res => res.data)
        .then(function (responseData) {
            console.log( "productData : ", responseData)
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
      
      console.log( "productData : ", reviewData)
    
        // setLoading(false)
        // setError(false)
        // setRefreshing(false)
    
      
      
    },[])
    

    return(
        <View style = {{backgroundColor : background, flex : 1,}}>
            {reviewData.length? <FlatList
            keyExtractor = {(item) => item.review_sum_id.toString()}
            data = {reviewData}
            renderItem = {({item})=> (
                <ReviewComponenet 
                    review_sum_id = {item.review_sum_id}
                    user_id = {item.user_id}
                    username = {item.username}
                    event_ts = {item.event_ts}
                    content = {item.content}
                    
                /> 
            )}
            />: null}
        </View>
    )
}

export default Reviews;