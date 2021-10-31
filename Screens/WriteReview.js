import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, FlatList,ScrollView, Dimensions, ToastAndroid } from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header, addPost, user } from './styles';
import { useNavigation } from '@react-navigation/native';
import { AuthContext, background,borderColor,s3URL,theme,uploadImageOnS3, URL } from './exports';
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { removeNotificationSubscription } from 'expo-notifications';
import Modal from 'react-native-modal';
import axios from 'axios'
import moment from 'moment'
import { nanoid , customAlphabet  } from 'nanoid'
import { TouchableHighlight } from 'react-native-gesture-handler';


const TagsView = ({data}) => {

    React.useEffect(() =>{
        console.log("Data", data)
    },[])

    return(
    <View style = {{flexDirection : 'row', flexWrap : 'wrap', flex:1 }}>
        {data.map((item,index)=>{
            return(
            <TouchableOpacity 
                key={index}
                style = {{flexDirection : 'row', alignItems : 'center', marginVertical : 5, marginRight : 5, borderRadius : 20 ,paddingHorizontal : 10, paddingVertical : 5, backgroundColor : '#EEE',}}
                onPress = {()=>console.log("clicked on tag")}>
                <Text style = {{marginRight : 5 }}>{item}</Text>
                <AntDesign name = "closecircleo" color = {theme} size = {10} />
            </TouchableOpacity>)
        })}
    </View>
)}




const WriteReview = () => {
    const navigation = useNavigation()
    const [isOpen,setIsOpen] = React.useState(false)
    const [image,setImage] = React.useState("")
    const [tagsData,setTagsData] = React.useState([])
    const [inputFocus,setInputFocus] = React.useState(false)
    const [searchText,setSearchText] = React.useState("")

    const [category,setCategory] = React.useState("")
    const [positiveReview,setPositiveReview] = React.useState("")
    const [negativeReview, setNegativeReview] = React.useState("")

    const [modalVisible,setModalVisible] = React.useState(false)
    const [userId,userDetails, isLoggedIn] = React.useContext(AuthContext)

    const [searchLoading,setSearchLoading] = React.useState(false)
    const [searchArray,setSearchArray] = React.useState([])
    const [submitted,setSubmitted] = React.useState(false)

    const [tempTitle,setTempTitle] = React.useState("")

    const [imageLinkName,setImageLinkName] = React.useState(customAlphabet('123456789', 10))

    const [productAdded,setProductAdded] = React.useState(false)
    const [productName,setProductName] = React.useState("")

    const [userName,setUserName] = React.useState("")
    const [userImage,setUserImage] = React.useState("")
  

    React.useEffect(()=>{
        const fetchUser = async () => {
            axios.get(URL + "/user/info" , {params : {user_id : userId.slice(1,13)}}, {timeout : 5000})
            .then(res => res.data).then(function(responseData) {      
                setUserName(responseData[0].username)
                setUserImage(responseData[0].profile_image)
            })
            .catch(function(error) {
                setUserName("Error getting name")
                });
            }
        
        fetchUser()
    },[])

    
    const share = async (name) => {
        //Amplitude.logEventWithPropertiesAsync('REFERRAL', {userId : userId})
        try {
            const result = await Share.share({
              message: "Checkout my review of " + name + "product on Candid app. Sign up here to know more - https://play.google.com/store/apps/details?id=com.candid.app"
            });
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
             //     console.log(result.activityType)
                } 
              else {
            //  console.log(result)
            }
            } 
            else if (result.action === Share.dismissedAction) {
            //    console.log(result)
            }
          } catch (error) {
            alert(error.message);
          }
    }
    


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
    
    
        if (!result.cancelled) {
          setImage(s3URL + userId.slice(1,13) + "/review/" + imageLinkName);
          uploadImageOnS3(userId.slice(1,13) + "/review/" + imageLinkName,result.uri)
    
         }
      }; 

     

    const search = (text) => {
        setSearchText(text)
        setSearchLoading(true)
        
        axios.get(URL + "/search/product", {params:{str2Match : text }} , {timeout : 3000})
          .then(res => res.data).then(function(responseData) {
              console.log("SearchArray",responseData)
              setSearchLoading(false)
              setSearchArray(responseData)
          //    console.log("Reached Here response")
        })
        .catch(function(error) {
              setSearchLoading(false)
          //    console.log("Reached Here error")
        });
     
      }
    

    const onClickSearchItem = (item) => {
        console.log(item)
        setProductAdded(true)
        setProductName(item)
        setSearchText("")
        setInputFocus(false)
       
      }

      const onClickClose = () => {
      
        setSearchText("")
        setInputFocus(true)

        setProductAdded(false)
        setProductName("")
       
      }
    
    const submit = () => {
        setSubmitted(true)
        setTempTitle(productName)
        const body = {
            "user_id": userId.slice(1,13),
            "product_id": 1,
            "category_id": 1,
            "brand_id": 1,
            "username": userName,
            "product_name": productName,
            "category_name": "category 1",
            "content_like": positiveReview,
            "content_dislike": negativeReview,
            "image": image
          }

          console.log(body)

          if(productName != "" && (positiveReview !== "" || negativeReview !== "") ) {
            axios({
                method: 'post',
                url: URL + '/reviews/addreview',
                data: body
            })
            .then(res => {
                setSubmitted(false)
                setModalVisible(true)
                refresh()
            })
            .catch((e) => {
                console.log(e)
                setSubmitted(false)
                ToastAndroid.show("Sorry! Review not posted due to an error. Please try later", ToastAndroid.SHORT)
            })
       } else {
            setSubmitted(false)
            Alert.alert('Enter your inputs!','Product Name and Review is mandatory',[{ text: "OK", onPress: () => console.log("OK Pressed") }]);
       }

    


    }

    const refresh = ()=> {
        setPositiveReview("")
        setNegativeReview("")
        setProductName([])
        setProductAdded(false)
        setImage("")
        setSubmitted(false)
      }


    return (
    <View style = {{backgroundColor : background, flex : 1}}>
        <View style = {header.headerView}>
            <ModernHeader 
            title="Post Review"
            titleStyle = {header.headerText}
            backgroundColor= {background}
            leftIconColor = {borderColor}
            leftIconOnPress={() => navigation.navigate("Home")}
            rightDisable
            />
        </View>
        <Modal 
            isVisible={modalVisible}
            deviceWidth={Dimensions.get('screen').width}
            deviceHeight={Dimensions.get('screen').height}
            onBackdropPress={() => setModalVisible(false)}
            onSwipeComplete={() => setModalVisible(false)}
            swipeDirection="left"
            style = {addPost.modalContainer}
            >
                <View style={{backgroundColor : 'white', padding : 20, borderRadius : 15, }}>
                    <View style={{marginBottom : 20, }}>
                        <Text style = {{fontWeight : 'bold', }}>Thanks for posting your review and helping the Candid Community</Text>
                        <Text style = {{marginTop : 10}}>Share this review in your network and help them discover amazing products !! </Text>
                    </View>
                    <View style = {{flexDirection : "row-reverse", justifyContent : 'center', alignItems : 'center'}}>
                        <TouchableOpacity style = {{marginLeft : 10 , padding : 10 ,borderRadius : 10, borderWidth : 1, borderColor : "#EEE"}} onPress = {()=>share(tempTitle)} >
                            <Text style = {{color : theme , fontWeight : 'bold'}}> Share with friends </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {{marginRight : 10 , padding : 10 ,borderRadius : 10, borderWidth : 1, borderColor : "#EEE"}} onPress = {()=>navigation.navigate("Home")} >
                            <Text style = {{color : "#666"}}> Go Home </Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
        </Modal>
        <ScrollView
            style = {{margin : 10, marginBottom : 0,}}
            contentContainerStyle = {{margin: 5,}}
        >
            
            <View style = {[addPost.sdIndividualComponent,{backgroundColor : background}]}>
              
                { !productAdded ?
                <View style = {{flexDirection : 'row', marginTop : 10,justifyContent : 'space-between', alignItems : 'center',borderRadius : 10, borderWidth : 1, borderColor : '#EEE',paddingHorizontal : 5 }}>
                    <TextInput style = {{fontSize : 15, flexShrink : 1, }}
                        placeholder = "Search for the product"
                        onChangeText = {(text) => search(text)}
                        value = {searchText}
                        numberOfLines = {2}
                        onFocus = {()=>setInputFocus(true)}
                        onBlur = {()=>setInputFocus(false)}
                    />
                    <TouchableOpacity 
                        style = {{padding : 2 , paddingLeft : 10 , paddingRight : 10,}}
                        onPress = {()=>onClickSearchItem(searchText)} >
                        <AntDesign name = "plus" size = {24} color = {theme} /> 
                    </TouchableOpacity> 
                </View> :  
                <View style = {{flexDirection : 'row', marginTop : 10,justifyContent : 'space-between', alignItems : 'center',paddingHorizontal : 5 }}>
                    <Text style = {{fontSize : 16, flexShrink : 1, fontWeight : 'bold' , color : theme }}>{productName} </Text>
                    <TouchableOpacity 
                            style = {{padding : 2 , paddingLeft : 10 , paddingRight : 10,}}
                            onPress = {()=>onClickClose()} >
                        <AntDesign name = "close" size = {24} color = {theme} />
                    </TouchableOpacity>
                </View> }

                {inputFocus ? 
                <View>
                   <TouchableHighlight 
                                style = {addPost.productSearchResultsButton}
                                onPress = {()=>onClickSearchItem("A")} >
                        <Text style = {addPost.productSearchResultsText}>A</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                                style = {addPost.productSearchResultsButton}
                                onPress = {()=>onClickSearchItem("B")} >
                        <Text style = {addPost.productSearchResultsText}>B</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                                style = {addPost.productSearchResultsButton}
                                onPress = {()=>onClickSearchItem("C")} >
                        <Text style = {addPost.productSearchResultsText}>C</Text>
                    </TouchableHighlight>
                   
                </View> : null}
             
            </View>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Attach Image </Text>
                <TouchableOpacity onPress = {pickImage}>
                    { image && image != "None" && image != ""?
                    <ImageBackground source = {{uri : image }} style = {addPost.sdImageSize} ></ImageBackground> :
                    <MaterialCommunityIcons name = "image-plus" size = {40} color = "#666"/>
                    }
              </TouchableOpacity>
            </View>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}><AntDesign name = "like2" size = {14}/>  What did you like ?</Text>
                <TextInput style = {[addPost.mainViewReviewWritingInput,{fontSize : 14,paddingLeft : 10,backgroundColor : 'white', borderRadius : 5, borderWidth : 1, borderColor : "#EEE", }]}  
                            textAlignVertical = 'top'
                            multiline
                            scrollEnabled
                            placeholder = "List down all pros and things that worked for you in details"
                            numberOfLines = {10}
                            onChangeText = {(text) => setPositiveReview(text)}
                            value = {positiveReview}                       
                />
            </View>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}><AntDesign name = "dislike2" size = {14}/>  What didn't you like</Text>
                <TextInput 	style = {[addPost.mainViewReviewWritingInput,{fontSize : 14, paddingLeft : 10, backgroundColor : 'white', borderRadius : 5, borderWidth : 1, borderColor : "#EEE"}]}  
                            textAlignVertical = 'top'
                            multiline
                            scrollEnabled
                            numberOfLines = {5}
                            placeholder = "List down all side effects, and other things you didn't like about the product"
                            onChangeText = {(text) => setNegativeReview(text)}
                            value = {negativeReview}                       
                />
            </View>
            <View style = {{justifyContent : 'center', alignItems : 'center' , marginTop : 20}}>
                <TouchableOpacity style = {{backgroundColor : theme, borderRadius : 20, padding : 10, paddingHorizontal : 20}} onPress = {submit}>
                    <Text  style = {{color : background, fontSize : 16,}}>Post Review</Text>
                </TouchableOpacity>
            </View>
            <View style = {{height : 20}}/>
        </ScrollView>
    </View>
    )
}

export default WriteReview

const styles = StyleSheet.create({})
