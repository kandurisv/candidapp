import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, FlatList,ScrollView, Dimensions, Alert, Share } from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header, addPost, user } from './styles';
import { useNavigation } from '@react-navigation/native';
import { AuthContext, background,borderColor,theme,uploadImageOnS3, URL } from './exports';
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { removeNotificationSubscription } from 'expo-notifications';
import { Rating, AirbnbRating } from 'react-native-ratings';
import axios from 'axios'
import Modal from 'react-native-modal';
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




const GiveRecommendation = () => {
    const navigation = useNavigation()
    const [isOpen,setIsOpen] = React.useState(false)
    const [image,setImage] = React.useState("")
    const [tagsData,setTagsData] = React.useState([])
    const [inputFocus,setInputFocus] = React.useState(false)
    const [searchText,setSearchText] = React.useState("")

    const [access,setAccess] = React.useState("Public")
    const [productName,setProductName] = React.useState("")
    const [productAdded,setProductAdded] = React.useState("")
    const [comment, setComment] = React.useState("")

    const [modalVisible,setModalVisible] = React.useState(false)
    const [userId,userDetails, isLoggedIn] = React.useContext(AuthContext)

    const [searchLoading,setSearchLoading] = React.useState(false)
    const [searchArray,setSearchArray] = React.useState([])
    const [submitted,setSubmitted] = React.useState(false)

    const [tempTitle,setTempTitle] = React.useState("")

    const [imageLinkName,setImageLinkName] = React.useState(customAlphabet('123456789', 10))

   

    React.useEffect(()=>{
        
    },[])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
    
    
        if (!result.cancelled) {
            setImage(result.uri);
            uploadImageOnS3(user_id + "/recommendation/" + imageLinkName,result.uri)
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
        setSearchText(item)
        setInputFocus(false)
       
      }

      const onClickClose = () => {
      
        setSearchText("")
        setInputFocus(true)
        setProductAdded(false)
        setProductName("")
       
      }
    
    const submit = () => {
        setTempTitle(productName)
        setSubmitted(true)

        const body = {
            "user_id": userId.slice(1,13),
            "product_id": 1,
            "category_id": 1,
            "brand_id": 1,
            "username": "",
            "product_name": productName,
            "category_name": "category 1",
            "comment": comment,
            "image": image !== "" ? "" : s3URL + userId.slice(1,13) + "/recommendation/" + imageLinkName
          }

          if(productName != "") {
            axios({
                method: 'post',
                url: URL + '/recommendations/add',
                data: body
            })
            .then(res => {
                setModalVisible(true)
                refresh()
            })
            .catch((e) => {
                setSubmitted(false)
                ToastAndroid.show("Sorry! Recommendation not posted due to an error. Please try later", ToastAndroid.SHORT)
            })
       } else {
            setSubmitted(false)
            Alert.alert('Enter your input!','Product Name is mandatory',[{ text: "OK", onPress: () => console.log("OK Pressed") }]);
       }

        
    }

    const ratingCompleted = (rating) => {
        console.log("Rating is: " + rating)
      }

      const refresh = ()=> {
        setComment("")
        setProductName("")
        setProductAdded(false)
        setImage("")
        setSubmitted(false)
      }



    return (
    <View style = {{backgroundColor : background, flex : 1}}>
        <View style = {header.headerView}>
            <ModernHeader 
            title="Give Recommendation"
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
                        <Text style = {{fontWeight : 'bold', }}>Share your recommendations to get your link </Text>
                        <Text style = {{marginTop : 10}}>Only people with this link can see your recommendations.</Text>
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
                        onBlur = {()=>{
                            onClickSearchItem(searchText)
                            setInputFocus(false)}
                        }
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
                <Text style = {addPost.sdIndividualComponentHeader}>Comments (if any) </Text>
                <TextInput style = {[addPost.mainViewReviewWritingInput,{fontSize : 14,paddingLeft : 5,backgroundColor : 'white', borderRadius : 5, borderWidth : 1, borderColor : "#EEE", }]}  
                            textAlignVertical = 'top'
                            multiline
                            scrollEnabled
                            placeholder = "Why are you recommeding this product to your friends ?"
                            numberOfLines = {5}
                            onChangeText = {(text) => setComment(text)}
                            value = {comment}                       
                />
            </View>


            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Product Image </Text>
                <TouchableOpacity onPress = {pickImage}>
                    { image && image != "None" && image != ""?
                    <ImageBackground source = {{uri : image + "?" + new Date()}} style = {addPost.sdImageSize} ></ImageBackground> :
                    <MaterialCommunityIcons name = "image-plus" size = {40} color = "#666"/>
                    }
              </TouchableOpacity>
            </View>
           
            <View style = {{justifyContent : 'center', alignItems : 'center' , marginTop : 20}}>
                <TouchableOpacity style = {{backgroundColor : theme, borderRadius : 20, padding : 10, paddingHorizontal : 20}} onPress = {submit}>
                    <Text  style = {{color : background, fontSize : 16,}}>Recommend</Text>
                </TouchableOpacity>
            </View>
            <View style = {{height : 20}}/>
        </ScrollView>
    </View>
    )
}

export default GiveRecommendation

const styles = StyleSheet.create({})
