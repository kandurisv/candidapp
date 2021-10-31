import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import React from 'react'
import { FlatList, ScrollView, ScrollViewBase, StyleSheet, Text, View, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Avatar } from 'react-native-paper'
import { AuthContext, background, borderColor, contrastLightTheme, contrastTheme, LoadingPage, neutralTheme, theme, URL, width } from './exports'
import { feed, header1 } from './styles'

const JourneyDetails = () => {

    const navigation = useNavigation()
    const route= useRoute()
    const {item} = route.params;
    const [data,setData] = React.useState({})

    const [userId] = React.useContext(AuthContext)
    const [instagramUsername,setInstagramUsername] = React.useState("")

    const [dataNotPulledError,setDataNotPulledError] = React.useState(false)

    const [contentObject,setContentObject] = React.useState({})
    



    React.useEffect(() =>{
        console.log("USER ID", userId)
        console.log("ITEM",item)
      
      
    
        const getInstaUser = () => {
            //   console.log("Username click")
               axios.get(URL + "/user/instagram", {params:{user_id : userId.slice(1,13) }} , {timeout : 5000})
               .then(res => res.data)
               .then(async function(responseData) {
                  // console.log("INSTA USER ", responseData)
                   if (responseData.length && responseData[0].instagram_username) {
                       setInstagramUsername(responseData[0].instagram_username);
                   }
               })
               .catch(function(error) {
                    
               });
           }
    
        getInstaUser()

        const getContent = () => {
            //   console.log("Username click")
               axios.get(URL + "/journey/getitem", {params:{journey_id : item.journey_id }} , {timeout : 5000})
               .then(res => res.data)
               .then(async function(responseData) {
                   if (responseData.length) {
                       console.log("Content", responseData)
                       setData(responseData[0]);
                   }
               })
               .catch(function(error) {
                   console.log(error)
               });
           }
    
        getContent()    
           
        },[])
    
    const getFeedByUser = () => {

    }

    const individualJourney = ({item,index}) => (
        (item.username) ?
          <View key = {index}>     
            
          </View> : null
        )
    
    
    return (
        <View style = {{flex : 1, backgroundColor : background,}}> 
            <View style = {{ marginTop: 20, height : 50, flexDirection : 'row', height : 40 , alignItems : 'center' }}> 
                <TouchableOpacity style = {{paddingLeft : 10,alignItems : 'center'}} onPress = {()=>navigation.goBack()}>
                    <MaterialCommunityIcons name = "keyboard-backspace" size = {25} color = {"#222"} />
                </TouchableOpacity>
                <View 
                    style = {{flex:1 , flexDirection : 'row',justifyContent : 'center' , alignItems : 'center' , marginRight : 20 }}>
                    <TouchableOpacity
                        style = {{flexDirection : 'row'}} onPress = {getFeedByUser}>
                        
                        <Text style = {{marginLeft : 5, fontWeight : 'bold', fontSize : 16}}>{item.journey_title}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style = {feed.mainContainer}>
                {dataNotPulledError ? 
                <View><Text>Error while loading data 😢</Text></View> : 
                <View style = {{margin : 10}}>    
                    <View style = {{flexDirection : 'row' , justifyContent : 'space-between',alignItems : 'center'}}>
                        <View style = {{flexDirection : 'row', alignItems : 'center'}}>
                        {  item.profile_image && item.profile_image != "None" && item.profile_image != "" ?
                        <Image source = {{uri : item.profile_image}} style = {{width : 28, height : 28 , borderRadius : 28 , marginTop : 5 , marginLeft : 5  }}/> :
                        <Avatar.Image
                            style = {{marginTop : 5 , marginLeft : 5 , }}
                            source={{uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.username + '&size=64&background=D7354A&color=fff&bold=true'
                            }} 
                            size={28}
                        /> }
                            <Text style = {{fontWeight : 'bold', fontSize : 16 , marginLeft : 10}}>{item.username}</Text>
                        </View>
                        <AntDesign name = "instagram" size = {20} color = {theme} />
                    </View>
                    <View style = {{flexDirection : 'row' , flexWrap : 'wrap', marginTop : 10 , borderBottomColor : "#EEE" ,borderBottomWidth : 1 }}>
                        {item.product_names.map((name,index)=>{
                            return(
                            <View style = {{borderWidth : 1, paddingVertical : 2, paddingHorizontal : 5, borderColor : "#EEE", borderRadius : 10 , marginRight : 10,marginTop : 5, marginBottom : 5, backgroundColor : contrastTheme }}>
                                <Text style = {{fontStyle : 'italic', fontWeight : '500' , color : 'white'}}>{name}</Text>
                            </View>
                            )
                            })
                        }
                    </View>    
                    <ScrollView>
                    {item.datetime_array.map((idate,index)=>{

                        return(
                            <View style = {{marginVertical : 10 , paddingVertical : 10 , backgroundColor : 'white' , borderRadius : 10 , borderColor : '#EEE', borderWidth : 1,  }} >
                                <View style = {{justifyContent : 'flex-start', alignItems : 'flex-start', flex : 1,  paddingLeft : 20 }}>
                                    <Text style = {{fontSize : 20 , fontWeight : 'bold'}}>{idate}</Text>
                                </View>
                                {item.image[idate] && item.image[idate] != ""? 
                                <View style = {{justifyContent : 'center', alignItems : 'center' , marginVertical : 10}}>
                                    <View style = {{  borderWidth : 1, borderColor : "#DDD" , borderRadius : 20,width : width*0.89, height : width * 0.67}}>
                                        <Image style = {{width : width*0.88, height : width * 0.66 , borderRadius : 20,}} source = {{uri: item.image[idate] ? item.image[idate] : "No Image"}}/>
                                    </View>
                                </View>
                                 : null
                                }
                                <View style = {{paddingLeft : 20}}>
                                    <Text>{data && data.content ?data.content[idate] : ""}</Text> 
                                </View>
                            </View>
                        )
                    })}
                    </ScrollView>
                </View> 
                }
            </View>
        </View>
    )
}

export default JourneyDetails

const styles = StyleSheet.create({})
