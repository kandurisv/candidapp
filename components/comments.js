import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const Comments = (props) => {

    const navigation = useNavigation();

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
                    <Text style = {{fontWeight : '100'}}>
                        {props.content}
                    </Text>
                </View>
                <View style = {{flexDirection : 'row-reverse' , justifyContent : 'space-between', marginTop : 10,marginHorizontal : 10}}>
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
                    <TouchableOpacity style ={{flexDirection : 'row', marginRight : 20, justifyContent : 'flex-end'}}>
                        <AntDesign name = "like2" color = {"#888"} size = {15} />
                        <Text>{props.number_of_upvote}</Text>
                    </TouchableOpacity>
                </View>
                
            </View>

            <FlatList 
            keyExtractor = {(item) => item.item_id}
            data = {props.reply}
            renderItem = {({item})=> (
                <View style ={{borderBottomColor : '#EEE', borderBottomWidth : 1, marginLeft : 10, }}>
                    <View style ={{flexDirection : 'row', paddingLeft : 10,}}>
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
                    <View style ={{marginTop : 10, paddingLeft : 10,borderLeftColor : '#EEE', borderLeftWidth : 1, borderStyle : 'dotted' }}>
                        <Text style = {{fontWeight : '100'}}>
                            {props.content}
                        </Text>
                    </View>
                    <TouchableOpacity style ={{flexDirection : 'row', paddingLeft : 10,marginRight : 20, justifyContent : 'flex-start', marginTop : 10,}}>
                            <AntDesign name = "like2" color = {"#888"} size = {15} />
                            <Text>{props.number_of_upvote}</Text>
                    </TouchableOpacity>
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