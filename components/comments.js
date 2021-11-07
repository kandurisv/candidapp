import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { Avatar } from 'react-native-paper';
// import fontawesome from 'react-native-vector-icons/fontawesome';
import axios from 'axios'
import { URL } from '../Screens/exports';


const Comments = (props) => {

    const navigation = useNavigation();
    const [liked ,setLiked] = React.useState(props.upvote ? props.upvote : false)
    const [numberLikes,setNumberLikes] = React.useState(props.number_of_upvote ? props.number_of_upvote : 0)
    const like = () => {
        
        if (liked && numberLikes > 0) {
            setLiked(false)
            setNumberLikes(numberLikes-1)
        } else {
            setLiked(true)
            setNumberLikes(numberLikes+1)
        }

        const body =
        {
            "item_id": props.item_id,
            "engagement_user_id": props.engagement_user_id,
            "upvote": !liked,
            "downvote": null
        }

        axios({
            method: 'post',
            url: URL + '/discussion/engagement',
            data: body
          }, {timeout : 5000})
        .then(res => {
         //   console.log(res)
        }).catch((e) => console.log(e))
    }

    // const commentLike = (id) => {
        

    //     const body =
    //     {
    //         "item_id": props.item_id,
    //         "engagement_user_id": props.engagement_user_id,
    //         "upvote": !liked,
    //         "downvote": null
    //     }

    //     axios({
    //         method: 'post',
    //         url: URL + '/discussion/engagement',
    //         data: body
    //       }, {timeout : 5000})
    //     .then(res => {
    //      //   console.log(res)
    //     }).catch((e) => console.log(e))
    // }


    const questionData = {
        "parent_id": props.item_id,
        "question_id": props.question_id
    }

    const onClickReply = (questionData) => {
        props.replyFunction(questionData)
    }

    return(
        <View style ={{backgroundColor : 'rgba(255,255,255,0.6)', margin : 10,marginTop : 0,borderRadius : 20, padding : 10, borderWidth : 1 , borderColor : '#EEE'}} >
            <View style ={{borderBottomWidth : 1 , borderBottomColor : "#EEE" , paddingBottom : 10,marginBottom : 10 }}>
                <View style ={{flexDirection : 'row'}}>
                    <View style = {styles.profile}>
                    {  props.profile_image && props.profile_image != "None" && props.profile_image != "" && props.profile_image != null ?
                        <Image source = {{uri : props.profile_image + "?" + new Date()}} style = {{width : 30, height : 30 , borderRadius : 50 , }}/> :
                        props.username ? 
                                <Avatar.Image 
                                source={{
                                uri: 'https://ui-avatars.com/api/?rounded=true&name='+ props.username.replace(' ','+') + '&size=512'
                                }} size={30}/> :
                                <Avatar.Image 
                                source={{
                                uri: 'https://ui-avatars.com/api/?rounded=true&background=random&size=512'
                    }} size={30}/>}
                    </View>
                    <View style = {{flex : 1,flexDirection : 'row', marginLeft : 10, marginRight : 10, justifyContent : 'space-between', alignItems:'center'}}>
                        <Text style = {{fontWeight : 'bold'}}>{props.username}</Text>
                        <Text style = {{fontStyle : 'italic'}}>{moment(props.created_at,"YYYY-MM-DD hh:mm:ss").add(5,'hours').add(30, 'minutes').fromNow()}</Text>
                    </View>
                </View>
                
                <View style ={{marginTop : 10,}}>
                    <Text style = {{fontWeight : '100'}}>
                        {props.content}
                    </Text>
                </View>
                <View style = {{flexDirection : 'row-reverse' , justifyContent : 'space-between', marginTop : 10,marginHorizontal : 10 , paddingBottom: 5}}>
                    <TouchableOpacity
                      //  onPress = {() => navigation.navigate('Input' , {level: 3 , parent_id: questionData.parent_id , question_id:  questionData.question_id } )}
                      onPress = {()=>onClickReply(questionData)}  
                      style = {{flexDirection : 'row', paddingHorizontal : 5, justifyContent : 'center', alignItems: 'center'}}
                    >
                        <View style = {{justifyContent : 'center', alignItems: 'center', marginLeft : 5}}>
                            <MaterialCommunityIcons name = "comment-processing-outline" color = "#888" size = {18} />
                        </View>
                        <View style = {{justifyContent : 'center', alignItems: 'center', marginLeft : 5}}>
                            <Text style = {{color : "#888"}}>Reply</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress = {like}
                    style ={{flexDirection : 'row', marginRight : 20, justifyContent : 'flex-end', alignItems : 'center'}}>
                        <AntDesign name = "like2" color = {liked ? "green" :"#888"} size = {15} />
                        <Text style = {{paddingLeft : 5}}>{numberLikes}</Text>
                    </TouchableOpacity>
                </View>
                
            </View>

            <FlatList 
            listKey = {(item,index)=>index.toString()}
            keyExtractor = {(item,index)=>index.toString()}
            data = {props.reply}
            renderItem = {({item})=> (
                <View style ={{borderBottomColor : '#EEE', borderBottomWidth : 1, marginLeft : 10, marginTop : 10 }}>
                    <View style ={{flexDirection : 'row', paddingLeft : 10,}}>
                        <View style = {styles.profile}>
                        {  item.profile_image && item.profile_image != "None" && item.profile_image != "" && item.profile_image != null ?
                        <Image source = {{uri : item.profile_image + "?" + new Date()}} style = {{width : 30, height : 30 , borderRadius : 50 , }}/> :
                        item.username ? 
                                <Avatar.Image 
                                source={{
                                uri: 'https://ui-avatars.com/api/?rounded=true&name='+ item.username.replace(' ','+') + '&size=512'
                                }} size={30}/> :
                                <Avatar.Image 
                                source={{
                                uri: 'https://ui-avatars.com/api/?rounded=true&background=random&size=512'
                    }} size={30}/>}
                        </View>
                        <View style = {{flex : 1,flexDirection : 'row', marginLeft : 10, marginRight : 10, justifyContent : 'space-between', alignItems:'center'}}>
                            <Text style = {{fontWeight : 'bold'}}>{item.username}</Text>
                            <Text style = {{fontStyle : 'italic'}}>{moment(item.created_at,"YYYY-MM-DD hh:mm:ss").add(5,'hours').add(30, 'minutes').fromNow()}</Text>
                        </View>
                    </View>
                    <View style ={{marginTop : 10, paddingLeft : 10,borderLeftColor : '#EEE', borderLeftWidth : 1, borderStyle : 'dotted' , paddingBottom : 10, }}>
                        <Text style = {{fontWeight : '100'}}>
                            {item.content}
                        </Text>
                    </View>
                    {/* <TouchableOpacity 
                    onPress = {()=>commentLike(item.id)}
                    style ={{flexDirection : 'row', paddingLeft : 10,marginRight : 20, justifyContent : 'flex-start', marginTop : 10,}}>
                            <AntDesign name = "like2" color = {"#888"} size = {15} />
                            <Text style = {{marginLeft : 5, }}>{item.number_of_upvote}</Text>
                    </TouchableOpacity> */}
                </View>
            ) }
            />

          
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'red',
        marginTop: 10,
        marginLeft: 20,
        marginRight: 10,
        padding: 10,
        backgroundColor:'#FFFFFF'
    },
    header:{
        // backgroundColor:'pink',
        flexDirection:'row'
    },
    like:{
        // backgroundColor:'yellow',
        flexDirection:'row',
        // alignContent:'flex-end',
        justifyContent:'flex-end',
        marginRight:5,
        padding: 5
    },
    engagement:{
        // flex:100,
        // backgroundColor:'red',
        flexDirection: 'row',
        padding: 5, 
        width: '100%',
        alignItems:'stretch',
        justifyContent:'space-between',
        alignContent:'space-between',
        
    },
    buttonCount:{
        flexDirection:'row'
    } ,
    reply:{
        marginLeft: 10,
    } , 
    postinfo :{
        marginLeft: 10
    }
  })

export default Comments;