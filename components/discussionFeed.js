import React from 'react';
import { StyleSheet, Text, View , Image , TouchableOpacity, ImageBackground } from 'react-native';
// import fontawesome from 'react-native-vector-icons/fontawesome';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { addPost } from '../Screens/styles';
import { theme, width } from '../Screens/exports';
import {Avatar} from 'react-native-paper';
import moment from 'moment';


const TagsView = ({data}) => {

    React.useEffect(() =>{
        console.log("Data", data)
    },[])

    return(
    <View style = {{flexDirection : 'row', flexWrap : 'wrap', flex:1 }}>
        {data.map((item,index)=>{
            return(
            <TouchableOpacity 
                key={index.toString()}
                style = {{flexDirection : 'row', alignItems : 'center', marginVertical : 5, marginRight : 10, borderRadius : 5 ,paddingHorizontal : 5, paddingVertical : 5, backgroundColor : '#EEE',}}
                onPress = {()=>console.log("clicked on tag")}>
                <Text style = {{ }}>{item}</Text>
            </TouchableOpacity>)
        })}
    </View>
)}



const DiscussionFeed = (props) => {

    const navigation = useNavigation()

    return(
        
        <TouchableOpacity
        onPress={() => navigation.navigate('DiscussionPost' , {body: props})}
        style ={{backgroundColor : 'rgba(255,255,255,0.6)', padding : 10, margin : 10,borderRadius : 20, borderColor : "#EEE" , borderWidth : 1, }} >

            
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
            <View>
                <TagsView data = {props.tags} />
            </View>
            <View style ={{marginTop : 10,}}>
                <Text style = {{fontWeight : 'bold'}}>
                    {props.content}
                </Text>
            </View>

            <View style = {{justifyContent : 'center', alignItems : 'center' , marginVertical : 10,}}>
            { props.discussion_image && props.discussion_image != "None" && props.discussion_image != "" && props.discussion_image != null?
                <ImageBackground source = {{uri : props.discussion_image + "?" + new Date()}} style = {{width : width*0.8, height : width*0.6 }} ></ImageBackground> : null
            }
             
            </View>

            <View style ={{marginTop : 5,}}>
                <Text>
                    {props.answer}
                </Text>
            </View>
            
            <View style = {{flexDirection : 'row' , marginTop:10, justifyContent : 'space-evenly'}}>
                <View style ={{flexDirection : 'row', marginRight : 20,}}>
                    <AntDesign name = "like2" color = {"#888"} size = {20} />
                    <Text>{props.number_of_upvote}</Text>
                </View>
                <View style ={{flexDirection : 'row', marginRight : 20,}}>
                    <AntDesign name = "dislike2" color = {"#888"} size = {20} />
                    <Text>{props.number_of_downvote}</Text>
                </View>
                <View style ={{flexDirection : 'row', marginRight : 20,}}>
                    <Fontisto name = "comments" color = {"#888"} size = {18} />
                    <Text> 4</Text>       
                </View>
                <View style ={{flexDirection : 'row', marginRight : 20,}}> 
                    <AntDesign name = "sharealt" color = {"#888"} size = {20} />
                    <Text> 4 </Text>   
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
   
  })

export default DiscussionFeed;