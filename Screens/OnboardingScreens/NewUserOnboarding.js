import React , {useState,useEffect , useContext} from 'react'
import { View,Text , Image ,ImageBackground, TouchableOpacity , TextInput , Dimensions , Button, ToastAndroid , ScrollView} from 'react-native'

import { ModernHeader } from "@freakycoder/react-native-header-view";
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';

import axios from 'axios'
import RadioGroup from 'react-native-custom-radio-group';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import { useNavigation , useRoute } from '@react-navigation/native';
import { AuthContext, background, borderColor, theme, uploadImageOnS3, URL , s3URL } from '../exports';
import { editUserDetails, home, user ,header } from '../styles';
import { AntDesign, Entypo, EvilIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Contacts from 'expo-contacts';
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants';


const NewUserOnboarding = () => {

  const navigation = useNavigation()
  const route = useRoute()


  const [selectedItem, setSelectedItem ] = useState(0);
 

    const [date, setDate] = useState(new Date())
    const [image, setImage] = React.useState(route.params?.image ? route.params?.image  : "");
    const [gender, setGender] = useState(route.params?.gender ? route.params?.gender  : "")
    const [instagram, setInstagram] = useState(route.params?.instagram ? route.params?.instagram  :"")
    const [imageUrl,setImageUrl] = useState("")
    const [profileImageChange,setProfileImageChange] = useState(false)
    const [coverImageChange,setCoverImageChange] = useState(false)
    const [age,setAge] = useState("")
    const [userName,setUserName] = React.useState(route.params?.username ? route.params?.username  : "")
    const [userId, userDetails, isLoggedIn] = React.useContext(AuthContext)
    const [user_id,setuser_id] = React.useState(route.params.user_id)
    const [userInfo,setUserInfo] = React.useState([])
    const [submitted,setSubmitted] = React.useState(false)

    const [userDob,setUserDob] = useState(route.params?.dob ? route.params?.dob  :"")
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [expoToken,setExpoToken] = React.useState("")
    const [deviceToken,setDeviceToken] = React.useState("")

   
    const [variable,setVariable] = React.useState(route.params?.variable ?  route.params?.variable : "new user")
    
    const showDatePicker = () => {setDatePickerVisibility(true);};
    const hideDatePicker = () => {setDatePickerVisibility(false);};
    const handleConfirm = (date) => {
        setUserDob(moment(date).format("YYYY-MM-DD"))
        hideDatePicker();
    };


    const [contactsAlreadyExist,setContactsAlreadyExist] = React.useState(true)

    
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
  

  
  


    useEffect(() => {
      const registerNotification = async () => {
        registerForExpoPushNotificationsAsync().then(token => {
          console.log("expo token", token)
          setExpoToken(token)
          AsyncStorage.setItem('expoToken', token )
        });
        registerForDevicePushNotificationsAsync().then(token => {
          console.log("device token", token)
          setDeviceToken(token)
          AsyncStorage.setItem('deviceToken', token )
        });
    }
        registerNotification()


    //  console.log("USER DETAILS USE EFFECT" , route.params.userDetails)
       const getUserInfo = () => {
        axios.get(URL + "/user/info", {params:{user_id : user_id }} , {timeout:5000})
        .then(res => res.data).then(function(responseData) {
        //    console.log("USER INFO",responseData)
            setUserInfo(responseData)
           
        })
        .catch(function(error) {
            //
        });
       }
       getUserInfo()
       
       const contactsUpdateReq = () => {
        axios.get(URL + "/contacts/ifexists", {params:{user_id : user_id }} , {timeout:5000})
        .then(res => res.data).then(function(responseData) {
        //    console.log("USER INFO",responseData)
           if(!responseData.length) {
             console.log("Data doesnt exist . New Update. Hence New API")
             setContactsAlreadyExist(false)
           }
           else {
            if(moment(responseData[0].created_at,"YYYY-MM-DD hh:mm:ss").add(1,'months').isBefore(moment())) {
              console.log("data exists but More than a month difference , hence renew API")
            }
           }
        })
        .catch(function(error) {
            //
        });
       }




    }, [])



    const next = () => {
      setSubmitted(true)
      navigation.navigate("SkinOnboarding",{var : variable, userName : userName, gender : gender, instagram : instagram, userDob : userDob, userProfileImage : image ? s3URL + user_id + "/profile" : "" , expoToken : expoToken, deviceToken : deviceToken})


    }


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
      
        if (!result.cancelled) {
       //   console.log(result.uri)
          setImage(result.uri);
          setProfileImageChange(true)
       //   console.log("I am reaching here")
          uploadImageOnS3(user_id.slice(1,13) + "/profile",result.uri)

          const body = {
            "var" : "edit user",
            "user_id": user_id,
            "username": userName,
            "gender": gender,
            "dob": userDob,
            "email": "",
            "phone_number": userId,
            "location": "",
            "profile_image" : s3URL + user_id.slice(1,13) + "/profile"
          }
    
        //  console.log(body)
    
        axios({
          method: 'post',
          url: URL + '/user/info',
          data: body
        })
      .then(res => {
          // Do Nothing
        }).catch((e) => console.log(e))
    

        }
      };   
      
      const pickCoverImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [16, 9],
          quality: 1,
        });
    
      //  console.log(result);
    
        if (!result.cancelled) {
      //    console.log(result.uri)
          setCoverImage(result.uri);
          setCoverImageChange(true)
          uploadImageOnS3(user_id + "/cover",result.uri)
          const body = {
            "var" : "edit user",
            "user_id": user_id,
            "username": userName,
            "gender": gender,
            "dob": userDob,
            "email": "",
            "phone_number": userId,
            "location": "",
            "cover_image" : s3URL + user_id + "/cover"
          }
    
          console.log(body)
    
        axios({
          method: 'post',
          url: URL + '/user/info',
          data: body
        })
        .then(res => {
        //  console.log(res)
        }).catch((e) => console.log(e))
    
        }
      }; 

     


    const pickCoverPhoto = () => {
    //  console.log("image picker")
      pickCoverImage()
    }
    const pickProfilePhoto = () => {
    //  console.log("image picker")
      pickImage()
    }

    
    return (
        <ScrollView 
          contentContainerStyle = {user.mainViewContentContainer}
          style = {user.mainViewContainer} >
          <View style = {header.headerView}>
            <ModernHeader 
              title="My Info"
              titleStyle = {header.headerText}
              backgroundColor= {background}
              leftDisable
              rightDisable
            />
          </View>

          <View style = {{}}>
            <View style = {user.editUserDetailsDisplayContainer}>
              <TouchableOpacity style = {user.editUserDetailsDisplayImageButton} onPress = {pickProfilePhoto}>
                <ImageBackground source = {image && image != "None"? {uri : image } : {uri : 'https://ui-avatars.com/api/?rounded=true&name&size=512'}} 
                        style = {user.editUserDetailsDisplayImage} >
                </ImageBackground>
                <View style = {{position: 'absolute' , backgroundColor : 'white' , padding : 3, borderRadius : 20 , bottom : 0 , right : 0 , margin : 15 , zIndex : 150}}>
                  <Entypo name = "edit" size = {10} color = 'black' />
                </View>
              </TouchableOpacity>
            </View>
            
            {!image ? 
            <View style = {{justifyContent : 'center' , alignItems : 'center'}}><Text>Pick a profile image</Text></View>
            : null
            }
            

            <View style = {user.editUserDetailsInputContainer}>
              <Text style = {user.editUserProfileHeader}>Profile Info</Text>
              <View style = {user.editUserDetailsElementContainer}>
                <Text style = {user.editUserDetailsElementText}>UserName *</Text>
                <TextInput 
                        placeholder = {userName ? userName : "username"}
                        style = {user.editUserDetailsElementTextInput}
                        onChangeText = {(text)=>setUserName(text)}
                        value = {userName}
                />
              </View>
              <View style = {user.editUserDetailsElementContainer}>
                <Text style = {user.editUserDetailsElementText}>Instagram(@)</Text>
                <TextInput 
                        placeholder = {instagram ? instagram : "username"}
                        style = {user.editUserDetailsElementTextInput}
                        onChangeText = {(text)=>setInstagram(text)}
                        value = {instagram}
                />
              </View>

              <View style = {user.editUserDetailsElementContainer}>
                <Text style = {user.editUserDetailsElementText}>Birthday</Text>
                <View style = {{flexDirection : 'row'}}>
                  <Text style = {[user.editUserDetailsElementTextInput,{flex : 1}]}> 
                      { userDob && userDob != "0000-00-00" ? userDob.replace('"','').substring(0,10) : ""} 
                  </Text>
                  <TouchableOpacity style = {user.datepicker} onPress={showDatePicker}>
                      <EvilIcons name = "calendar" size = {24} color = {theme}/>
                  </TouchableOpacity>  
                  <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                  />
                </View>
              </View>
              <View style = {user.editUserDetailsElementContainer}>
                <Text style = {user.editUserDetailsElementText}>Gender</Text>
                <View style = {{flexDirection : 'row'}}>
                  <Text style = {[user.editUserDetailsElementTextInput,{flex : 1}]}> 
                      { gender && gender != "NA" ? gender : ""} 
                  </Text>
                  <Picker
                    selectedValue={gender}
                    style={{ height: 30, width: 40 }}
                    onValueChange={(value) => setGender(value)}
                    dropdownIconColor = {theme}
                    itemStyle = {{fontSize : 12, color : theme}}
                  >
                    
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Others" value="Others" />
                    <Picker.Item label="Prefer not to say" value="Prefer Not to say" />
                  </Picker>
                </View> 
              </View>
              <View style = {{ marginTop : 30, width : Dimensions.get('screen').width*0.9,
                 alignItems:'flex-end'}}>
                <TouchableOpacity 
                        onPress = {next}
                        disabled = {userName == ""}
                        style = {{
                          backgroundColor : userName == "" ? "#888" :theme , width : 40, height : 40 , borderRadius : 50, 
                        flex : 1, justifyContent : 'center' , alignItems : 'center'}}>
                    <MaterialIcons name = "navigate-next" size= {40} color = "white" />
                </TouchableOpacity>
              </View>                  
            </View>
          </View>
          </ScrollView>
    )
}

export default NewUserOnboarding
