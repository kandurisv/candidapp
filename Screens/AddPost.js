import React from 'react'
import { StatusBar } from 'expo-status-bar';
import {Avatar} from 'react-native-paper';
import { Text, View , FlatList , Dimensions, ImageBackground, TouchableWithoutFeedback,TouchableOpacity, Animated, ScrollView, Alert, TextInput, ToastAndroid, Platform , Share, Image, Pressable} from 'react-native'
import { useNavigation , useRoute } from '@react-navigation/native';
import axios from 'axios';
import {URL, LoadingPage,  background, theme, firebaseConfig, AuthContext, borderColor, contrastLightTheme, contrastTheme, neutralTheme, lightTheme} from './exports'
import { AntDesign, Entypo, FontAwesome, FontAwesome5, Fontisto, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { header1, home } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
//import * as Amplitude from 'expo-analytics-amplitude';

import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants';

import 'react-native-get-random-values'
import { nanoid } from 'nanoid'

import Swiper from 'react-native-swiper'

//Amplitude.initializeAsync("af380775c59ead50c4c02536befef5e5");

import * as firebase from "firebase";


try {
    firebase.initializeApp(firebaseConfig);
  } catch (err) {
    // ignore app already initialized error in snack
  }

const {width, height} = Dimensions.get("window")
const CAROUSEL_ITEM_SQUARE_SIZE = 100
const CAROUSEL_ITEM_SPACING = 5


const UpdatedCarousel = ({DATA , onClickItem , varValue}) => {
  const [data,setData] = React.useState([...DATA])
  const scrollX = React.useRef(new Animated.Value(0)).current
  const ITEM_SIZE = CAROUSEL_ITEM_SQUARE_SIZE + CAROUSEL_ITEM_SPACING 
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
  
  const renderItem = ({item , index}) => {
      const itemClick = (item) => {
          onClickItem(item.name , item.id, varValue)
      }
     
      const inputRange = [
          ITEM_SIZE*(index-3),
          ITEM_SIZE*index,
          ITEM_SIZE*(index+1),
          ITEM_SIZE*(index+2),   
      ]
      const opacityInputRange = [
          -1,
          0,
          ITEM_SIZE*index,
          ITEM_SIZE*(index+1),   
      ]
      const scale = scrollX.interpolate({
          inputRange,
          outputRange : [1,1,0.5,0]
      })
      const opacity = scrollX.interpolate({
          inputRange : opacityInputRange,
          outputRange : [1,1,1,0]
      })

      return(
          <Animated.View style={[home.mainViewCarouselScrollableItemContainer  , {transform : [{scale}]}]}>
              <TouchableOpacity disabled style = {home.mainViewCarouselScrollableItemButton} onPress = {() => {itemClick(item)}}>
                  <View style = {{flex: 1  , width : 100, backgroundColor : background}}>
                    <Image source = {{uri : item.image ? item.image : "No Image"}} 
                        style = {[home.mainViewCarouselScrollableItemImageBackground, {opacity : 1 , backgroundColor : background, borderRadius : 40 , width : 80, height : 80 , marginLeft : 10} ]} />
                  </View>
                  <View style = {{backgroundColor : background , height : 45 , borderRadius : 5, }}>
                      <Text style={[home.mainViewCarouselScrollableItemText,{margin:1 ,fontSize : 10 , color : borderColor , }]}>{item.name.length > 30 ? item.name.substring(0,30) + "..." : item.name}</Text>
                  </View>
              </TouchableOpacity>
          </Animated.View>
      )
  }

  return (  
          <Animated.FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          horizontal = {true}
          style = {{width : Dimensions.get('screen').width*0.94}}
          contentContainerStyle = {home.mainViewCarouselScrollableItem}
          onScroll = {Animated.event(
              [{nativeEvent :  {contentOffset : {x : scrollX}}}],
              {useNativeDriver : true}
          )}
          snapToInterval = {ITEM_SIZE+5}
          showsHorizontalScrollIndicator = {false}
          />
  )
}



const AddPost = () => {

    const [userId,userDetails, isLoggedIn] = React.useContext(AuthContext)
    

    const navigation = useNavigation()
    const route = useRoute()

    const [response, setResponse] = React.useState([])
    const [userResponse, setUserResponse] = React.useState({})
    const [homeLoading,setHomeLoading] = React.useState(true)
    const [infoLoading,setInfoLoading] = React.useState(true)
    const [timed,setTimed] = React.useState(false)
    const [error,setError] = React.useState(false)
    const [secs,setSecs] = React.useState(0)
    const [refresh,setRefresh] = React.useState(false)
    const [result,setResult] = React.useState(false)
   
    const [heroImage,setHeroImage] = React.useState([])
    const [heroLink,setHeroLink] = React.useState([])
    const [heroLinkExists,setHeroLinkExists] = React.useState([])

    const [updateAvailable,setUpdateAvailable] = React.useState(false)
    const [updateApp, setUpdateApp] = React.useState(false)
    const [updateOptions,setUpdateOptions] = React.useState({})

    const [deviceToken , setDeviceToken] = React.useState("")
    const [expoToken , setExpoToken] = React.useState("")
    

    const [userDetailsAvailable,setUserDetailsAvailable] = React.useState(false)

    const [userName,setUserName] = React.useState("")
    const [instagram,setInstagram] = React.useState("")
    const [coupon,setCoupon] = React.useState('')
    const [couponValid,setCouponValid] = React.useState(false)
    const [couponUserName,setCouponUserName] = React.useState("")
    const [couponPoints,setCouponPoints] = React.useState(0)
    const [myCouponCode,setMyCouponCode] = React.useState(nanoid(5))

    const [activityModal, setActivityModal] = React.useState(false)
    const [activityCount, setActivityCount] = React.useState(0)

    const [heroSearchText,setHeroSearchText] = React.useState("")

    const [brandCarousel,setBrandCarousel] = React.useState([])



  
    const goToProductFeed = (name, idValue, value) => {
        navigation.navigate("FeedSearch", {varValue : value , id : idValue, value : name } )
    }


    const registerForExpoPushNotificationsAsync= async() => {
        let token;
        
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            ToastAndroid.show('Failed to get push token for push notification!',ToastAndroid.SHORT);
            return;
          }
          try {
            token = await Notifications.getExpoPushTokenAsync({
              experienceId : '@kandurisv/candidapp'
            })
          }
          catch(e) {
          //  console.log(e)
          }
           } 
        else {
          alert('Must use physical device for Push Notifications');
        }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      
      return token.data;
    }
    
    const registerForDevicePushNotificationsAsync = async() => {
      let token;
     
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
       
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }

        token = (await Notifications.getDevicePushTokenAsync()).data;
        
      } else {
        alert('Must use physical device for Push Notifications');
      }
     // console.log("token", token)
      return token;
    }
    

    
    

    React.useEffect(() => {
      const registerNotification = async () => {
        registerForExpoPushNotificationsAsync().then(token => {
        //  console.log("expo token", token)
          setExpoToken(token)
          AsyncStorage.setItem('expoToken', token )
        });
        registerForDevicePushNotificationsAsync().then(token => {
        //  console.log("device token", token)
          setDeviceToken(token)
          AsyncStorage.setItem('deviceToken', token )
        });
    }
        registerNotification()
        firebase.auth().onAuthStateChanged(user => {
            if (user != null) {
                const getData =  () => {
                    axios.get(URL + "/user/info", {params:{user_id : user.phoneNumber.slice(1,13) }} , {timeout:5000})
                    .then(res => res.data).then(async (responseData) => {
             //           console.log("HOME USER RESPONSE",responseData)
                        setUserResponse(responseData[0])
                        setInfoLoading(false)
                        if(responseData.length && responseData[0].username) {
                            setUserDetailsAvailable(true)
                            await AsyncStorage.setItem('isLogin', "TRUE")
                            await AsyncStorage.setItem('phoneNumber', user.phoneNumber)
                            await AsyncStorage.setItem('userName', responseData[0].username )
                        }
                        else {
                          navigation.navigate("NewUserOnboarding",{user_id : user.phoneNumber.slice(1,13)})
                        }
                        setRefresh(false)
                    })
                    .catch(function(error) {
                        setInfoLoading(false)
                    //    console.log(error)
                        setError(true)
                    });
                axios.get(URL + "/home", {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                  //  console.log(responseData)
                    setResponse(responseData)
                    setHomeLoading(false)
                    setResult(true)
                })
                .catch(function(error) {
                    setInfoLoading(false)
                    setHomeLoading(false)
                    setResult(true)
                    setError(true)
                });
                axios.get(URL + "/home/hero", {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                  //  console.log(responseData)
                    setHeroImage(responseData[0].image)
                    setHeroLink(responseData[0].clickable_link)
                    setHeroLinkExists(responseData[0].clickable)
                })
                .catch(function(error) {   });
                axios.get(URL + "/notifications/newcount",{params:{user_id : user.phoneNumber.slice(1,13) }} , {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                  //  console.log(responseData)
                    setActivityCount(responseData[0].new_notification_indicator)
                })
                .catch(function(error) {
                  
                });
            }

            

            getData()
           
            } else {
                navigation.navigate("Auth")
            }
        })

 




},[result])


const heroBannerClick = (link) => {
//  console.log(link)
  if(link.slice(0,4) == "http") {
    WebBrowser.openBrowserAsync(link);
  }
  
  };



return (
    <View style = {home.container}>  
        <StatusBar style="dark" />
        <View style = {[header1.headerView,{backgroundColor : 'white', marginTop:30,}]}>
           
            <TouchableOpacity 
              disabled
              onPress = {()=>navigation.openDrawer()}
              style = {{ justifyContent : 'center' , alignItems : 'center' , marginLeft : 10 , marginRight : 5 , borderColor : theme, borderWidth : 1, borderRadius : 30}}>
                { userResponse  && userResponse.profile_image && userResponse.profile_image != "None" && userResponse.profile_image != "" ?
                        <Image source = {{uri : userResponse.profile_image + "?" + new Date()}} style = {{width : 30, height : 30 , borderRadius : 30 , }}/> :
                        userResponse && userResponse.username ? 
                                <Avatar.Image 
                                source={{
                                uri: 'https://ui-avatars.com/api/?rounded=true&name='+ userResponse.username.replace(' ','+') + '&size=512&background=D7354A&color=fff&bold=true'
                                }} size={30}/> :
                                <Avatar.Image 
                                source={{
                                uri: 'https://ui-avatars.com/api/?rounded=true&size=512&background=D7354A&color=fff&bold=true'
                                }} size={30}/>}
                    </TouchableOpacity>
            <View style = {{flex : 1 , justifyContent : 'center', alignItems : 'center', backgroundColor : 'white' ,marginRight : 30  }}>
              <Image style={{height : 40 , width : 40 }}
                          source={require('../assets/LogoTransparentSolidColorLine.png')}
              />          
            </View>
            
            <View style = {{flexDirection : 'row', marginRight : 15}}></View>   

           


        </View>




        <ScrollView 
            contentContainerStyle = {home.mainViewScrollableContentContainer}
            style = {home.mainViewScrollableContainer}
            >
              
              {heroImage.length > 0 ?
              <View style = {home.mainViewHeroBannerContainer}>
                
              <Swiper 
                  horizontal
                  loop
                  autoplay
                  autoplayTimeout = {8}
                  activeDotColor = "#DDDDDD"
                  dotColor = {background}
                  dot = {<View style = {{ backgroundColor: "#AAAAAA" , height : 6, width : 6 ,marginBottom  : 0, borderRadius: 20 , marginLeft : 10}} />}
                  activeDot = {<View style = {{ backgroundColor: background , height : 8, width : 8, marginBottom : 0, borderRadius: 20 , marginLeft : 10}} />}
                  showsButtons = {false}
                  style={{justifyContent : 'center', marginLeft : 5 , marginRight : 5,}} 
                  >
               { heroImage.map((item,index)=>{
                    return(
                    <TouchableOpacity 
                    key = {index.toString()}
                    disabled
                    onPress = {()=>heroBannerClick(heroLink[index])} 
                    >
                      <Image 
                      key = {index}
                      source = {{uri:item}} 
                      style = {{width : Dimensions.get('screen').width - 10, height : Dimensions.get('screen').height*0.25 }}/>
                    </TouchableOpacity>  
                      )
                  })}  
              </Swiper>
                
              </View>
              : null }

        

        

        {response.length > 0 && response.map((item,index) =>{
            return (
            <View key = {index.toString()} style = {[home.mainViewCarouselContainer,{marginTop : 0, paddingRight : 0 , elevation:0 , shadowRadius : 2, shadowColor : theme  , backgroundColor : background  }]}>
              {/* <Text style = {[home.mainViewCarouselTitle,{marginTop : 5}]}>{item.header}</Text> */}
              <View style = {home.mainViewCarouselChild}>
                <UpdatedCarousel key = {index.toString()} DATA = {item.data} onClickItem = {goToProductFeed} varValue = {item.var}/>
              </View>
            </View> )
        })}
    </ScrollView> 

      <TouchableOpacity style = {{position : 'absolute', 
      height : Dimensions.get('screen').height,
      width : Dimensions.get('screen').width,
      backgroundColor : 'rgba(52,52,52,0.7)',
      zIndex : 100,
      top : 0,
      left : 0
      }}
      onPress = {()=>navigation.navigate("Home")}
      >
      </TouchableOpacity>
      <View style = {{
        position : 'absolute', 
        backgroundColor : 'white', 
        width : Dimensions.get('screen').width*0.9,
        height : 250,
        borderTopLeftRadius : 20,
        borderTopRightRadius : 20,
        zIndex : 101,
        bottom : 60,
        left : Dimensions.get('screen').width*0.05,
      }}>
        <View style = {{height : 4 , 
          width : Dimensions.get('screen').width * 0.2 , marginLeft : Dimensions.get('screen').width * 0.35,
          marginTop : 10 , justifyContent : 'center', backgroundColor : '#AAA'}}
          onPress = {()=>navigation.navigate("Home")}
         >
           <Pressable onPress = {()=>navigation.navigate("Home")} />
        </View>
        <View style = {{margin : 10 , backgroundColor : 'white', flex : 1, marginBottom : 0}}>
          <TouchableOpacity style = {{flexDirection :  'row-reverse', justifyContent : 'flex-start',
            alignItems : 'center' , padding : 10,marginTop : 20 , borderBottomWidth : 1, borderBottomColor : "#DDD"
          }}
            onPress = {()=>navigation.navigate("StartDiscussion")}
          >
            <MaterialIcons name = 'groups' color = {theme} size = {25} />
            <View style = {{flex : 1 }}>
              <Text style = {{fontWeight : 'bold' , fontSize : 16,marginLeft : 5}}>Start Discussion</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style = {{flexDirection :  'row-reverse' , justifyContent : 'flex-start',
            alignItems : 'center' , padding : 10, marginTop : 20 , borderBottomWidth : 1, borderBottomColor : "#DDD"
          }}
            onPress = {()=>navigation.navigate("WriteReview")}
          >
            <MaterialIcons name = 'notes' color = {neutralTheme} size = {25} />
            <View style = {{flex : 1 }}>
              <Text style = {{fontWeight : 'bold' , fontSize : 16,marginLeft : 5}}>Post Review</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style = {{flexDirection :  'row-reverse', justifyContent : 'flex-start',
            alignItems : 'center' , padding : 10,marginTop : 20 , borderBottomWidth : 1, borderBottomColor : "#DDD"
            }}
            onPress = {()=>navigation.navigate("AddJourney")}>
            <MaterialIcons name = 'directions-transit' color = {lightTheme} size = {25} />
            <View style = {{flex : 1 }}>
              <Text style = {{fontWeight : 'bold' , fontSize : 16,marginLeft : 5}}>Add Journey</Text>
            </View>
          </TouchableOpacity>
          
        </View>
      </View>
  </View>
)}


export default AddPost

