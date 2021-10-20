import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, FlatList,ScrollView } from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header, addPost, user } from './styles';
import { useNavigation } from '@react-navigation/native';
import { background,borderColor,theme,uploadImageOnS3 } from './exports';
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




const StartDiscussion = () => {
    const navigation = useNavigation()
    const [isOpen,setIsOpen] = React.useState(false)
    const [image,setImage] = React.useState("")
    const [tagsData,setTagsData] = React.useState(['aadaa','bbbaad', 'ccccccccccccc','dddddddddddddddd'])
    const [inputFocus,setInputFocus] = React.useState(false)
    const [searchText,setSearchText] = React.useState("")

    const [category,setCategory] = React.useState("")
    const [title,setTitle] = React.useState("")
    const [firstComment, setFirstComment] = React.useState("")

    const taginput = React.useRef(null);

    React.useEffect(()=>{
        console.log("Ref",taginput.current.isFocused())
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
      
        setSearchText("")
        setInputFocus(false)
       
      }
    
    const submit = () => {
        
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
        <ScrollView
            style = {{margin : 10, marginBottom : 0,}}
            contentContainerStyle = {{margin: 5,}}
        >
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Category</Text>
                <View style = {{flexDirection : 'row'}}>
                    <Text style = {[user.editUserDetailsElementTextInput,{flex : 1}]}> 
                      { category && category != "NA" ? category : ""} 
                    </Text>
                    <Picker
                    selectedValue={category}
                    style={{ height: 30, width: 40 }}
                    onValueChange={(value) => setCategory(value)}
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
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Title</Text>
                <TextInput style = {[addPost.mainViewReviewWritingInput,{fontSize : 16,paddingLeft : 0}]}  
                            multiline
                            scrollEnabled
                            placeholder = "Catchy Headlines"
                            onChangeText = {(text) => setTitle(text)}
                            value = {title}                       
                />
            </View>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Start Discussion</Text>
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
                <TagsView data = {tagsData}/>
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
              
                {inputFocus ? 
                <View>
                   <TouchableOpacity 
                                style = {addPost.productSearchResultsButton}
                                onPress = {()=>onClickSearchItem("A")} >
                        <Text style = {addPost.productSearchResultsText}>A</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                                style = {addPost.productSearchResultsButton}
                                onPress = {()=>onClickSearchItem("B")} >
                        <Text style = {addPost.productSearchResultsText}>B</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                                style = {addPost.productSearchResultsButton}
                                onPress = {()=>onClickSearchItem("C")} >
                        <Text style = {addPost.productSearchResultsText}>C</Text>
                    </TouchableOpacity>
                   
                </View> : null}
             
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
                <TouchableOpacity style = {{backgroundColor : theme, borderRadius : 20, padding : 10, paddingHorizontal : 20}} onPress = {submit}>
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
