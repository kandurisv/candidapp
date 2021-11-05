import React from 'react'
import { RefreshControl, StyleSheet, Text, View , TouchableOpacity, FlatList} from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header } from './styles';
import { useNavigation } from '@react-navigation/native';
import { background,borderColor, theme , AuthContext  , URL} from './exports';
import { LinearGradient } from 'expo-linear-gradient';

import axios from 'axios'
import DiscussionFeed from '../components/discussionFeed'

const MyDiscussions = () => {

    const [discussionFeedData,setDiscussionFeedData] = React.useState([])
    const [loading,setLoading] = React.useState(false)
    const [error,setError] = React.useState(false)
    const [userId] = React.useContext(AuthContext)
    const [refreshing,setRefreshing] = React.useState(false)


    
    React.useEffect(()=>{
        const getDiscussionFeed = () => {
            axios.get(URL + "/userinfo/discussion", {
                params: {
                  user_id : userId.slice(1,13)
                }
              }, {timeout : 5000})
            .then(res => res.data)
            .then(function (responseData) {
                console.log(responseData)
            //    console.log(error)
                setDiscussionFeedData(responseData)
                setLoading(false)
                // setFirstLoaded(true)
            })
            .catch(function (e) {
              console.log("error: ",e);
              setError(true);      
            })
          }
          getDiscussionFeed()

    },[])
    

    const onRefresh = () => {

    }

    const navigation = useNavigation()
    return (
        <View style = {{backgroundColor : background, flex:1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title="My Discussions"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.navigate("UserDetails")}
                rightDisable
                />
            </View>
            {error ? 
            <View style = {{flex : 1 , justifyContent : 'center' , alignItems : 'center'}}>
              <Text>Error</Text>
            </View> :
            loading ? 
            <LoadingPage /> : 
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
                upvote = {item.upvote}
                downvote = {item.downvote}
                engagement_user_id = {userId.slice(1,13)}
                />
            ) }
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />

          }
      
        </View>
    )
}

export default MyDiscussions

const styles = StyleSheet.create({})
