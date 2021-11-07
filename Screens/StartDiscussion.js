import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput,Share, FlatList,ScrollView, Dimensions, ToastAndroid, Alert } from 'react-native'
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

const TagsView = ({data,removeFunc}) => {

    const removeData = (item,index) => {
        removeFunc(item,index)
    }

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
                onPress = {()=>removeData(item,index)}>
                <Text style = {{marginRight : 5 }}>{item}</Text>
                <AntDesign name = "closecircleo" color = {theme} size = {10} />
            </TouchableOpacity>)
        })}
    </View>
)}




const StartDiscussion = () => {
    const navigation = useNavigation()
    const [isOpen,setIsOpen] = React.useState(false)
    const [image,setImage] = React.useState("")
    const [tagsData,setTagsData] = React.useState([])
    const [inputFocus,setInputFocus] = React.useState(false)
    const [searchText,setSearchText] = React.useState("")

    const [category,setCategory] = React.useState("")
    const [title,setTitle] = React.useState("")
    const [firstComment, setFirstComment] = React.useState("")

    const [modalVisible,setModalVisible] = React.useState(false)
    const [userId,userDetails, isLoggedIn] = React.useContext(AuthContext)

    const [searchLoading,setSearchLoading] = React.useState(false)
    const [searchArray,setSearchArray] = React.useState([])
    const [submitted,setSubmitted] = React.useState(false)

    const [tempTitle,setTempTitle] = React.useState("")

    const [imageLinkName,setImageLinkName] = React.useState(customAlphabet('123456789', 10))

    const taginput = React.useRef(null);

    React.useEffect(()=>{
        console.log("Ref",taginput.current.isFocused())
        setSearchText("")

        axios.get(URL + "/search/tags", {timeout : 3000})
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
    },[tagsData])


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
    
    
        if (!result.cancelled) {
          setImage(s3URL + userId.slice(1,13) + "/discussion/" + imageLinkName);
          uploadImageOnS3(userId.slice(1,13) + "/discussion/" + imageLinkName,result.uri)
        }
      }; 

     

    const search = (text) => {
        setSearchText(text)
        setSearchLoading(true)
        
        axios.get(URL + "/search/tags", {params:{str2Match : text }} , {timeout : 3000})
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
        console.log("Item",item)
        if(item && item != "") 
        {
            setTagsData([...tagsData, item])
        }
       
        setInputFocus(false)
       
    }

    const removeTagFromData = (item,index) => {
        var newarray = [...tagsData]
        var index = newarray.indexOf(item)
        if (index !== -1) {
            newarray.splice(index, 1);
            setTagsData(newarray)
        }
    }

      const refresh = ()=> {
        setTitle("")
        setFirstComment("")
        setTagsData([])
        setImage("")
        setSubmitted(false)
      }
    
    const submit = () => {
        setSubmitted(true)
        setTempTitle(title)
        const body = {
            "user_id": userId.slice(1,13),
            "level": 1,
            "parent_id": "",
            "question_id": "",
            "username": "",
            "title": title,
            "tags": tagsData,
            "image": image ,
            "content": firstComment
          }
    
           console.log(body)
    
           if(title != "" && firstComment != "") {
                axios({
                    method: 'post',
                    url: URL + '/discussion/add_item',
                    data: body
                })
                .then(res => {
                    setModalVisible(true)
                    refresh()
                })
                .catch((e) => {
                    setSubmitted(false)
                    ToastAndroid.show("Sorry! Discussion not initiated due to an error. Please try later", ToastAndroid.SHORT)
                })
           } else {
                setSubmitted(false)
                Alert.alert('Enter your inputs!','Title and Discussion Comment are mandatory',[{ text: "OK", onPress: () => console.log("OK Pressed") }]);
           }

        
      
    } 

    const share = async (title) => {
        //Amplitude.logEventWithPropertiesAsync('REFERRAL', {userId : userId})
        try {
            const result = await Share.share({
              message: "Checkout my discussion on " + title + " on Candid app. Sign up here to know more - https://play.google.com/store/apps/details?id=com.candid.app"
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
    



    


    return (
    <View style = {{backgroundColor : background, flex : 1}}>
        <View style = {header.headerView}>
            <ModernHeader 
            title="Start Discussion"
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
                        <Text style = {{fontWeight : 'bold', }}>Congrats! You have initiated a new discussion.</Text>
                        <Text style = {{marginTop : 10}}>You can share this discussion with your network and get quick replies !! </Text>
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
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Title*</Text>
                <TextInput style = {[addPost.mainViewReviewWritingInput,{fontSize : 16,paddingLeft : 0}]}  
                            multiline
                            scrollEnabled
                            placeholder = "Catchy Headlines"
                            onChangeText = {(text) => setTitle(text)}
                            value = {title}                       
                />
            </View>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Start Discussion*</Text>
                <TextInput 	style = {[addPost.mainViewReviewWritingInput,{fontSize : 14, paddingLeft : 0}]}  
                            multiline
                            scrollEnabled
                            placeholder = "Your first comment on the discussion here"
                            onChangeText = {(text) => setFirstComment(text)}
                            value = {firstComment}                       
                />
            </View>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Tags</Text>
                <TagsView 
                    removeFunc = {(item,index)=>removeTagFromData(item,index)}
                    data = {tagsData}/>
                <View style = {{flexDirection : 'row', marginTop : 10, justifyContent : 'space-between', borderRadius : 20, borderWidth : 1, borderColor : '#EEE', paddingHorizontal : 5}}>
                    <TextInput style = {{fontSize : 12}}
                        ref={taginput}
                        placeholder = "Add Tags - Categories, Brands, Products, Concerns"
                        onChangeText = {(text) => search(text)}
                        value = {searchText}
                        onFocus = {()=>setInputFocus(true)}
                        onBlur = {()=>setInputFocus(false)}
                    />
                    <TouchableOpacity 
                        style = {{padding : 2 , paddingLeft : 10 , paddingRight : 10,}}
                        onPress = {()=>onClickSearchItem(searchText)} >
                        <AntDesign name = "plus" size = {24} color = {theme} />
                    </TouchableOpacity>
                </View>
                <View style = {{ }}>
                {inputFocus && searchArray.length ? 
                searchArray.map((item,index)=>{return(
               

                    <TouchableHighlight 
                                key = {index.toString()}
                                style = {addPost.productSearchResultsButton}
                                onPress = {()=>onClickSearchItem(item.tags)} >
                        <Text style = {addPost.productSearchResultsText}>{item.tags}</Text>
                    </TouchableHighlight>
                   
                   
                )}) : null}
                </View>
             
            </View>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Attachments </Text>
                <TouchableOpacity onPress = {pickImage}>
                    { image && image != "None" && image != ""?
                    <ImageBackground source = {{uri : image + "?" + new Date()}} style = {addPost.sdImageSize} ></ImageBackground> :
                    <MaterialCommunityIcons name = "image-plus" size = {40} color = "#666"/>
                    }
              </TouchableOpacity>
            </View>
            <View style = {{justifyContent : 'center', alignItems : 'center' , marginTop : 20}}>
                <TouchableOpacity 
                disabled = {submitted}
                style = {{backgroundColor : theme, borderRadius : 20, padding : 10, paddingHorizontal : 20}} onPress = {submit}>
                    <Text  style = {{color : background, fontSize : 16,}}>Start Discussion</Text>
                </TouchableOpacity>
            </View>
            <View style = {{height : 20}}/>
        </ScrollView>
    </View>
    )
}

export default StartDiscussion

const styles = StyleSheet.create({})
