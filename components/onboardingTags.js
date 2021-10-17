import React, { useEffect } from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import fontawesome from 'react-native-vector-icons/fontawesome';

// const questionData = {
//     question:"question",
//     option:["option1" , "option2" , "option3" , "option4"]
// }

const OnboardingTags = (props) => {

    const [selectedAnswer , setSelectedAnswer] = React.useState([])
    const [questionId , setQuestionId] = React.useState()


    

   const getSelectedAnswer = (item , id) =>{
        let selectedItemArray = [...selectedAnswer]
        // const index = props.option.findIndex((e)=> e==item);
        if (selectedItemArray.includes(item)){
            const index = selectedItemArray.indexOf(item);
            selectedItemArray.splice(index , 1)
            setSelectedAnswer([...selectedItemArray])
            props.selctedAnswerFunc(id ,  selectedItemArray )
        }
        else {
            // selectedItemArray.push(item)

            setSelectedAnswer([...selectedItemArray , item])
            props.selctedAnswerFunc(id ,  [...selectedItemArray , item] )
        }
        
        // console.log(id)
        
        // setQuestionId(id)
        // console.log(selectedAnswer)
        // console.log(selectedAnswer)
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
                style = {styles.tags}
                data = {props.option}
                renderItem = {({item, index})=> (
                    <TouchableOpacity
                    style = {[styles.option , selectedAnswer.includes(item) ? styles.selected : styles.unselected]}
                    onPress =  {() => getSelectedAnswer(item, props.id)}
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
        padding: 5 ,
        marginLeft:15
        // flexDirection:'row'
        // height: '20'
    },
    selected: {
        backgroundColor: 'red'
    } ,
    tags:{
        flex: 1,
        flexDirection:'row',
        flexWrap:'wrap'
    }

})

export default OnboardingTags;