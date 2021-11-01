import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, FlatList,ScrollView } from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header, addPost, user } from './styles';
import { useNavigation } from '@react-navigation/native';
import { AuthContext, background,borderColor,theme,uploadImageOnS3, URL, width } from './exports';
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { removeNotificationSubscription } from 'expo-notifications';
import axios from 'axios';
import { TouchableHighlight } from 'react-native-gesture-handler';



const TagsView = ({data,removeFunc}) => {

    const removeData = (item,index) => {
        removeFunc(item,index)
    }

    React.useEffect(() =>{
      //  console.log("Data", data)
    },[])

    return(
    <View style = {{flexDirection : 'row', flexWrap : 'wrap' }}>
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




const AddJourney = () => {
    const navigation = useNavigation()
    const [isOpen,setIsOpen] = React.useState(false)
    const [image,setImage] = React.useState("")
    const [userId] = React.useContext(AuthContext)
    const [inputFocus,setInputFocus] = React.useState(false)
    const [searchText,setSearchText] = React.useState("")
    const [searchTextProduct,setSearchTextProduct] = React.useState("")

    const [category,setCategory] = React.useState("")
    const [title,setTitle] = React.useState("")
    const [firstComment, setFirstComment] = React.useState("")
    const [newJourney,setNewJourney] = React.useState(false)
    const [nameReco,setNameReco] = React.useState([])
    const [journeyList,setJourneyList]= React.useState([])
   
    const [tagsData,setTagsData] = React.useState([])

    const [journeyAdded,setJourneyAdded] = React.useState(false)
    const [journeyProductsAdded,setJourneyProductsAdded] = React.useState(true)
    const [journeyName,setJourneyName] = React.useState("")

    const taginput = React.useRef(null);

    React.useEffect(()=>{
      //  console.log(userId)
        const getNameReco = async () => {
            axios.get(URL + "/journey/namereco",{params:{user_id : userId.slice(1,13) }} ,{timeout : 5000})
                .then(res => res.data).then(function(responseData) {
              //      console.log("Namereco", responseData)
                    setNameReco(responseData)
                })
                .catch(function(error) {   });
            }
        getNameReco()

        const getExistingJourneys = async () => {
            axios.get(URL + "/journey/existingjourneylist",{params:{user_id : userId.slice(1,13) }} ,{timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                 //   console.log("journey list", responseData)
                    setJourneyList(responseData)
                })
                .catch(function(error) {   });
            }
        getExistingJourneys()



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
            uploadImageOnS3(user_id + "/cover",result.uri)    
         }
      }; 

     

    const search = (text) => {
        setSearchText(text)

      }

      const searchProduct = (text) => {
        setSearchTextProduct(text)

      }
    

    const onClickSearchItem = (item) => {
      //  console.log(item)
      
        setSearchText("")
        setInputFocus(false)

        setJourneyAdded(true)
        setJourneyProductsAdded(false)
        setJourneyName(item)
       
      }

      const onClickSearchItemChild = (item) => {
      //  console.log(item)
      
        setSearchTextProduct("")
        setInputFocus(false)
        if(item && item != "") 
        {
            setTagsData([...tagsData, item])
        }
      
       
      }
    
    const onClickClose = () => {
      
        setSearchText("")
        setInputFocus(true)

        setJourneyAdded(false)
        setJourneyProductsAdded(true)
        setJourneyName("")
       
      }


    const submit = () => {
        
    }

    const newJourneyFunc = () => {
     //   console.log("HI")
        setNewJourney(true)
        newJourneyRef.current.focus()
    }

    const removeTagFromData = (item,index) => {
        var newarray = [...tagsData]
        var index = newarray.indexOf(item)
        if (index !== -1) {
            newarray.splice(index, 1);
            setTagsData(newarray)
        }
    }

    const onCreateJourney = (journey,tags) => {
        // console.log([{
        //     "content": JSON.stringify({}),
        //     "datetime_array": JSON.stringify([]),
        //     "image": JSON.stringify({}),
        //     "journey_title": journey,
        //     "product_id": JSON.stringify([1, 2, 3]),
        //     "product_names": JSON.stringify(tags),
        //   },...journeyList])

        setJourneyList([{
            "content": JSON.stringify({}),
            "datetime_array": JSON.stringify([]),
            "image": JSON.stringify({}),
            "journey_title": journey,
            "product_id": JSON.stringify([1, 2, 3]),
            "product_names": JSON.stringify(tags)
          },...journeyList])
        setJourneyProductsAdded(true)
        setJourneyAdded(false)
        setSearchTextProduct("")
        setSearchText("")
        setTagsData([])
      //  console.log("JN", journey , "Tags" , tags)
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
                    { nameReco.map((item,index)=>{
                        return(
                        <TouchableOpacity
                        key = {index.toString()}
                        style = {{backgroundColor : '#EEE', margin : 5, borderRadius: 10 , padding : 5,}}
                        onPress = {()=>setSearchText(item.journey_title)}    
                            >
                            <Text>{item.journey_title}</Text>
                        </TouchableOpacity>
                        )
                    })

                    }
                </View>
            </View>
            }

            {/* { journeyAdded ? 
                <View>
                    <TagsView />
                </View> : null

            } */}
        
            {journeyProductsAdded ?
            <View style = {[addPost.sdIndividualComponent,{backgroundColor : background, flex : 1}]}>
                <Text style = {addPost.sdIndividualComponentHeader}>Existing Journeys</Text>
                <ScrollView
                    style = {{margin : 10, marginBottom : 0}}
                    contentContainerStyle = {{margin: 5,}}
                >
                    {journeyList.map((item,index)=>{
                            return(
                        <TouchableOpacity
                            key = {index.toString()}
                            style = {{marginVertical : 10, borderWidth : 1 , borderColor : "#EEE" , borderRadius : 10 , paddingVertical : 5, paddingHorizontal : 10}}
                            onPress = {()=>navigation.navigate("AppendJourney",
                                {
                                    datetime : JSON.parse(item.datetime_array) ,
                                    content :  JSON.parse(item.content) ,
                                    image : JSON.parse(item.image) ,
                                    productId : JSON.parse(item.product_id),
                                    productNames : JSON.parse(item.product_names) ,
                                    journeyId : item.journey_id ? item.journey_id : null,
                                    journeyTitle : item.journey_title
                                }
                            )}
                        >
                            <Text>{item.journey_title}</Text>
                        </TouchableOpacity>   
                            )
                        })
                    }
                             
                </ScrollView>
            </View>
            : 
            <View>
                <View style = {[addPost.sdIndividualComponent,{}]}>
                    <Text style = {addPost.sdIndividualComponentHeader}>Select Products in your journey</Text>
                    <TagsView 
                        removeFunc = {(item,index)=>removeTagFromData(item,index)}
                        data = {tagsData}/>
                    <View style = {{flexDirection : 'row', marginTop : 10, justifyContent : 'space-between', borderRadius : 20, borderWidth : 1, borderColor : '#EEE', paddingHorizontal : 5}}>
                        <TextInput style = {{fontSize : 12}}
                            ref={taginput}
                            placeholder = "Add Tags - Categories, Brands, Products, Concerns"
                            onChangeText = {(text) => searchProduct(text)}
                            value = {searchTextProduct}
                            onFocus = {()=>setInputFocus(true)}
                            onBlur = {()=>setInputFocus(false)}
                        />
                        
                        <TouchableOpacity 
                            style = {{padding : 2 , paddingLeft : 10 , paddingRight : 10,}}
                            onPress = {()=>onClickSearchItemChild(searchTextProduct)} >
                            <AntDesign name = "plus" size = {24} color = {theme} />
                        </TouchableOpacity>
                    </View>
                
                    {inputFocus ? 
                    <View style = {{ }}>
                        <TouchableHighlight 
                                    style = {addPost.productSearchResultsButton}
                                    onPress = {()=>onClickSearchItemChild('A')} >
                            <Text style = {addPost.productSearchResultsText}>A</Text>
                        </TouchableHighlight>
                        <TouchableHighlight 
                                    style = {addPost.productSearchResultsButton}
                                    onPress = {()=>onClickSearchItemChild('B')} >
                            <Text style = {addPost.productSearchResultsText}>B</Text>
                        </TouchableHighlight>
                        <TouchableHighlight 
                                    style = {addPost.productSearchResultsButton}
                                    onPress = {()=>onClickSearchItemChild('C')} >
                            <Text style = {addPost.productSearchResultsText}>C</Text>
                        </TouchableHighlight>
                    
                    </View> : null}
                        
                </View> 
                <View style = {{justifyContent : 'center', alignItems : 'center'}}> 
                    <TouchableOpacity
                        onPress = {()=>onCreateJourney(journeyName,tagsData)}
                        disabled = {tagsData.length ? false : true}
                        style = {{borderRadius : 20 , 
                            backgroundColor : tagsData.length ? theme : "#888", 
                            paddingHorizontal : 20 , paddingVertical : 10, margin : 10 }}
                        >
                        <Text style = {{color : background}}>Create Journey</Text>
                    </TouchableOpacity>  
                </View>
            </View>
            }


        </View>
    </View>

    )
}

export default AddJourney

const styles = StyleSheet.create({})
