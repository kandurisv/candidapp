import React, { useState , useEffect, useContext} from 'react'
import { View, Text , ScrollView ,RefreshControl ,Animated, Easing, ToastAndroid ,  FlatList, ActivityIndicator, StyleSheet, Image , Dimensions} from 'react-native'
import moment from 'moment';
import { useNavigation , useRoute } from '@react-navigation/native';
import axios from 'axios'
import {URL,  background, borderColor , theme, fitem, LoadingPage, lightTheme, AuthContext} from './exports'
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


  const [imageCheck,setImageCheck] = React.useState(true)

  
  
  const onItemClick = () => {
      navigation.navigate("JourneyDetails", {item : item})
  }

  React.useEffect(()=>{
    console.log(item.image[Object.keys(item.image)[0]].replace(" ", "%20"))
    setImageCheck(Object.values(item.image).some(x => x !== null && x !== ''))
    console.log(Object.values(item.image).some(x => x !== null && x !== ''))
  },[item])

    return(
        <TouchableWithoutFeedback style = { imageCheck ?
          [feed.scrollableFeedContainer,{height : width*0.95}] :
          {borderWidth : 1 , borderColor : '#BBB' , marginBottom : 10,marginLeft : 10, marginRight : 10,
            marginTop : 5, borderRadius : 10, backgroundColor : background
        } 
          } onPress = {onItemClick}
            key = {item.journey_id.toString()}
          >
            <View style ={ imageCheck ?
              [feed.scrollableFeedItemUserNameHeaderView,{borderRadius:10}] :
              {width : width-42,
                backgroundColor : "#666",
                height : 38,
                borderRadius : 9 ,}
              }>
            {  item.profile_image && item.profile_image != "None" && item.profile_image != "" ?
                        <Image source = {{uri : item.profile_image}} style = {{width : 28, height : 28 , borderRadius : 28 , marginTop : 5 , marginLeft : 5  }}/> :
              <Avatar.Image
                style = {{marginTop : 5 , marginLeft : 5 , }}
                source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.username + '&size=64&background=D7354A&color=fff&bold=true'
                            }} 
                size={28}
              /> }
              <Text style ={feed.scrollableFeedItemUserName} >{item.username}</Text>  
              <Text style = {feed.scrollableFeedItemTime}>{moment(item.last_updated,"YYYY-MM-DD hh:mm:ss").add(5,'hours').add(30, 'minutes').fromNow()}</Text>  
            </View>
            {imageCheck ?
            <ScrollView 
              // pagingEnabled 
              horizontal 
              showsHorizontalScrollIndicator = {false} 
              contentContainerStyle = {{}}
              snapToInterval = {width-40}
            >
            {imageCheck ? 
            Object.keys(item.image).map((key , index) => {return(
              <View key = {index.toString()}>
                <Image key = {index.toString()} style = {[feed.scrollableFeedItemHorizontalScrollImage,{height : ((3*width)/4)-30}]} source = {{uri: item.image[key] ? item.image[key] : "No Image"}}/>
                <View style = {feed.scrollableFeedItemImagesCount}>
                  <Text style = {{fontSize:10, color : background}} >{index+1}/{item.image.length}</Text>
                </View>
              </View>  
            )}) : null } 
            </ScrollView> : null }
            <View style ={ imageCheck ?
              [feed.scrollableFeedItemProductView,{borderRadius:10}] :
              [{borderRadius : 10 , marginTop : 10 ,  width : width - 45 ,  paddingBottom : 5, backgroundColor : background,} ]
              }>
                <View style = {{flexDirection : 'row', justifyContent : 'space-between', marginRight : 10 , alignItems : 'center'}}>
              <Text style ={ imageCheck ?
                feed.scrollableFeedItemProductName :
                [{color : borderColor , fontWeight : 'bold', marginLeft : 10 , marginTop : 10, }]
              } >{item.journey_title}</Text>
              <Text style = {{color : imageCheck ? 'white' : theme, fontStyle : 'italic' , fontSize : 13, marginTop : 10,}}>{item.datetime_array.length} entries</Text>
              </View>
              <View style = {{flexDirection : 'row' , flexWrap : 'wrap' , marginTop : 10 , }}>
             { item.product_names && item.product_names.map((item,index)=>{
                return(
                  <View 
                  key = {index.toString()}
                  style = { imageCheck ?
                    {backgroundColor : background, marginLeft : 10 , marginTop : 5, borderRadius : 10,justifyContent : 'center', alignItems : 'center', paddingVertical : 2, paddingHorizontal : 5,} :
                    {backgroundColor : '#888', marginLeft : 10 , marginTop : 5, borderRadius : 10,justifyContent : 'center', alignItems : 'center' , paddingVertical : 2, paddingHorizontal : 5,}
                    }>
                    <Text style ={ imageCheck ?
                      [feed.scrollableFeedItemProductReview,{color : borderColor}] :
                      {color : background}
                      } > {item} </Text>
                  </View>
                )
              })

              }
              </View>
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

  const [userId] = React.useContext(AuthContext)

  const fetchMoreItems = async() => {
    axios.get(URL + "/journey/feed", {
      params: {
        user_id : userId.slice(1,13),
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
    axios.get(URL + "/journey/feed", {
      params: {
          user_id : userId.slice(1,13),
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
   

   

    axios.get(URL + "/journey/feed", {
         params: {
            user_id : userId.slice(1,13),
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
        (item.username) ?
          <View key = {index.toString()}>     
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
        keyExtractor={item => item.journey_id.toString()} 
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
