import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image ,Keyboard , KeyboardAvoidingView, Button , ToastAndroid} from 'react-native';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiscussionFeed from '../components/discussionFeed';
import DiscussionHeader from '../components/discussionHeader';
import Comments from '../components/comments';
import { ScrollView, TextInput  , TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from './exports'

import axios from 'axios';




const Input = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const {level} = route.params;
  const {parent_id} = route.params;
  const {question_id} = route.params;
  
  
  const [content , setContent] = React.useState("");

  // React.useEffect(() =>{

  // })

  const onSubmitComment = () =>{
    const body = {
      "user_id": 917060947121,
      "level": level,
      "parent_id": parent_id,
      "question_id": question_id,
      "username": "ankit",
      "content": content
    }

    console.log("body : " , body)

    axios({
      method: 'post',
      url: URL + '/discussion/add_item',
      data: body
    })
  .then(res => {
   //   console.log("reached to post feed")
      ToastAndroid.show("Thanks for adding comment", ToastAndroid.LONG)
      refresh()
      setTimeout(function(){
        navigation.navigate("Home")
      }, 300);
     
}).catch((e) => console.log(e))

  }



    return(
        <View style = {styles.container}>
            
              <TextInput
                style={styles.textInput}
                multiline={true}
                numberOfLines={6}
                scrollEnabled={true} 
                placeholder = 'Your Comment'
                onChangeText = {(val) => setContent(val) }
                />

                <View>
                  <Button
                    title = "Submit"
                    onPress = {onSubmitComment}
                  />
                </View>
        </View>
    );  
}

const styles = StyleSheet.create({
    
    container:{
        // flex:1,
    },
    
      textInput: { 
        // flex: 1,
        // borderColor: "#000000",
        // borderWidth: 1,
        // marginBottom: 36,
      },

})

export default Input;