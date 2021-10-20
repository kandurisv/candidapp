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


  

const DiscussionPost = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const {item_id} = route.params



    const [headerData , setHeaderData] = React.useState([])
    const [answerData , setAnswerData] = React.useState([])
  
    const [loading,setLoading] = React.useState(false)
    const [error,setError] = React.useState(false)
    const [refreshing,setRefreshing] = React.useState(false)
    const [comment,setComment] = React.useState("")
    const textref = React.useRef()


    



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
   //    console.log( "headerData : ", responseData)
        setHeaderData(responseData)
        setLoading(false)
        // setFirstLoaded(true)
    })
    .catch(function (error) {
   //    console.log("error: ",error);
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
    //   console.log( "headerData : ", responseData)
        setAnswerData(responseData)
        setLoading(false)
        // setFirstLoaded(true)
    })
    .catch(function (error) {
   //    console.log("error: ",error);
      setError(true);      
    })
  }


  // setError(false)
  // setError(false)
  setLoading(true)
  getAnswerData()
  
  
},[])


const replyFunc = (item) => {
    console.log("item", item)
    textref.current.focus()
    }
    
const submit = () => {

}


    return(
        <View style = {{backgroundColor : background, flex : 1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title="Discussion Post"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.navigate("Home")}
                rightDisable
                />
            </View>
            <ScrollView
                style = {{backgroundColor : background, }}
                >
                <View>
                    {headerData.length && headerData[0] ? 
                    <DiscussionHeader 
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
                    {answerData.length ? 
                    <FlatList 
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
                            replyFunction = {(questionData)=>replyFunc(questionData)}
                        />
                    ) }
                    /> : null}
                </View>
            </ScrollView>
            <View 
        //    onPress = {() => navigation.navigate('Input' , {level: 2 , parent_id:headerData[0].item_id , question_id:  headerData[0].item_id } )}
            style = {{flexDirection : 'row', alignItems : 'center', backgroundColor : 'rgba(255,255,255,0.6)' , margin : 10,borderWidth : 1, borderColor : "#EEE", borderRadius: 20 ,  }}>
                <Image
                    source={require('../img/52.png')}
                    style = {{height: 40 , width:  40 , marginLeft : 5, borderRadius: 25 } }
                />
                {/* <Text style = {{fontSize : 15,color : "#AAA", marginLeft : 10,}}> Add a comment</Text> */}
                <TextInput 
                    ref = {textref}
                    style={{margin : 10, flexShrink : 1, flex : 1}}
                    multiline
                    scrollEnabled
                    placeholder = {"Add a comment"}
                    onChangeText = {(val) => setComment(val) }
                />
                <TouchableOpacity 
                onPress = {submit}
                style = {{marginRight : 5, height : 30, width: 30, borderRadius : 30 , backgroundColor : theme, justifyContent : 'center', alignItems : 'center'}}>
                    <FontAwesome name = "send" color ="white" size = {15} />
                </TouchableOpacity>
            </View>
        </View>
    );  
}

const styles = StyleSheet.create({
    

})

export default DiscussionPost;