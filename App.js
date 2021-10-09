import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import {View} from 'react-native'
import axios from 'axios'
import * as firebase from "firebase";
import {URL , AuthProvider , firebaseConfig, LoadingPage} from './Screens/exports'
import Navigator from './Screens/Navigator'
import { MenuProvider } from 'react-native-popup-menu';
import * as Linking from 'expo-linking';

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  // ignore app already initialized error in snack
}

const prefix = Linking.createURL('/')

const config = {
  screens: {
    HomeDrawer: {
      screens: {
        PostLink: 'post',
      },
    }
  }
}


const App = ()  => {


  const linking = {
    prefixes: ['https://www.getcandid.app/', 'exp://192.168.109.113:19000/', 'https://*.getcandid.app'], 
    config
  }

  const [userId,setUserId] = React.useState("")
  const [userDetails,setUserDetails] = React.useState({})
  const [isLoggedIn,setLoggedIn] = React.useState(false)

  const [isLoading,setLoading] = React.useState(true)
  const [timed,setTimed] = React.useState(false)
  const [responseData,setResponseData] = React.useState({})
  const [error,setError] = React.useState(false)
  const [secs,setSecs] = React.useState(0)
  const [refresh,setRefresh] = React.useState(false)
  const [loadingTimeWait,setLoadingTimeWait] = React.useState(false)


  const [fontLoaded,setFontLoaded] = React.useState(false)

  React.useEffect( () => {
       
    const getData = async () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user != null) {
        //  console.log("fireabase",user)
          
          setLoggedIn(true)
          setUserId(user.phoneNumber)
        //  Amplitude.setUserIdAsync(user.phoneNumber)
        //  Amplitude.logEventWithPropertiesAsync('USER_VISIT', {"userPhoneNumber": user.phoneNumber})
        //  console.log('App User!' , user.phoneNumber);

          axios.get(URL + "/user/info", {params:{user_id : user.phoneNumber.slice(1,13) }} , {timeout:5000})
            .then(res => res.data)
            .then(function(responseData) {
              setLoadingTimeWait(true)
              setUserDetails(responseData[0])
            })
            .catch(function(error) {
              console.log(error)
              setLoadingTimeWait(true)
            });
        }  
        else {
          setLoadingTimeWait(true)
        }
      
      }
      
      )
      setLoading(false)
    }
   
    getData()
     
//    console.log("loading ", isLoading)
    
},[isLoading]);


return (
  <View style = {{flex : 1}}>
  {isLoading ? 
  <View style = {{flex:1 , justifyContent : 'center', alignItems : 'center', marginTop : 50}}>
    <LoadingPage /> 
  </View> : 
  loadingTimeWait ?
  (
    <MenuProvider>
      <AuthProvider value = {[userId , userDetails, isLoggedIn]}>
        <NavigationContainer linking={linking} fallback={<LoadingPage />}>
            <Navigator />
        </NavigationContainer>
      </AuthProvider>
  </MenuProvider>
  ) : (
    <View style = {{flex:1 , justifyContent : 'center', alignItems : 'center' , marginTop : 50}}>
        <LoadingPage />
    </View>
  )
  
  }
</View>
)
}

export default App


