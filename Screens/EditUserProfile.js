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
import { AuthContext, background, borderColor, theme, uploadImageOnS3, URL , s3URL } from './exports';
import { editUserDetails, home, user ,header } from './styles';
import { AntDesign, Entypo, EvilIcons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const EditUserProfile = () => {

  const navigation = useNavigation()
  const route = useRoute()

  const radioGroupList = [{
    label: 'Male',
    value: 'Male'
  }, {
    label: 'Female',
    value: 'Female'
  }, {
    label: 'Others',
    value: 'Others'
  }];

  const [selectedItem, setSelectedItem ] = useState(0);


    const [date, setDate] = useState(new Date())
    const [image, setImage] = useState(route?.params?.userInfo.profile_image ? route.params.userInfo.profile_image : "");
    const [coverImage,setCoverImage] = useState(route?.params?.userInfo.cover_image ? route.params.userInfo.cover_image : "")
    const [gender, setGender] = useState(route?.params?.userInfo.gender ? route.params.userInfo.gender : "")
    const [instagram, setInstagram] = useState(route?.params?.userInfo.instagram_username ? route.params.userInfo.instagram_username : "")
    const [imageUrl,setImageUrl] = useState("")
    const [profileImageChange,setProfileImageChange] = useState(false)
    const [coverImageChange,setCoverImageChange] = useState(false)
    const [age,setAge] = useState("")
    const [userName,setUserName] = React.useState(route.params.userInfo.username)
    const [userId, userDetails, isLoggedIn] = React.useContext(AuthContext)
    const [user_id,setuser_id] = React.useState(route.params.userInfo.user_id)
    const [userInfo,setUserInfo] = React.useState([])
    const [submitted,setSubmitted] = React.useState(false)

    const [userDob,setUserDob] = useState(route?.params?.userInfo.dob ? route.params.userInfo.dob :"")
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [expoToken, setExpoToken] = useState(route?.params?.userInfo.expo_token ? route.params.userInfo.expo_token : "")
    const [deviceToken, setDeviceToken] = useState(route?.params?.userInfo.device_token ? route.params.userInfo.device_token : "")
    
    
    const showDatePicker = () => {setDatePickerVisibility(true);};
    const hideDatePicker = () => {setDatePickerVisibility(false);};
    const handleConfirm = (date) => {
        setUserDob(moment(date).format("YYYY-MM-DD"))
        hideDatePicker();
    };


    useEffect(() => {
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
       
    }, [])



    const submit = () => {
      setSubmitted(true)
     
      const body = {
        "var" : "edit user",
        "user_id": user_id,
        "username": userName,
        "gender": gender,
        "dob": userDob,
        "email": "",
        "phone_number": userId,
        "location": "",
        "expo_token" : expoToken,
        "device_token" : deviceToken,
        "instagram_username" : instagram
        
      }

      console.log(body)

    axios({
      method: 'post',
      url: URL + '/user/info',
      data: body
    })
  .then(res => {
      ToastAndroid.show("Thanks for updating your details", ToastAndroid.SHORT)
      setTimeout(function(){
        navigation.navigate("UserDetails")
      }, 500);
    }).catch((e) => {
      ToastAndroid.show("Error updating details. Please try later")
      setSubmitted(false)
    })

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
          uploadImageOnS3(user_id + "/profile",result.uri)

          const body = {
            "var" : "edit user",
            "user_id": user_id,
            "username": userName,
            "gender": gender,
            "dob": userDob,
            "email": "",
            "phone_number": userId,
            "location": "",
            "profile_image" : s3URL + user_id + "/profile"
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
              title="Details"
              titleStyle = {header.headerText}
              backgroundColor= {background}
              leftIconColor = {borderColor}
              leftIconOnPress={() => navigation.goBack()}
              rightIconComponent = {<AntDesign name = "logout" size = {20} color = "black"/>}
              rightIconOnPress = {()=> {
                  Amplitude.logEventAsync('SIGNOUT_FROM_USER')
                  navigation.navigate("Signout")
                  }
              }
            />
          </View>

          <View style = {{}}>
            <View style = {user.editUserDetailsDisplayContainer}>
              <TouchableOpacity style = {user.editUserDetailsDisplayImageButton} onPress = {pickProfilePhoto}>
                <ImageBackground source = {image && image != "None"? {uri : image + "?" + new Date()} : {uri : 'https://ui-avatars.com/api/?rounded=true&name='+ userName.replace(' ','+') + '&size=512'}} 
                        style = {user.editUserDetailsDisplayImage} >
                </ImageBackground>
                <View style = {{position: 'absolute' , backgroundColor : 'white' , padding : 3, borderRadius : 20 , bottom : 0 , right : 0 , margin : 15 , zIndex : 150}}>
                  <Entypo name = "edit" size = {10} color = 'black' />
                </View>
              </TouchableOpacity>
            </View>
            
            

            <View style = {user.editUserDetailsInputContainer}>
              <Text style = {user.editUserProfileHeader}>Profile Info</Text>
              <View style = {user.editUserDetailsElementContainer}>
                <Text style = {user.editUserDetailsElementText}>UserName</Text>
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
              <View style = {user.editUserDetailsSubmitContainer}>
                <TouchableOpacity 
                        onPress = {submit}
                        disabled = {submitted}
                        style = {user.editUserDetailsSubmitButton}>
                  <Text style = {user.editUserDetailsSubmitText}>Submit</Text>
                </TouchableOpacity>
              </View>                  
            </View>
          </View>
          </ScrollView>
    )
}

export default EditUserProfile
