
import React,{useEffect} from 'react'
import { View , ScrollView, TouchableOpacity, ToastAndroid, ImageBackground, Dimensions, Image, Alert} from 'react-native'
import {Avatar,Text} from 'react-native-paper';
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { FlatGrid } from 'react-native-super-grid';
import axios from 'axios';
import {URL, LoadingPage, ErrorPage,  background,  borderColor, AuthContext, theme, lightTheme, contrastLightTheme, neutralTheme, contrastTheme} from './exports'
import {ImageLoader} from 'react-native-image-fallback';
import { useIsFocused, useNavigation , useRoute } from '@react-navigation/native';
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
const {width,height} = Dimensions.get('screen')
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Menu,MenuOptions,MenuOption,MenuTrigger,} from 'react-native-popup-menu';
import moment from 'moment'
//import * as Amplitude from 'expo-analytics-amplitude';
import { header , header1, user } from './styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
//Amplitude.initializeAsync("af380775c59ead50c4c02536befef5e5");

const UserDetails = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const focus = useIsFocused()

    const [userId,isLoggedIn] = React.useContext(AuthContext)
    const [firstLoad,setFirstLoad] = React.useState(false)

    const [userDetails, setUserDetails] = React.useState([])
    const [userInfo,setUserInfo] = React.useState([])
    const [loading,setLoading] = React.useState(true)
    const [timed,setTimed] = React.useState(false)
    const [error,setError] = React.useState(false)
    const [secs,setSecs] = React.useState(0)
    const [refresh,setRefresh] = React.useState(false)
    const [result,setResult] = React.useState(false)
    const [myPostsEmpty,setMyPostsEmpty] = React.useState(true)
    const [userPosts,setUserPosts]= React.useState([])
    const [userPostsError,setUserPostsError] = React.useState(false)
    const [discussionFeedData,setDiscussionFeedData] = React.useState([])


 
    React.useEffect(() => {
     //   console.log("timed " , timed, "Result", result , "Response Data" , userDetails )
     //   console.log(userId, isLoggedIn)
        const getData =  async () => {
            const phoneNumber = await AsyncStorage.getItem("phoneNumber")
     //       console.log(phoneNumber)
            axios.get(URL + "/user/summary", {params:{user_id : phoneNumber.slice(1,13)}} , {timeout : 5})
            .then(res => res.data).then(function(responseData) {
            console.log("USER DETAILS " , responseData)
      //      console.log("REached to response")
      
            setUserDetails(responseData)
            setFirstLoad(true)
            setLoading(false)
            setResult(true)
      //      console.log(responseData)
        })
        .catch(function(error) {
      //      console.log("REached to error")
      //      console.log(error)
            setLoading(false)
            setResult(true)
            setError(true)
        });
    }

      getData()


      const getUserInfo =  async () => {
        const phoneNumber = await AsyncStorage.getItem("phoneNumber")
 //       console.log(phoneNumber)
        axios.get(URL + "/user/info", {params:{user_id : userId.slice(1,13)}} , {timeout : 5000})
            .then(res => res.data).then(function(responseData) {
        console.log("USER INFO " , responseData)
  //      console.log("REached to response")
  
        setUserInfo(responseData)
        setLoading(false)
        setResult(true)
  //      console.log(responseData)
    })
    .catch(function(error) {
  //      console.log("REached to error")
  //      console.log(error)
        setLoading(false)
        setResult(true)
        setError(true)
    });
}

        getUserInfo()


      const fetchJourney = () => {
        axios.get(URL + "/userinfo/journey", {params:{user_id : userId.slice(1,13) }} , {timeout : 5000})
        .then(res => res.data).then(function(responseData) {
           console.log("Fetch Journey in User", responseData)
            if(responseData.length > 0) {
              setMyPostsEmpty(false)
              setUserPosts(responseData)
            }
            
            
        })
        .catch(function(error) {
            setUserPostsError(true)
        });
    }
    fetchJourney()

    const getDiscussionFeed = () => {
        axios.get(URL + "/userinfo/discussion", {
            params: {
              user_id : userId.slice(1,13)
            }
          }, {timeout : 5000})
        .then(res => res.data)
        .then(function (responseData) {
            console.log(responseData)
        //    console.log(error)
            setDiscussionFeedData(responseData)
            setLoading(false)
            // setFirstLoaded(true)
        })
        .catch(function (e) {
          console.log("error: ",e);
          setError(true);      
        })
      }
      getDiscussionFeed()


        
    },[result, focus , refresh]);
    

    const onEdit = () => {
     //   console.log("EditProfile")
        navigation.navigate("EditUserProfile", {userDetails : userDetails[0] , userInfo : userInfo[0]})
    }

    const onReferralPress = () => {
  //      Clipboard.setString(userDetails[0].existing_referral_code)
  //      ToastAndroid.show("Referral Code copied to clipboard", ToastAndroid.SHORT)
    }

    const onMyReviewClick = (item,review,context) => {
        navigation.navigate("UserPostDetails", {details : item , reviewDetails : review , contextDetails : context})
    }

    const deletePost = (review_sum_id) => {
        console.log(review_sum_id)
        Alert.alert(
            "Delete Review !!",
            "Do you want to delete this review permanently ?",
            [
                {
                    text: "No",
                    onPress: () => ToastAndroid.show("You can edit the post instead", ToastAndroid.SHORT),
                    style: "cancel"
                },
                { 
                    text: "OK", 
                    onPress: () => {
                        axios.get(URL + "/post/delete", {params:{review_sum_id : review_sum_id }} , {timeout:5000})
                        .then(res => {
                            if(res == null) {
                                ToastAndroid.show("Review delete succesfully !!", ToastAndroid.SHORT)
                            }
                            else {
                                console.log("RES",res)
                            }
                            setRefresh((!refresh))
                        })
                        .catch(function(error) {
                            ToastAndroid.show("Error deleting review. Please try later", ToastAndroid.SHORT)
                        });
                    }
                }
            ]
        );
    }

    const editPost = (item) => {
     //   console.log("Item", item)
        navigation.navigate("UpdatePost", {item : item})
    }

    return (   
        error ? (<ErrorPage />) :
        loading ? (<LoadingPage />) :
        (
            <View style = {[user.container,{marginBottom : 10}]}>
                <View style = {header.headerView}>
                    <ModernHeader
                    title="User Details"
                    height = {50}
                    titleStyle = {header.headerText}
                    backgroundColor= {background}
                    leftIconColor = {borderColor}
                    leftIconOnPress={() => navigation.goBack()}
                   
                    rightDisable
                    />
                </View>   
                <ScrollView 
                contentContainerStyle = {user.mainViewContentContainer}
                style = {user.mainViewContainer}>
                    {/* {userInfo.length && userInfo[0].cover_image ?
                    <View style = {user.mainViewCoverContainer}>
                     <ImageLoader 
                        source = {userInfo[0].cover_image + "?" + new Date()} 
                        style = {{width : width, height : 180 }}
                        fallback = {require("../assets/defaultCover.png")}
                        />
                    </View> : null
                    } */}
                    <View style = {{flexDirection : 'row'}}>
                    <View style = {user.mainViewDisplayContainer}>
                        {  userInfo[0] && userInfo[0].profile_image && userInfo[0].profile_image != "None" && userInfo[0].profile_image != "" ?
                        <Image source = {{uri : userInfo[0].profile_image + "?" + new Date()}} style = {{width : 100, height : 100 , borderRadius : 50 , }}/> :
                        userInfo.length && userInfo[0].username ? 
                                <Avatar.Image 
                                source={{
                                uri: 'https://ui-avatars.com/api/?rounded=true&name='+ userInfo[0].username.replace(' ','+') + '&size=512'
                                }} size={80}/> :
                                <Avatar.Image 
                                source={{
                                uri: 'https://ui-avatars.com/api/?rounded=true&background=random&size=512'
                                }} size={80}/>}
                    </View>
                    <View style = {user.mainViewDetailsContainer}>
                   
                        <View style = {user.mainViewDetailsUserNameContainer}>
                        {userInfo.length && userInfo[0].username ? 
                            <Text style={user.mainViewDetailsUserNameText} >{userInfo[0].username}</Text> : null }
                        </View> 
                        <View style = {user.mainViewDetailsSummaryContainer}>
                        <View style = {user.mainViewDetailsSummaryButtonContainer}>
                            <Text style={user.mainViewDetailsSummaryValue}>{ discussionFeedData && discussionFeedData.length ? discussionFeedData.length : 0}</Text>
                            <Text style={user.mainViewDetailsSummaryName}>Discussions</Text>
                        </View>
                        <View style = {user.mainViewDetailsSummaryButtonContainer}>
                            <Text style={user.mainViewDetailsSummaryValue}>{userDetails.length && userDetails[0].number_of_reviews ? userDetails[0].number_of_reviews : 0}</Text>
                            <Text style={user.mainViewDetailsSummaryName}>Reviews</Text>
                        </View>
                        <View style = {user.mainViewDetailsSummaryButtonContainer}>
                            <Text style={user.mainViewDetailsSummaryValue}>{userDetails.length && userDetails[0].number_of_upvotes ?  userDetails[0].number_of_upvotes : 0}</Text>
                            <Text style={user.mainViewDetailsSummaryName}>Likes</Text>
                        </View>   
                        </View>   
                    </View>
                    </View>
                    
                    <TouchableOpacity style = {user.mainViewEditProfileButton} onPress={onEdit}>
                        <Text style = {user.mainViewEditProfileText}> Edit Profile </Text>
                    </TouchableOpacity>
                    <View style = {user.listContainer}>
                        
                        <TouchableOpacity style = {user.listOptionButton}
                        onPress = {()=>navigation.navigate("MyDiscussions" , {body : discussionFeedData})}
                        >
                            <MaterialIcons name = 'groups' color = {theme} size = {20} />
                            <View style = {user.listOptionButtonTextView}>
                                <Text style = {[user.listOptionButtonText,{
                                    color : discussionFeedData && discussionFeedData.length ? borderColor : "#666"
                                }]}>My Discussion</Text>
                                <Text style = {[user.listOptionButtonText,{
                                    color : discussionFeedData && discussionFeedData.length ? borderColor : "#666"
                                }]}>{discussionFeedData && discussionFeedData.length ? discussionFeedData.length : 0} Items</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style = {user.listOptionButton}
                        disabled = {userDetails.length && userDetails[0].number_of_reviews ? false : true}
                        onPress = {()=>navigation.navigate("MyReviews")}
                        >
                            <MaterialIcons name = 'notes' color = {neutralTheme} size = {20} />
                            <View style = {user.listOptionButtonTextView}>
                                <Text style = {[user.listOptionButtonText,{
                                    color : userDetails.length && userDetails[0].number_of_reviews ? borderColor : "#666"
                                }]}>My Reviews</Text>
                                <Text style = {[user.listOptionButtonText,{
                                     color : userDetails.length && userDetails[0].number_of_reviews ? borderColor : "#666"
                                }]}>{userDetails.length && userDetails[0].number_of_reviews ? userDetails[0].number_of_reviews : 0} Items</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style = {[user.listOptionButton,{borderBottomWidth : 0}]}
                        onPress = {()=>navigation.navigate("MyJourneys")}
                        >
                            <MaterialIcons name = 'directions-transit' color = {lightTheme} size = {20} />
                            <View style = {user.listOptionButtonTextView}>
                                <Text style = {[user.listOptionButtonText,{fontWeight : 'bold', color : contrastTheme}]}>My Journeys</Text>
                            </View>
                        </TouchableOpacity>
                        <View style = {{marginLeft : 40}}>
                            {userPosts.length ? 
                            userPosts.map((item,index)=>{
                                return(
                                <TouchableOpacity 
                                key = {index.toString()}
                                style = {{ marginTop : 5, padding : 5, borderBottomWidth : 1 , borderBottomColor : '#EEE'}}
                                onPress = {()=>navigation.navigate("JourneyDetails", {item : item} )}
                                >
                                <View style = {{flexDirection : 'row', justifyContent : 'space-between'}}>
                                    <Text style = {[user.listOptionButtonText,{fontStyle : 'normal'}]}>{item.journey_title}</Text>
                                    <Text style = {{fontStyle : 'italic', fontSize : 12}}>{moment(item.last_updated,"YYYY-MM-DD hh:mm:ss").add(5,'hours').add(30, 'minutes').fromNow()}</Text>
                                </View>
                                </TouchableOpacity>
                                )
                            })
                        : null 
                        }
                            
                        </View>
                        
                    </View>
                </ScrollView>
            </View>
        )
    )
}

export default UserDetails

