import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image } from 'react-native';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiscussionFeed from '../components/discussionFeed';
import DiscussionHeader from '../components/discussionHeader';
import Comments from '../components/comments';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from './exports'

import axios from 'axios';


  

const DiscussionPost = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const {item_id} = route.params



    const [headerData , setHeaderData] = React.useState([])
    const [answerData , setAnswerData] = React.useState([])
  
    const [loading,setLoading] = React.useState(false)
    const [error,setError] = React.useState(false)
    const [refreshing,setRefreshing] = React.useState(false)



React.useEffect(() => {
    console.log("item_id" ,item_id)
  const getHeaderData = () => {
    axios.get(URL + "/discussion/get_post", {
        params: {
         item_id:item_id
        }
      }, {timeout : 5000})
    .then(res => res.data)
    .then(function (responseData) {
       console.log( "headerData : ", responseData)
        setHeaderData(responseData)
        setLoading(false)
        // setFirstLoaded(true)
    })
    .catch(function (error) {
       console.log("error: ",error);
      setError(true);      
    })
  }

  setLoading(true)
  getHeaderData()

    // setLoading(false)
    setError(false)
    setRefreshing(false)

  const getAnswerData = () => {
    axios.get(URL + "/discussion/answerbox", {
        params: {
         question_id:item_id
        }
      }, {timeout : 5000})
    .then(res => res.data)
    .then(function (responseData) {
       console.log( "headerData : ", responseData)
        setAnswerData(responseData)
        setLoading(false)
        // setFirstLoaded(true)
    })
    .catch(function (error) {
       console.log("error: ",error);
      setError(true);      
    })
  }


  // setError(false)
  // setError(false)
  setLoading(true)
  getAnswerData()
  
  
},[])



    



    return(
        <View style = {styles.container}>
            <ScrollView>
            <View>
            {headerData.length && headerData[0] ? <DiscussionHeader 
                item_id = {headerData[0].item_id}
                user_id = {headerData[0].user_id}
                username = {headerData[0].username}
                content = {headerData[0].content}
                created_at = {headerData[0].created_at}
                number_of_upvote = {headerData[0].number_of_upvote}
                number_of_downvote = {headerData[0].number_of_downvote}
                number_of_answer = {headerData[0].number_of_answer}
                /> : null }
                
            </View>
            <View>

            {answerData.length ? <FlatList 
            keyExtractor = {(item) => item.item_id}
            data = {answerData}
            renderItem = {({item})=> (
                <Comments 
                    item_id = {item.id}
                    user_id = {item.user_id}
                    question_id = {item.question_id}
                    username = {item.username}
                    created_at = {item.created_at}
                    content = {item.content}
                    number_of_upvote = {item.number_of_upvote}
                    number_of_downvote = {item.number_of_downvote}
                    reply = {item.reply}
                    
                />
            ) }
            /> : null}
            </View>
            </ScrollView>
            <View style = {styles.inputarea}>
                
                <View style = {styles.profile}>
                    <Image
                    source={require('../img/52.png')}
                    style = {{height: 40 , width:  40 , borderRadius: 20 , marginTop: 5 , marginLeft: 10} }
                    />
                </View>
                <TouchableOpacity
                    onPress = {() => navigation.navigate('Input' , {level: 2 , parent_id:headerData[0].item_id , question_id:  headerData[0].item_id } )}
                    style = {styles.textinput}
                >
                    
                    <View >
                        <Text>
                            Add a comment
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            
        </View>
    );  
}

const styles = StyleSheet.create({
    
    container:{
        flex:1,
    },

    inputarea:{
        backgroundColor:'#FFFFFF',
        height: 50 , 
        flexDirection:'row',
        // flex: 1
    },

    textinput:{
        // borderColor: 'black',
        // borderWidth: 2,
        backgroundColor:'#F5F5F5',
        // position:'absolute',
        // bottom:0 , 
        height:40,
        marginTop:5,
        borderRadius: 5 ,
        width:'80%',
        marginLeft: 13 , 
        // flex: 3
    },

    // profile:{
    //     flex: 5
    // },


})

export default DiscussionPost;