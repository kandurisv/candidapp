import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, FlatList,ScrollView } from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header, addPost, user } from './styles';
import { useNavigation } from '@react-navigation/native';
import { background,borderColor,theme,uploadImageOnS3, width } from './exports';
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { removeNotificationSubscription } from 'expo-notifications';



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




const AddJourney = () => {
    const navigation = useNavigation()
    const [isOpen,setIsOpen] = React.useState(false)
    const [image,setImage] = React.useState("")
    const [tagsData,setTagsData] = React.useState(['aadaa','bbbaad', 'ccccccccccccc','dddddddddddddddd'])
    const [inputFocus,setInputFocus] = React.useState(false)
    const [searchText,setSearchText] = React.useState("")

    const [category,setCategory] = React.useState("")
    const [title,setTitle] = React.useState("")
    const [firstComment, setFirstComment] = React.useState("")
    const [newJourney,setNewJourney] = React.useState(false)
   

    const [journeyAdded,setJourneyAdded] = React.useState(false)
    const [journeyName,setJourneyName] = React.useState("")

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
        //   uploadImageOnS3(user_id + "/cover",result.uri)
        //   const body = {
        //     "var" : "edit user",
        //     "user_id": user_id,
        //     "username": userName,
        //     "gender": gender,
        //     "dob": userDob,
        //     "email": "",
        //     "phone_number": userId,
        //     "location": "",
        //     "cover_image" : s3URL + user_id + "/cover"
        //   }
    
        //   console.log(body)
    
        // axios({
        //   method: 'post',
        //   url: URL + '/user/info',
        //   data: body
        // })
        // .then(res => {
        // //  console.log(res)
        // }).catch((e) => console.log(e))
    
         }
      }; 

     

    const search = (text) => {
        setSearchText(text)
       
        
        // axios.get(URL + "/search/product", {params:{str2Match : text }} , {timeout : 3000})
        //   .then(res => res.data).then(function(responseData) {
        //       console.log("SearchArray",responseData)
        //       setSearchLoading(false)
        //       setSearchArray(responseData)
        //   //    console.log("Reached Here response")
        // })
        // .catch(function(error) {
        //       setSearchLoading(false)
        //   //    console.log("Reached Here error")
        // });
     
      }
    

    const onClickSearchItem = (item) => {
        console.log(item)
      
        setSearchText("")
        setInputFocus(false)

        setJourneyAdded(true)
        setJourneyName(item)
       
      }
    
    const onClickClose = () => {
      
        setSearchText("")
        setInputFocus(true)

        setJourneyAdded(false)
        setJourneyName("")
       
      }


    const submit = () => {
        
    }

    const newJourneyFunc = () => {
        console.log("HI")
        setNewJourney(true)
        newJourneyRef.current.focus()
    }


    return (
    <View style = {{backgroundColor : background, flex : 1}}>
        <View style = {header.headerView}>
            <ModernHeader 
            title="Add Journey"
            titleStyle = {header.headerText}
            backgroundColor= {background}
            leftIconColor = {borderColor}
            leftIconOnPress={() => navigation.navigate("Home")}
            rightDisable
            />
        </View>
        <View style = {{margin : 10, flex : 1, }}>
            <View style = {[addPost.sdIndividualComponent,{backgroundColor : background}]}>
              
                { !journeyAdded ?
                <View style = {{flexDirection : 'row', marginTop : 10,justifyContent : 'space-between', alignItems : 'center',borderRadius : 10, borderWidth : 1, borderColor : '#EEE',paddingHorizontal : 5 }}>
                    <TextInput style = {{fontSize : 15, flexShrink : 1, }}
                        placeholder = "Enter Journey Name Here"
                        onChangeText = {(text) => search(text)}
                        value = {searchText}
                        numberOfLines = {2}
                    />
                    <TouchableOpacity 
                        style = {{padding : 2 , paddingLeft : 10 , paddingRight : 10,}}
                        onPress = {()=>onClickSearchItem(searchText)} >
                        <AntDesign name = "plus" size = {24} color = {theme} /> 
                    </TouchableOpacity> 
                </View> :  
                <View style = {{flexDirection : 'row', marginTop : 10,justifyContent : 'space-between', alignItems : 'center',paddingHorizontal : 5 }}>
                    <Text style = {{fontSize : 16, flexShrink : 1, fontWeight : 'bold' , color : theme }}>{journeyName} </Text>
                    <TouchableOpacity 
                            style = {{padding : 2 , paddingLeft : 10 , paddingRight : 10,}}
                            onPress = {()=>onClickClose()} >
                        <AntDesign name = "close" size = {24} color = {theme} />
                    </TouchableOpacity>
                </View> }
             
            </View>
            { journeyAdded ? null : 
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Suggestions</Text>
                <View style = {{flexDirection : 'row', flexWrap : 'wrap'}}>

                    <Text style = {{marginRight : 10}}>Morning Routine</Text>
                    <Text style = {{marginRight : 10}}>Evening Routine</Text>
                    <Text style = {{marginRight : 10}}>Mama Earth Products</Text>
                    <Text style = {{marginRight : 10}}>Hair Fall doctor recommendation</Text>
                    
                </View>
            </View>
            }

            { journeyAdded ? 
                <View>
                    <TagsView />
                </View> : null

            }
        
            
            <View style = {[addPost.sdIndividualComponent,{backgroundColor : background, flex : 1}]}>
                <Text style = {addPost.sdIndividualComponentHeader}>Existing Journeys</Text>
                <ScrollView
                    style = {{margin : 10, marginBottom : 0}}
                    contentContainerStyle = {{margin: 5,}}
                >
                    <TouchableOpacity
                    style = {{}}
                    onPress = {()=>navigation.navigate("AppendJourney")}
                    >
                        <Text>A</Text>
                    </TouchableOpacity>            
                </ScrollView>
            </View>
        </View>
    </View>

    )
}

export default AddJourney

const styles = StyleSheet.create({})
