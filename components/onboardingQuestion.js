import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import fontawesome from 'react-native-vector-icons/fontawesome';

// const questionData = {
//     question:"question",
//     option:["option1" , "option2" , "option3" , "option4"]
// }

const OnboardingQuestions = (props) => {

    const [selectedAnswer , setSelectedAnswer] = React.useState()
    const [questionId , setQuestionId] = React.useState()
    getSelectedAnswer = (item , id) =>{
        setSelectedAnswer(item)
        // console.log(id)
        props.selctedAnswerFunc(id , item)
        setQuestionId(id)

    }



    return(
        <View style = {styles.container}>
            <View>
                <Text style = {{fontWeight:'bold' , fontSize: 15}}>
                    {props.question}
                </Text>
            </View>
            <View>
                <FlatList
                data = {props.option}
                renderItem = {({item})=> (
                    <TouchableOpacity
                    style = {[styles.option , item == props.clickedAnswer  ? styles.selected : styles.unselected]}
                    onPress =  {() => getSelectedAnswer(item, props.question_id)}
                    >
                        <Text>
                            {item}
                        </Text>
                    </TouchableOpacity> 
                )}

                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        margin: 10 , 
        padding: 5
    } ,
    option:{
        marginTop: 5,
        borderRadius: 1,
        elevation: 1,
        alignSelf: 'flex-start',
        borderRadius: 15 , 
        padding: 5 
        // height: '20'
    },
    selected: {
        backgroundColor: 'red'
    }

})

export default OnboardingQuestions;