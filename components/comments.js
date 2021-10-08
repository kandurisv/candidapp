import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const Comments = (props) => {

    const navigation = useNavigation();

    // const [parentId , setPartentId] = React.useState()
    // const [questionId , SetQuestionId] = React.useState()

    // setPartentId(props.id)
    // SetQuestionId(props.question_id)

    const questionData = {
        "parent_id": props.item_id,
        "question_id": props.question_id
        
    }

    return(
        <View style ={styles.container} >
            <View style ={styles.answer}>
                <View style ={styles.header}>
                    <View style = {styles.profile}>
                        <Image
                        source={require('../img/52.png')}
                        style = {{height: 30 , width:  30 , borderRadius: 15} }
                        />
                    </View>
                    <View style = {styles.postinfo}>
                        <View>
                            <Text>
                                {props.username}
                            </Text>
                        </View>
                        <View>
                            <Text>
                                6h ago
                            </Text>
                        </View>
                    </View>
                    
                </View>
                <View style = {styles.content}>
                    <Text>
                    {props.content}
                    </Text>
                </View>
                <View style = {styles.like}>
                    <Text >
                        like
                    </Text>
                    <Text>
                        2
                    </Text>
                </View>
            </View>

            <FlatList 
            keyExtractor = {(item) => item.item_id}
            data = {props.reply}
            renderItem = {({item})=> (
                <View style ={styles.reply}>
                <View style ={styles.header}>
                    <View style = {styles.profile}>
                        <Image
                        source={require('../img/52.png')}
                        style = {{height: 30 , width:  30 , borderRadius: 15 } }
                        />
                    </View>
                    <View style = {styles.postinfo}>
                        <View>
                            <Text>
                                {item.username}
                            </Text>
                        </View>
                        <View>
                            <Text>
                                6h ago
                            </Text>
                        </View>
                    </View>
                    
                </View>
                <View style = {styles.content}>
                    <Text>
                        {item.content}
                    </Text>
                </View>
                <View style = {styles.like}>
                    <Text >
                        like
                    </Text>
                    <Text>
                        {item.number_of_upvote}
                    </Text>
                </View>
            </View>
            ) }
            />

            
            <View style ={styles.engagement}>
                <View style ={styles.buttonCount}>
                    <View>
                        <Text>
                            +
                        </Text>
                    </View>
                    <View>
                        <Text>
                            {props.number_of_upvote}
                        </Text>
                    </View>
                </View>

                <View style ={styles.buttonCount}>
                    <View>
                        <Text>
                            -
                        </Text>
                    </View>
                    <View>
                        <Text>
                            {props.number_of_downvote}
                        </Text>
                    </View>
                </View>

                <View style ={styles.buttonCount}>
                    <TouchableOpacity
                        onPress = {() => navigation.navigate('Input' , {level: 3 , parent_id: questionData.parent_id , question_id:  questionData.question_id } )}
                    
                    >
                        <Text>
                            reply
                        </Text>
                    </TouchableOpacity>
                    {/* <View>
                        <Text>
                            4
                        </Text>
                    </View> */}
                </View>

                <View style ={styles.buttonCount}> 
                    <View>
                        <Text>
                            share
                        </Text>
                    </View>
                    <View>
                        <Text>
                            4
                        </Text>
                    </View>
                </View>
            </View>
            
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