import { AntDesign, Fontisto } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View , Image } from 'react-native';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const DiscussionHeader = (props) => {
    return(
        <View  style ={{backgroundColor : 'rgba(255,255,255,0.4)', padding : 10, margin : 10,borderRadius : 20, borderColor : "#EEE" , borderWidth : 1, }}  >
            <View style ={{flexDirection : 'row'}}>
                <View style = {styles.profile}>
                    <Image
                    source={require('../img/52.png')}
                    style = {{height: 30 , width:  30 , borderRadius: 50} }
                    />
                </View>
                <View style = {{flex : 1,flexDirection : 'row', marginLeft : 10, marginRight : 10, justifyContent : 'space-between', alignItems:'center'}}>
                    <Text style = {{fontWeight : 'bold'}}>{props.username}</Text>
                    <Text style = {{fontStyle : 'italic'}}> 6h ago</Text>
                </View>
            </View>
            
            <View style ={{marginTop : 10,}}>
                <Text style = {{fontWeight : 'bold'}}>
                    {props.content}
                </Text>
            </View>

            <View>
                <Text>Image</Text>
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
        </View>
    )
}

const styles = StyleSheet.create({
    
  })

export default DiscussionHeader;