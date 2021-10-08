import React from 'react';
import { StyleSheet, Text, View , Image } from 'react-native';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const DiscussionHeader = (props) => {
    return(
        <View style ={styles.container} >
            <View style ={styles.header}>
                <View style = {styles.profile}>
                    <Image
                    source={require('../img/52.png')}
                    style = {{height: 50 , width:  50 , borderRadius: 25} }
                    />
                </View>
                <View style = {styles.postinfo}>
                    <View>
                        <Text >
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
            <View style ={styles.question}>
                <Text style = {styles.questionContent}>
                    {props.content}
                </Text>
            </View>

            
            <View style ={styles.engagement}>
                <View style ={styles.upvote}>
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

                <View style ={styles.downvote}>
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

                <View style ={styles.comment}>
                    <View>
                        <Text>
                            answer
                        </Text>
                    </View>
                    <View>
                        <Text>
                            {props.number_of_answer}
                        </Text>
                    </View>
                </View>

                <View style ={styles.share}> 
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
    container: {
    //   flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginLeft: 20,
      marginTop: 15,
      marginRight:10,
      padding: 10 , 
      backgroundColor:'#ffffff'
    //   width: '80%'
    },

    header:{
        // backgroundColor:'pink',
        flexDirection:'row'
    },

    profile:{
        // flex:1
    },
    postinfo:{
        flexDirection:'column',
        // flex: 6,
        marginTop: 5,
        marginLeft: 10
    },

    questionContent:{
        // backgroundColor:'yellow'
        fontWeight:'bold', 
        fontSize:18
    },

    // answer:{
    //     backgroundColor:'green'
    // },

    engagement:{
        // flex:100,
        // backgroundColor:'red',
        flexDirection: 'row',
        padding: 5, 
        width: '100%',
        alignItems:'stretch',
        justifyContent:'space-between',
        alignContent:'space-between'
        
    },
    upvote:{
        flexDirection:'row',

    },
    downvote:{
        flexDirection:'row',

    },
    comment:{
        flexDirection:'row',

    },
    share:{
        flexDirection:'row',

    },
  })

export default DiscussionHeader;