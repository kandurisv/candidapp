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




const AppendTodayToJourney = () => {
    const navigation = useNavigation()
    const [isOpen,setIsOpen] = React.useState(false)
    const [image,setImage] = React.useState({image1: "", image2:"", image3 : "", image4: "", image5 : ""})
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

    const pickImage = async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(image)
    
        if (!result.cancelled) {
            if (index == 1) {
                setImage({...image, image1 : result.uri});
            }
            else if (index == 2) {
                setImage({...image, image2 : result.uri});
            }
            else if (imageNo == "image3") {
                setImage({...image, image3 : result.uri});
            }
            else if (imageNo == "image4") {
                setImage({...image, image4 : result.uri});
            }
            else if (imageNo == "image5") {
                setImage({...image, image5 : result.uri});
            }


          
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


    return(
        <ScrollView style = {{margin : 10}}>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Select all the products used</Text>
                <TagsView data = {tagsData}/>
                <View style = {{flexDirection : 'row', marginTop : 10, justifyContent : 'space-between', borderRadius : 20, borderWidth : 1, borderColor : '#EEE', paddingHorizontal : 5}}>
                    <TextInput style = {{fontSize : 12}}
                        ref={taginput}
                        placeholder = "Search for products"
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
                <Text style = {addPost.sdIndividualComponentHeader}>Attachments (MAX 5 images) </Text>
                <View style = {{flexDirection : 'row' , flexWrap : 'wrap'}}>
                    <TouchableOpacity style = {{width : (width/3)-30 , height : (width/4)-(15/2) , marginRight : 30,  marginTop : 10,backgroundColor : '#EEE' , justifyContent : 'center', alignItems : 'center'}} 
                        onPress = {()=>pickImage(1)}>
                        { image.image1 && image.image1 != "None" && image.image1 != ""?
                        <ImageBackground source = {{uri : image.image1 + "?" + new Date()}} style = {{width : (width/3)-30 , height : (width/4)-(15/2) }} ></ImageBackground> :
                        <MaterialCommunityIcons name = "image-plus" size = {40} color = "#666"/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style = {{width : (width/3)-30 , height : (width/4)-(15/2) , marginRight : 30, marginTop : 10,backgroundColor : '#EEE' , justifyContent : 'center', alignItems : 'center'}} 
                        onPress = {()=>pickImage(2)}>
                        { image.image2 && image.image2 != "None" && image.image2 != ""?
                        <ImageBackground source = {{uri : image.image2 + "?" + new Date()}} style = {{width : (width/3)-30 , height : (width/4)-(15/2) }} ></ImageBackground> :
                        <MaterialCommunityIcons name = "image-plus" size = {40} color = "#666"/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style = {{width : (width/3)-30 , height : width/4-(15/2) , marginTop : 10, backgroundColor : '#EEE' , justifyContent : 'center', alignItems : 'center'}} 
                        onPress = {()=>pickImage(1)}>
                        { image.image3 && image.image3 != "None" && image.image3 != ""?
                        <ImageBackground source = {{uri : image.image3 + "?" + new Date()}} style = {{width : (width/3)-30 , height : (width/4)-(15/2) }} ></ImageBackground> :
                        <MaterialCommunityIcons name = "image-plus" size = {40} color = "#666"/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style = {{width : (width/3)-30 , height : (width/4)-(15/2) , marginRight : 30, marginTop : 10,backgroundColor : '#EEE' , justifyContent : 'center', alignItems : 'center'}} 
                        onPress = {()=>pickImage(4)}>
                        { image.image4 && image.image4 != "None" && image.image4 != ""?
                        <ImageBackground source = {{uri : image.image4 + "?" + new Date()}} style = {{width : (width/3)-30 , height : (width/4)-(15/2) }} ></ImageBackground> :
                        <MaterialCommunityIcons name = "image-plus" size = {40} color = "#666"/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style = {{width : (width/3)-30 , height : (width/4)-(15/2) , marginRight : 30,marginTop : 10, backgroundColor : '#EEE' , justifyContent : 'center', alignItems : 'center'}} 
                        onPress = {()=>pickImage(5)}>
                        { image.image5 && image.image5 != "None" && image.image5 != ""?
                        <ImageBackground source = {{uri : image.image5 + "?" + new Date()}} style = {{width : (width/3)-30 , height : (width/4)-(15/2) }} ></ImageBackground> :
                        <MaterialCommunityIcons name = "image-plus" size = {40} color = "#666"/>
                        }
                    </TouchableOpacity>
                </View>
            </View>
            <View style = {addPost.sdIndividualComponent}>
                <Text style = {addPost.sdIndividualComponentHeader}>Journal </Text>
                <TextInput style = {[addPost.mainViewReviewWritingInput,{fontSize : 14,paddingLeft : 5,backgroundColor : 'white', borderRadius : 5, borderWidth : 1, borderColor : "#EEE", }]}  
                            textAlignVertical = 'top'
                            multiline
                            scrollEnabled
                            placeholder = "List down all pros and things that worked for you in details"
                            numberOfLines = {15}
                            onChangeText = {(text) => setTitle(text)}
                            value = {title}                       
                />
            </View>
            <View style = {{justifyContent : 'center', alignItems : 'center' , marginTop : 20}}>
                <TouchableOpacity style = {{backgroundColor : theme, borderRadius : 20, padding : 10, paddingHorizontal : 20}} onPress = {submit}>
                    <Text  style = {{color : background, fontSize : 16,}}>Add</Text>
                </TouchableOpacity>
            </View>
            <View style = {{height : 20}}/>
        </ScrollView>
        
        
        )
}

const ShowPreviousJourney = (props) => {
    

    React.useEffect(() =>{
        console.log(props.date)
    },[])

    return(
        <View>
            <Text>{props.date}</Text>
        </View>
        
        
        )


}



const AppendJourney = () => {

    const [expanded,setExpanded] = React.useState(false)

    const [dateSelected,setDateSelected] = React.useState("Today")

    return (
        <View style = {{backgroundColor : background, flex : 1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title="Update Journey"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.navigate("Home")}
                rightDisable
                />
            </View>
            <View style = {{backgroundColor : background}}>
                
                <View style = {{justifyContent : 'flex-end', flexDirection : 'row', }}>
                    <Text style = {user.editUserDetailsElementTextInput}> 
                      { dateSelected && dateSelected != "NA" ? dateSelected : ""} 
                    </Text>
                    <Picker
                    selectedValue={dateSelected}
                    style={{ height: 30, width: 40 }}
                    onValueChange={(value) => setDateSelected(value)}
                    dropdownIconColor = {theme}
                    itemStyle = {{fontSize : 12, color : theme}}
                    >
                        <Picker.Item label="Today" value="Today" />
                        <Picker.Item label="Female" value="Female" />
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Others" value="Others" />
                        <Picker.Item label="Prefer not to say" value="Prefer Not to say" />
                    </Picker>
                </View>
                { dateSelected == "Today" ? 
                    <AppendTodayToJourney /> : 
                    <ShowPreviousJourney date = {dateSelected} />
                }
               
            </View>
           
        </View>
    )
}

export default AppendJourney

const styles = StyleSheet.create({})
