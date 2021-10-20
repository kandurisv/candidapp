
import React,{useEffect} from 'react'
import { View , ScrollView, TouchableOpacity, ToastAndroid, ImageBackground, Dimensions, Image, Alert} from 'react-native'
import {Avatar,Text} from 'react-native-paper';
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { FlatGrid } from 'react-native-super-grid';
import axios from 'axios';
import {URL, LoadingPage, ErrorPage,  background,  borderColor, AuthContext, theme} from './exports'
import {ImageLoader} from 'react-native-image-fallback';
import { useIsFocused, useNavigation , useRoute } from '@react-navigation/native';
import { AntDesign, Entypo } from '@expo/vector-icons';
const {width,height} = Dimensions.get('screen')
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Menu,MenuOptions,MenuOption,MenuTrigger,} from 'react-native-popup-menu';

//import * as Amplitude from 'expo-analytics-amplitude';
import { header , header1, user } from './styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
//Amplitude.initializeAsync("af380775c59ead50c4c02536befef5e5");

const MyReviews = () => {

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


 
    React.useEffect(() => {
     //   console.log("timed " , timed, "Result", result , "Response Data" , userDetails )
     //   console.log(userId, isLoggedIn)
        const getData =  async () => {
            const phoneNumber = await AsyncStorage.getItem("phoneNumber")
     //       console.log(phoneNumber)
            axios.get(URL + "/user/summary", {params:{user_id : phoneNumber.slice(1,13)}} , {timeout : 5})
            .then(res => res.data).then(function(responseData) {
      //      console.log("USER Summary " , responseData)
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
        axios.get(URL + "/user/info", {params:{user_id : phoneNumber.slice(1,13)}} , {timeout : 5000})
            .then(res => res.data).then(function(responseData) {
        console.log("USER DETAILS " , responseData)
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


      const fetchPinsPost = () => {
        axios.get(URL + "/user/items", {params:{user_id : userId.slice(1,13) }} , {timeout : 5})
        .then(res => res.data).then(function(responseData) {
           console.log("Fetch Posts in User", responseData)
            if(responseData.length > 0) {
              setMyPostsEmpty(false)
              setUserPosts(responseData)
            }
            
            
        })
        .catch(function(error) {
            setUserPostsError(true)
        });
    }
      fetchPinsPost()

        
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
                    title="My Reviews"
                    titleStyle = {header.headerText}
                    backgroundColor= {background}
                    leftIconColor = {borderColor}
                    leftIconOnPress={() => navigation.navigate("UserDetails")}
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
                
                   
                   
                    <View style = {user.myPostedReviewsContainer}>
                       
                        {myPostsEmpty ? 
                        <View style = {user.myPostedReviewsEmptyContainer}>
                            <Text style = {user.myPostedReviewsEmptyText}>Please start posting reviews</Text>
                        </View> :
                        <FlatGrid itemDimension={width*0.45} data={userPosts} renderItem={({item}, index) => {
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

                            return(
                                <View>
                                    <TouchableOpacity 
                                        style = {user.myPostedReviewsItemContainer}
                                        onPress = {()=>onMyReviewClick(item,review,context)}    
                                    >
                                        <ImageBackground source = {{uri : item.image_list[0] ? item.image_list[0] : "No Image" }} style = {user.myPostedReviewsItemImageBackground} blurRadius = {2}></ImageBackground>
                                            <View style = {user.myPostedReviewsItemTextView}>
                                                <Text style={user.myPostedReviewsItemText}>{item.product_name}</Text>
                                            </View>
                                    </TouchableOpacity>
                                    <Menu style = {user.updateReviewView}>
                                        <MenuTrigger>
                                            <Entypo name = "dots-three-vertical" size = {20} color = 'white'/>
                                        </MenuTrigger>
                                        <MenuOptions style = {{}}>
                                            <MenuOption onSelect = {()=>editPost(item)}>
                                                <Text>Edit</Text>
                                            </MenuOption>
                                            <MenuOption onSelect = {()=>deletePost(item.review_sum_id)}>
                                                <Text>Delete</Text>
                                            </MenuOption>
                                        </MenuOptions>
                                    </Menu>
                                </View>
                                )}
                            }
                        />}
                    </View>
                </ScrollView>
            </View>
        )
    )
}

export default MyReviews

