import React, { useState , useEffect, useContext} from 'react'
import { View, Text , ScrollView ,RefreshControl ,Animated, Easing, ToastAndroid ,  FlatList, ActivityIndicator, StyleSheet, Image , Dimensions} from 'react-native'
import moment from 'moment';
import { useNavigation , useRoute } from '@react-navigation/native';
import axios from 'axios'
import {URL,  background, borderColor , theme, fitem, LoadingPage} from './exports'
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native-gesture-handler'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import {Avatar} from 'react-native-paper'
//import * as Amplitude from 'expo-analytics-amplitude';
import { feed, header, header1, postDetails } from './styles';


//Amplitude.initializeAsync("af380775c59ead50c4c02536befef5e5");

const {width} = Dimensions.get("screen");
const height = width * 1.2

const FeedItem = ({item}) => {
  const navigation = useNavigation()
  
  
    var review = ""
    item.content.map((reviewItem,index) => {
      if(reviewItem.length > 0) {
        review = review + "Day " + item.day_product_used_content[index] + ": " + reviewItem + "\n"
      }
      })
    
    var context = ""
    item.category_ques.map((contextItem,index)=>{
      context = context + item.category_ques[index] + " : " + item.category_ans[index] + "\n" + "\n"
    })

    const onItemClick = () => {
      navigation.navigate("PostDetails", {details : item , reviewDetails : review , contextDetails : context})
    }

    return(
        <TouchableWithoutFeedback style = {feed.scrollableFeedContainer} onPress = {onItemClick} >
            <View style ={[feed.scrollableFeedItemUserNameHeaderView,{borderRadius:10}]}>
            {  item.profile_image && item.profile_image != "None" && item.profile_image != "" ?
                        <Image source = {{uri : item.profile_image}} style = {{width : 28, height : 28 , borderRadius : 28 , marginTop : 5 , marginLeft : 5  }}/> :
              <Avatar.Image
                style = {{marginTop : 5 , marginLeft : 5 , }}
                source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.username + '&size=64&background=D7354A&color=fff&bold=true'
                            }} 
                size={28}
              /> }
              <Text style ={feed.scrollableFeedItemUserName} >{item.username}</Text>  
              <Text style = {feed.scrollableFeedItemTime}>{moment(item.event_ts,"YYYY-MM-DD hh:mm:ss").add(5,'hours').add(30, 'minutes').fromNow()}</Text>  
            </View>
            <ScrollView 
              // pagingEnabled 
              horizontal 
              showsHorizontalScrollIndicator = {false} 
              contentContainerStyle = {{}}
              snapToInterval = {width-40}
            >
            {item.image_list.map((image , index) => (
              <View key = {index}>
                <Image key = {index} style = {feed.scrollableFeedItemHorizontalScrollImage} source = {{uri: image ? image : "No Image"}}/>
                <View style = {feed.scrollableFeedItemImagesCount}>
                  <Text style = {{fontSize:10, color : background}} >{index+1}/{item.image_list.length}</Text>
                </View>
              </View>  
            ))} 
            </ScrollView>
            <View style ={[feed.scrollableFeedItemProductView,,{borderRadius:10}]}>
              <Text style ={feed.scrollableFeedItemProductName} >{item.product_name}</Text>
              <Text style ={feed.scrollableFeedItemProductReview} > {review.length > 40 ? review.substring(0,40) + "..." : review} </Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

const Feed = (props) => {

  const route = useRoute()
  const navigation = useNavigation()

  const progress = React.useRef(new Animated.Value(0)).current

  const [firstLoad,setFirstLoad] = React.useState(false)

  const [refreshing, setRefreshing] = useState(false);
  const [itemsForFeed,setItemsForFeed] = useState([])
  const [error, setError] = useState(false);
  const [pageNumber,setPageNumber] = useState(1)
  const [loadingMore,setLoadingMore] = useState(false)
  const [varValue,setVarValue] = useState(route ? route.params ? route.params.varValue ? route.params.varValue : "time" : "time" : "time")
  const [requestValue,setRequestValue] = useState(route ? route.params ? route.params.value ? route.params.value : null :null : null)
  const [requestId,setRequestId] = useState(route ? route.params ? route.params.id ? route.params.id : null :null : null)
 // const [parameter, setParameter] = useState(route ? route.params ? route.params.varValue ? {var : varValue,value : requestId} : {var : "time"} : {var : "time"} : {var : "time"})
  const [reachedEnd,setReachedEnd] = React.useState(false) 


  const fetchMoreItems = async() => {
    axios.get(URL + "/post/feed", {
      params: {
        var : varValue,
        value : requestValue,
        page : pageNumber
      }
    })
  .then(res => res.data)
  .then(function (responseData) {
    //  console.log(responseData)
      if(responseData.length > 0) {
        setPageNumber(pageNumber + 1)
        setItemsForFeed([...itemsForFeed,...responseData])
      }
      else {
        setReachedEnd(true)
      }
     // console.log("*****************LOAD MORE***************")
     // console.log(pageNumber)
      setLoadingMore(false)})
  .catch(function (error) {
  //  console.log(error);
    setError(true);      
  });
  }

  const loadMoreItems = () => {
  //  console.log(pageNumber)

    if(!reachedEnd)
    {
      setLoadingMore(true)
      fetchMoreItems()
    }
   
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    progress.setValue(0)
    axios.get(URL + "/post/feed", {
      params: {
         var : varValue,
         value : requestId,
         page : 0
       }
   })
  .then(res => res.data)
  .then(function (responseData) {
    // Amplitude.logEventWithPropertiesAsync('FEED_PAGE_VISIT',{"fromPage" : varValue , "onKey" : requestId })
    //   console.log("response",responseData)
    // console.log(responseData.length)
    setItemsForFeed(responseData)
    setRefreshing(false);
     })
  .catch(function (error) {
   setError(true);   
    })
  });
  

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver : true
    },).start();
  //  console.log("feed ", "VarValue:" ,varValue, "requestId:" , requestId , "requestValue:" , requestValue )
    setVarValue(route ? route.params ? route.params.varValue ? route.params.varValue : "time" : "time" : "time")
    setRequestValue(route ? route.params ? route.params.value ? route.params.value : null : null : null)
    setRequestId(route ? route.params ? route.params.id ? route.params.id : null :null : null)
  //  setParameter(route ? route.params ? route.params.varValue ? {var : varValue,value : requestId} : {var : "time"} : {var : "time"} : {var : "time"})
   

   

    axios.get(URL + "/post/feed", {
         params: {
            var : varValue,
            value : requestId ,
            page : 0
          }
      })
    .then(res => res.data)
    .then(function (responseData) {
       // Amplitude.logEventWithPropertiesAsync('FEED_PAGE_VISIT',{"fromPage" : varValue , "onKey" : requestId })
         console.log("Response", responseData)
        // console.log(responseData.length)
        setItemsForFeed(responseData)
        setFirstLoad(true)
        })
    .catch(function (error) {
      setError(true);   
    //  console.log("Error" , error)   
    });
  },[route.params, varValue,requestId,requestValue]);

  const items = ({item,index}) => (
        (item.image_list && item.username) ?
          <View key = {index}>     
            <FeedItem key = {index} item = {item}/> 
          </View> : null
        )

  const refreshPage = () => {
    onRefresh()
  }

    const Loader = () => (
        <View style={{ minHeight: 230, padding: 20 }}>
          <ActivityIndicator
            color="#000"
            size="large"
            style={{ alignSelf: "center" }}
          />
        </View>
      );
 
  return (
    <View style = {feed.container}>
      <View style = {header1.headerView}>
            <ModernHeader 
                title="Explore"
                height = {50}
                titleStyle = {header1.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.goBack()}
                leftIconComponent = {
                  <View>
                    <Image style={{height : 30 , width : 30}}
                          source={require('../assets/LogoTransparentSolidColorLine.png')}
                      />
                  </View>
                }
                rightDisable
                />
      </View>
      <View style = {feed.mainContainer}>
        {error ? 
        <View><Text>Error while loading data 😢</Text></View> : 
        firstLoad ? 
        <FlatList 
        keyExtractor={item => item.review_sum_id} 
        style = {feed.scrollableFeedContainer}
        contentContainerStyle = {{}}
        showsVerticalScrollIndicator={false}
        data = {itemsForFeed}            
        renderItem = {items}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListFooterComponent={loadingMore && <Loader />}
        onEndReachedThreshold={0.001}
        onEndReached={loadMoreItems}/> : 
        <LoadingPage />
       }
      </View> 
    </View>
  )
}

export default Feed
