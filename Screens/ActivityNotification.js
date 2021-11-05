import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import React from 'react'
import { FlatList, StyleSheet, Text, View , RefreshControl, TouchableOpacity, Image, Pressable, ToastAndroid} from 'react-native'
import { AuthContext, background, ErrorPage, LoadingPage, theme , URL } from './exports'
import {Avatar} from 'react-native-paper';
import { header1 , borderColor} from './styles'
import { ModernHeader } from "@freakycoder/react-native-header-view";

const ActivityNotification = () => {
    const [userId,userDetails, isLoggedIn] = React.useContext(AuthContext)
    const focussed = useIsFocused()
    const navigation = useNavigation()
    const [notificationsData,setNotificationsData] = React.useState([])
    const [refreshing,setRefreshing] = React.useState(false)
    const [refreshEvents,setRefreshEvents] = React.useState(false)
    const [loading,setLoading] = React.useState(false)
    const [error,setError] = React.useState(false)



    React.useEffect(() => {
        setLoading(true)
    //    console.log("Reached here")
        const getNotifications = () => {
            axios.get(URL + "/notifications/allnotifications",{params:{user_id : userId.slice(1,13) }} , {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                    console.log("ALL NOTIFICATIONS",responseData)
                    setLoading(false)
                    setNotificationsData(responseData)
                })
                .catch(function(error) {
                    setError(true)
                });
            }
        getNotifications()

        const addNotificationVisit = () => {
            const body = 
            {
                "user_id": userId.slice(1,13),
            }
            
            axios({
                method: 'post',
                url: URL + '/notifications/lastvisit',
                data: body
              })
            .then(res => {
        //        console.log("I am happy")
            }).catch((e) => console.log(e))
           
            }
        
            addNotificationVisit()

    },[focussed , refreshEvents])

    const onRefresh = () => {
        setRefreshEvents(!refreshEvents)
    }

   

   


    const onClickNotification = (type,id) => {
        //ToastAndroid.show("You can visit your activity from user profile",ToastAndroid.SHORT) 
        console.log(type,id.toString())
        if(type == "journey") {
            axios.get(URL + "/journey/getitem",{params:{journey_id : id , user_id : userId.slice(1,13)}} , {timeout : 5000})
                .then(res => res.data).then(function(responseData) {
                    console.log(responseData[0])
                    navigation.navigate("JourneyDetails",{item: responseData[0]})
                })
                .catch(function(error) {
                    console.log(error)
                    setError(true)
                });
       } else { 
           axios.get(URL + "/discussion/get_post",{params:{item_id : id , user_id : userId.slice(1,13)}} , {timeout : 5000})
            .then(res => res.data).then(function(responseData) {
           console.log(responseData[0])
           navigation.navigate("DiscussionPost",{body : responseData[0]})
        })
       .catch(function(error) {
           console.log(error)
           setError(true)
       });
             }


    }


    const items = ({item,index}) => (
        item ?
                <TouchableOpacity 
                    style = {{
                        flexDirection : 'row' , 
                        elevation : item.new_notification_indicator ? 1 : 0,
                        alignItems : 'center',
                        padding : 10,
                        marginRight : 10, 
                        marginLeft : 0,
                        borderBottomColor : '#EEE' , borderBottomWidth : 1, 
                    }}
                    onPress = {()=>onClickNotification(item.type, item.id)}
                >
                    <View style = {{marginRight : 10}}>
                     { item && item.username ? 
                                <Avatar.Image 
                                source={{
                                uri: 'https://ui-avatars.com/api/?rounded=true&size=512&background=D7354A&color=fff&bold=true&name='+ item.username.replace(' ','+') 
                                }} size={30}/> :
                                <Avatar.Image 
                                source={{
                                uri: 'https://ui-avatars.com/api/?rounded=true&size=512&background=D7354A&color=fff&bold=true&name=ELON+MUSK'
                                }} size={30}/>}
                    </View>

                    <View style = {{paddingBottom : 10, paddingTop : 10,  alignItems : 'center', }}>
                        { item.type == "journey" ?
                           <Text><Text style = {{fontWeight : 'bold'}}>{item.username}</Text> engaged on your journey - <Text style = {{fontWeight : 'bold'}}>{item.title}</Text></Text> :
                           <Text><Text style = {{fontWeight : 'bold'}}>{item.username}</Text> engaged on your discussion - <Text style = {{fontWeight : 'bold'}}>{item.title}</Text></Text>
                        }
                    </View>
                   </TouchableOpacity>    : null   
   )


    return (
        
        <View style = {{flex : 1  , backgroundColor : background }}>
            <View style = {header1.headerView}>
            <ModernHeader
                title="Activity"
                height = {50}
                titleStyle = {header1.headerText}
                backgroundColor= {'white'}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.goBack()}
                leftIconComponent = {
                  <View>
                    <Image style={{height : 30 , width : 30}}
                          source={require('../assets/LogoTransparentSolidColorLine.png')}
                      />
                  </View>
                }
                rightDisable
                />
            </View>
            {error ? <ErrorPage /> : loading ? <LoadingPage /> :
            <FlatList 
                keyExtractor={item => item.noti_id.toString()} 
                style = {{paddingRight : 5}}
                contentContainerStyle = {{paddingRight : 5}}
                showsVerticalScrollIndicator={false}
                data = {notificationsData}            
                renderItem = {items}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />}
        </View>
    )
}

export default ActivityNotification

const styles = StyleSheet.create({})
