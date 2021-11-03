import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image } from 'react-native';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native';
import DiscussionFeed from '../components/discussionFeed';
import DiscussionHeader from '../components/discussionHeader';
import Comments from '../components/comments';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from './exports'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import axios from 'axios';
import { header } from './styles';
import { FontAwesome } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';



  

const DiscussionPost = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const body = route.params.body



    const [headerData , setHeaderData] = React.useState([])
    const [answerData , setAnswerData] = React.useState([])
  
    const [loading,setLoading] = React.useState(false)
    const [error,setError] = React.useState(false)
    const [refreshing,setRefreshing] = React.useState(false)
    const [comment,setComment] = React.useState("")
    const textref = React.useRef()

    const [userName,setUserName] = React.useState("")
    const [userImage,setUserImage] = React.useState("")
    const [userId] = React.useContext(AuthContext)

    const [parentId,setParentId] = React.useState(route.params?.body.item_id)
    const [questionId,setQuestionId] = React.useState(route.params?.body.item_id)
    const [level,setLevel] = React.useState(2)


React.useEffect(() => {
    console.log("Refreshed Clicked ")
    
    const getHeaderData = () => {
        axios.get(URL + "/discussion/get_post", {
            params: {
                item_id:body.item_id,
                user_id : userId.slice(1,13)
            }
        }, {timeout : 5000})
        .then(res => res.data)
        .then(function (responseData) {
            console.log("HEADER DATA RESPONSE")
            setHeaderData(responseData)
            setLoading(false)
        })
        .catch(function (error) {
            console.log("HEADER DATA RESPONSE",error)
            setError(true);      
        })
    }

    getHeaderData()
    

  const getAnswerData = () => {
    axios.get(URL + "/discussion/answerbox", {
        params: {
         question_id:body.item_id,
         user_id : userId.slice(1,13)
        }
      }, {timeout : 5000})
    .then(res => res.data)
    .then(function (responseData) {
        console.log("ANSWER",responseData)
        setAnswerData(responseData)
        setLoading(false)
    })
    .catch(function (error) {
      setError(true);      
      console.log("Answer DATA RESPONSE",error)
    })
  }

  getAnswerData()
  
  
},[refreshing])

React.useEffect(()=>{
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

const refresh = () => {
    setRefreshing(!refreshing)
}



const replyFunc = (item) => {
    setLevel(3)
    setParentId(item.parent_id)
    setQuestionId(item.question_id)
    console.log("item", item)
    textref.current.focus()
    }




    
const submit = () => {

    const body1 = {
        "user_id": userId,
        "level": level,
        "parent_id": parentId,
        "question_id": questionId,
        "username": userName,
        "title": body.content,
        "tags": body.tags,
        "image": body.image,
        "content": comment
      }

      if(comment != "") {
        axios({
            method: 'post',
            url: URL + '/discussion/add_item',
            data: body1
        })
        .then(res => {
            console.log("Message added")
            setComment("")
            refresh()
        })
        .catch((e) => {
            ToastAndroid.show("Network Error. Please try later", ToastAndroid.SHORT)
        })
    } else {
        alert('Please enter your comment');
   }
}


    return(
        <View style = {{backgroundColor : background, flex : 1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title="Discussion Post"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.goBack()}
                rightDisable
                />
            </View>
            <ScrollView
                style = {{backgroundColor : background, }}
                >
                <View>
                    {headerData.length && headerData[0] ? 
                    <DiscussionHeader 
                        item_id = {body.item_id}
                        user_id = {body.user_id}
                        username = {body.username}
                        content = {body.content}
                        created_at = {body.created_at}
                        discussion_image = {body.discussion_image}
                        profile_image = {body.profile_image}
                        number_of_upvote = {body.number_of_upvote}
                        number_of_downvote = {body.number_of_downvote}
                        tags = {body.tags}
                        number_of_answer = {headerData[0].number_of_answer}
                        /> : null }
                
                </View>
            
                <View>
                    {answerData.length ? 
                    <FlatList 
                    keyExtractor = {(item) => item.id.toString()}
                    data = {answerData}
                    renderItem = {({item, index})=> (
                        <Comments 
                            key = {index}
                            item_id = {item.id}
                            user_id = {item.user_id}
                            question_id = {item.question_id}
                            username = {item.username}
                            created_at = {item.created_at}
                            content = {item.content}
                            discussion_image = {item.discussion_image}
                            profile_image = {item.profile_image}
                            number_of_upvote = {item.number_of_upvote}
                            number_of_downvote = {item.number_of_downvote}
                            reply = {item.reply}
                            replyFunction = {(questionData)=>replyFunc(questionData)}
                        />
                    ) }
                    /> : null}
                </View>
            </ScrollView>
            <View 
        //    onPress = {() => navigation.navigate('Input' , {level: 2 , parent_id:headerData[0].item_id , question_id:  headerData[0].item_id } )}
            style = {{flexDirection : 'row', alignItems : 'center', backgroundColor : 'rgba(255,255,255,0.6)' , margin : 10, paddingLeft : 10, borderWidth : 1, borderColor : "#EEE", borderRadius: 30 ,  }}>
                {  userImage && userImage != "None" && userImage != "" && userImage != null ?
                        <Image source = {{uri : userImage }} style = {{width : 30, height : 30 , borderRadius : 50 , }}/> :
                        userName ? 
                                <Avatar.Image 
                                source={{
                                uri: 'https://ui-avatars.com/api/?rounded=true&name='+ userName.replace(' ','+') + '&size=512'
                                }} size={30}/> :
                                <Avatar.Image 
                                source={{
                                uri: 'https://ui-avatars.com/api/?rounded=true&background=random&size=512'
                    }} size={30}/>}
                {/* <Text style = {{fontSize : 15,color : "#AAA", marginLeft : 10,}}> Add a comment</Text> */}
                <TextInput 
                    ref = {textref}
                    style={{margin : 10, flexShrink : 1, flex : 1}}
                    multiline
                    scrollEnabled
                    placeholder = {"Add a comment"}
                    onChangeText = {(val) => setComment(val) }
                    value = {comment}
                    onBlur={()=>{
                        setLevel(2)
                        setQuestionId(body.item_id)
                        setParentId(body.item_id)
                    }}
                />
                <TouchableOpacity 
                onPress = {submit}
                style = {{marginRight : 10, height : 30, width: 30, borderRadius : 30 , backgroundColor : theme, justifyContent : 'center', alignItems : 'center'}}>
                    <FontAwesome name = "send" color ="white" size = {15} />
                </TouchableOpacity>
            </View>
        </View>
    );  
}

const styles = StyleSheet.create({
    

})

export default DiscussionPost;