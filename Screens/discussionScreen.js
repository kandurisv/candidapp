import React from 'react';
import { StyleSheet, Text, View  , Image,TouchableOpacity , FlatList , ScrollView} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiscussionFeed from '../components/discussionFeed';
import axios from 'axios';

import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from './exports'
import { header1 } from './styles';
import { ModernHeader } from "@freakycoder/react-native-header-view";



export default function DiscussionScreen({navigation}){


  const [discussionFeedData , setDiscussionFeedData] = React.useState([])
  
  const [loading,setLoading] = React.useState(false)
  const [error,setError] = React.useState(false)
  const [refreshing,setRefreshing] = React.useState(false)



React.useEffect(() => {

  const getDiscussionFeed = () => {
    axios.get(URL + "/discussion/feed", {
        params: {
        // user_id : userId.slice(1,13)
        }
      }, {timeout : 5000})
    .then(res => res.data)
    .then(function (responseData) {
      //  console.log(responseData)
        setDiscussionFeedData(responseData)
        setLoading(false)
        // setFirstLoaded(true)
    })
    .catch(function (error) {
      //  console.log("error: ",error);
      setError(true);      
    })
  }


  // setError(false)
  setLoading(true)
  getDiscussionFeed()
  
},[])



    return(
      <View style = {{backgroundColor: background, flex : 1}}>
        <View style = {header1.headerView}>
            <ModernHeader
                title="Discuss"
                height = {50}
                titleStyle = {header1.headerText}
                backgroundColor= {background}
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
            <FlatList 
            style = {{marginBottom : 120,}}
            contentContainerStyle = {{}}
            keyExtractor = {(item) => item.item_id.toString()}
            data = {discussionFeedData}
            showsVerticalScrollIndicator = {false}
            renderItem = {({item,index})=> (
                <DiscussionFeed 
                key={index.toString()}
                item_id = {item.item_id}
                user_id = {item.user_id}
                level = {item.level}
                username = {item.username}
                content = {item.content}
                created_at = {item.created_at}
                number_of_upvote = {item.number_of_upvote}
                number_of_downvote = {item.number_of_downvote}
                answer = {item.answer}
                tags = {item.tags}
                discussion_image = {item.discussion_image}
                profile_image = {item.profile_image}
                />
            ) }
            />

            
      
        </View>
    );  
}


