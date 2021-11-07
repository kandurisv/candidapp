import { AntDesign, Fontisto } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import axios, { Axios } from 'axios'
import { StyleSheet, Text, View , Image , TouchableOpacity, ImageBackground} from 'react-native';
import { Avatar } from 'react-native-paper';
import { theme, URL, width } from '../Screens/exports';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const TagsView = ({data}) => {

    React.useEffect(() =>{
  //   console.log("Data", data)
    },[])

    return(
    <View style = {{flexDirection : 'row', flexWrap : 'wrap', flex:1 }}>
        {data && data.map((item,index)=>{
            return(
            <TouchableOpacity 
                key={index}
                style = {{flexDirection : 'row', alignItems : 'center', marginVertical : 5, marginRight : 10, borderRadius : 5 ,paddingHorizontal : 5, paddingVertical : 5, backgroundColor : '#EEE',}}
                onPress = {()=>console.log("clicked on tag")}>
                <Text style = {{ }}>{item}</Text>
            </TouchableOpacity>)
        })}
    </View>
)}


const DiscussionHeader = (props) => {

    const [liked ,setLiked] = React.useState(props.upvote ? props.upvote : false)
    const [disliked ,setDisliked] = React.useState(props.downvote ? props.downvote : false)
    const [numberLike,setNumberLike] = React.useState(props.number_of_upvote ? props.number_of_upvote : false)
    const [numberDislike,setNumberDislike] = React.useState(props.number_of_downvote ? props.number_of_downvote : false)


    const like = () => {
        setLiked(!liked)
        if (liked) {
            setNumberLike(numberLike-1)
        } else {
            setNumberLike(numberLike+1)
        }

        const body =
        {
            "item_id": props.item_id,
            "engagement_user_id": props.engagement_user_id,
            "upvote": !liked,
            "downvote": disliked
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

    const dislike = () => {
        setDisliked(!disliked)
        if (disliked) {
            setNumberDislike(numberDislike-1)
        } else {
            setNumberDislike(numberDislike+1)
        }

        const body =
        {
            "item_id": props.item_id,
            "engagement_user_id": props.engagement_user_id,
            "upvote": liked,
            "downvote": !disliked
        }

      //  console.log(body)

        axios({
            method: 'post',
            url: URL + '/discussion/engagement',
            data: body
        }, {timeout : 5000})
        .then(res => {console.log(res)})
        .catch((e) => console.log(e))

    }



    return(
        <View  style ={{backgroundColor : 'rgba(255,255,255,0.4)', padding : 10, margin : 10,borderRadius : 20, borderColor : "#EEE" , borderWidth : 1, }}  >
            <View style ={{flexDirection : 'row'}}>
                <View style = {styles.profile}>
                {  props.profile_image && props.profile_image != "None" && props.profile_image != "" && props.profile_image != null ?
                        <Image source = {{uri : props.profile_image }} style = {{width : 30, height : 30 , borderRadius : 50 , }}/> :
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
            <View style = {{flexDirection : 'row' , marginTop:10, justifyContent : 'space-between'}}>
                <View style = {{flexDirection : 'row', marginLeft : 10,}}>
                    <TouchableOpacity 
                    disabled = {disliked}
                    onPress = {like}
                    style ={{flexDirection : 'row', marginRight : 20,}}>
                        <AntDesign name = "like2"  color = {disliked ? "#DDD" : liked ? "green" : "#888"} size = {20} />
                        <Text style = {{marginLeft : 5}}>{numberLike}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    disabled = {liked}
                    onPress = {dislike}
                    style ={{flexDirection : 'row', marginRight : 20,}}>
                        <AntDesign name = "dislike2" color = {liked ? "#DDD" : disliked ? "red" : "#888"} size = {20} />
                        <Text style = {{marginLeft : 5}}>{numberDislike}</Text>
                    </TouchableOpacity>
                </View>
                {props.number_of_answer ?
                <View style ={{flexDirection : 'row', marginRight : 20,}}>
                    <Fontisto name = "comments" color = {"#888"} size = {18} />
                    <Text>{props.number_of_answer}</Text>       
                </View> : null }
                
            </View>        
        </View>
    )
}

const styles = StyleSheet.create({
    
  })

export default DiscussionHeader;