import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, FlatList,ScrollView, ToastAndroid } from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header, addPost, user } from './styles';
import { useNavigation,useRoute } from '@react-navigation/native';
import { AuthContext, background,borderColor,s3URL,theme,uploadImageOnS3, URL, width } from './exports';
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { removeNotificationSubscription } from 'expo-notifications';
import moment from 'moment';
import axios from 'axios';



const TagsView = ({data}) => {

    React.useEffect(() =>{
    //    console.log("Data", data)
    },[])

    return(
    <View style = {{flexDirection : 'row', flexWrap : 'wrap', flex:1 }}>
        {data.map((item,index)=>{
            return(
            <TouchableOpacity 
                key={index}
                style = {{flexDirection : 'row', alignItems : 'center', marginVertical : 5, marginRight : 5, borderRadius : 10 ,paddingHorizontal : 10, paddingVertical : 5, backgroundColor : '#EEE',}}
                onPress = {()=>console.log("clicked on tag")}>
                <Text style = {{marginRight : 5 }}>{item}</Text>
            </TouchableOpacity>)
        })}
    </View>
)}




const AppendTodayToJourney = ({journeyId, journeyTitle, productNames, content , image , date ,productId}) => {
    const navigation = useNavigation()
    const route = useRoute()
    const [isOpen,setIsOpen] = React.useState(false)
    const [image1,setImage1] = React.useState({})
    const [imageShown,setImageShown] = React.useState("")
    const [content1,setContent1] = React.useState({})
    const [date1,setDate1] = React.useState([])
    const [tagsData,setTagsData] = React.useState(['aadaa','bbbaad', 'ccccccccccccc','dddddddddddddddd'])
    const [inputFocus,setInputFocus] = React.useState(false)
    const [searchText,setSearchText] = React.useState("")
    const [userId] = React.useContext(AuthContext)
    const [category,setCategory] = React.useState("")
    const [title,setTitle] = React.useState("")
    const [firstComment, setFirstComment] = React.useState("")
    

    const [currentDate,setCurrentDate] = React.useState(moment().format("YYYY-MM-DD"))
    
    const [userName,setUserName] = React.useState("")
    const [userImage,setUserImage] = React.useState("")

    const [submitted,setSubmitted] = React.useState(false)

    React.useEffect(()=>{
        if(date[0] !== currentDate) {
            setDate1([currentDate,...date])
        } else {
            ToastAndroid.show("You already updated your journey for today. If you want to edit it, please submit a new entry",ToastAndroid.LONG)
        }

        


        




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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
       
    
        if (!result.cancelled) {
            setImageShown(result.uri)
        //    console.log(result.uri)
            setImage1({[currentDate] : s3URL + "journey/"+ userId.slice(1,13) + "/" + journeyTitle.replace(/\s/g,"x") + "/" + currentDate,...image});
            uploadImageOnS3("journey/"+ userId.slice(1,13) + "/" + journeyTitle.replace(/\s/g,"x") + "/" + currentDate,result.uri)
    
         }
        
      }; 

     

    const search = (text) => {
        setSearchText(text)
        setSearchLoading(true)
        
        axios.get(URL + "/search/product", {params:{str2Match : text }} , {timeout : 3000})
          .then(res => res.data).then(function(responseData) {
            //  console.log("SearchArray",responseData)
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
    //    console.log(item)
      
        setSearchText("")
        setInputFocus(false)
       
      }
    
    const submit = () => {
        setSubmitted(true)


        const body ={
            "journey_id" : journeyId ,
            "user_id": userId.slice(1,13),
            "username": userName,
            "product_id" : productId,
            "product_names": productNames,
            "journey_title": journeyTitle,
            "content": content1,
            "image": image1,
            "datetime_array": date1
          }

      //  console.log(body)
        

          if(title != "" ) {
            axios({
                method: 'post',
                url: URL + '/journey/addjourney',
                data: body
            })
            .then(res => {
               ToastAndroid.show("Added your journey",ToastAndroid.SHORT)
               setSubmitted(false)
               setTimeout(function(){
                navigation.navigate("Home")
                }, 300);    
            })
            .catch((e) => {
                setSubmitted(false)
                ToastAndroid.show("Sorry! Discussion not initiated due to an error. Please try later", ToastAndroid.SHORT)
            })
       } else {
           
            Alert.alert('Enter your inputs!','Title and Discussion Comment are mandatory',[{ text: "OK", onPress: () => console.log("OK Pressed") }]);
       }
        
    }


    return(
        <ScrollView 
        showsVerticalScrollIndicator = {false}
        style = {{margin : 10 , marginBottom: 120}}>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Products in this journey</Text>
                <TagsView data = {productNames}/>             
            </View>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Attach Image</Text>
                <View style = {{flexDirection : 'row' , flexWrap : 'wrap', }}>
                    <TouchableOpacity style = {{marginTop : 10 , justifyContent : 'center', alignItems : 'center'}} 
                        onPress = {()=>pickImage()}>
                        { imageShown && imageShown != "None" && imageShown != ""?
                        <ImageBackground source = {{uri : imageShown}} style = {{width : width * 0.92 , height : width * 0.69 , marginLeft : width * 0.01 , marginRight : width * 0.01  }} ></ImageBackground> :
                        <MaterialCommunityIcons name = "image-plus" size = {50} color = "#666"/>
                        }
                    </TouchableOpacity>
                </View>
            </View>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Journal </Text>
                <TextInput style = {[addPost.mainViewReviewWritingInput,{fontSize : 15,paddingLeft : 5,backgroundColor : 'white', borderRadius : 5, borderWidth : 1, borderColor : "#EEE", }]}  
                            textAlignVertical = 'top'
                            multiline
                            scrollEnabled
                            placeholder = "How did your journey go ? "
                            numberOfLines = {15}
                            onChangeText = {(text) => setTitle(text)}
                            value = {title}   
                            onBlur = {()=>setContent1({...content,[currentDate]:title})}                    
                />
            </View>
            <View style = {{justifyContent : 'center', alignItems : 'center' , marginTop : 20}}>
                <TouchableOpacity style = {{backgroundColor : theme, borderRadius : 20, padding : 10, paddingHorizontal : 20}} 
                onPress = {submit}
                disabled = {submitted}
                >

                    <Text  style = {{color : background, fontSize : 16,}}>Add</Text>
                </TouchableOpacity>
            </View>
            <View style = {{height : 20}}/>
        </ScrollView>
        
        
        )
}

const ShowPreviousJourney = ({date,content, image, indexSelected, productNames, journeyId, journeyTitle}) => {
    
    

    React.useEffect(() =>{
     //   console.log(date, content, image , indexSelected)
    },[])

    return(
        
        <ScrollView 
        showsVerticalScrollIndicator = {false}
        style = {{margin : 10, marginBottom : 120}}>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Products in this journey</Text>
                <TagsView data = {productNames}/>             
            </View>
            <View>
                <View style = {{flexDirection : 'row' , flexWrap : 'wrap', justifyContent : 'center', alignItems: 'center'}}>
                    <View style = {{width : width * 0.92 , height : width * 0.69 ,  marginTop : 10,backgroundColor : '#EEE' , justifyContent : 'center', alignItems : 'center'}} 
                       >
                        { image[indexSelected] && image[indexSelected] != "None" && image[indexSelected] != ""?
                        <ImageBackground source = {{uri : image[indexSelected]}} style = {{width : width * 0.92 , height : width * 0.69 }} ></ImageBackground> :
                        null 
                        }
                    </View>
                </View>
                <Text>{content[indexSelected]}</Text>
            </View>
           
            
            <View style = {{height : 20}}/>
        </ScrollView>
        
        
        )


}



const AppendJourney = () => {
    const navigation = useNavigation()
    const route = useRoute()

    const [expanded,setExpanded] = React.useState(false)

    const [dateSelected,setDateSelected] = React.useState("Today")
    const [dateShown,setDateShown] = React.useState("Today")


    const datetime = route.params?.datetime
    const content =  route.params?.content
    const image = route.params?.image
    const productId = route.params?.productId
    const productNames = route.params?.productNames
    const journeyId = route.params?.journeyId ? route.params?.journeyId : null
    const journeyTitle = route.params?.journeyTitle

    React.useEffect(()=>{
     //   console.log(datetime , "This is append journey")
    },[])

    return (
        <View style = {{backgroundColor : background, flex : 1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title={journeyTitle}
                titleStyle = {[header.headerText,{color : theme}]}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.goBack()}
                rightDisable
                />
            </View>
            <View style = {{backgroundColor : background , }}>
                
                <View style = {{justifyContent : 'flex-end', flexDirection : 'row', }}>
                    <Text style = {user.editUserDetailsElementTextInput}> 
                      { dateShown && dateShown != "NA" ? dateShown : ""} 
                    </Text>
                    <Picker
                    selectedValue={dateSelected}
                    style={{ height: 30, width: 40 }}
                    onValueChange={(value) => {
                     //   console.log(value)
                        setDateSelected(value == "Today" ? "Today" : value)
                        setDateShown(value == "Today" ? "Today" : value)
                    }}
                    dropdownIconColor = {theme}
                    itemStyle = {{fontSize : 12, color : theme}}
                    >
                        <Picker.Item label="Today" value="Today" />
                        { datetime.map((date,index)=>{
                            return(
                                <Picker.Item key = {index.toString()} label={date} value={date} />
                                )
                        })
                           
                        }
                    </Picker>
                </View>
                { dateSelected == "Today" ? 
                    <AppendTodayToJourney date = {datetime} content = {content} image = {image} journeyId = {journeyId} journeyTitle = {journeyTitle} productNames = {productNames} productId = {productId}/> : 
                    <ShowPreviousJourney date = {datetime} content = {content} image = {image} indexSelected = {dateSelected} journeyId = {journeyId} journeyTitle = {journeyTitle} productNames = {productNames}
                    />
                }
               
            </View>
           
        </View>
    )
}

export default AppendJourney

const styles = StyleSheet.create({})
