import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image ,Keyboard , KeyboardAvoidingView, Button , ToastAndroid, Dimensions} from 'react-native';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiscussionFeed from '../components/discussionFeed';
import DiscussionHeader from '../components/discussionHeader';
import Comments from '../components/comments';
import { ScrollView, TextInput  , TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from './exports'

import axios from 'axios';
// import OnboardingQuestions from '../components/onboardingQuestion';

import { header, user } from './styles';
import { MaterialIcons } from '@expo/vector-icons';





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
        <View style = {{backgroundColor : background, flex : 1}}>
           
            <View style = {{marginLeft : 10, marginRight : 10, marginTop : 10}}>
                <FlatList
                style = {{flexDirection : 'row', flexWrap : 'wrap'}}
                data = {props.option}
                renderItem = {({item, index})=> (
                    <TouchableOpacity
                    style = {{
                        borderRadius : 20,
                        borderWidth : 1, borderColor : "#DDD",
                        paddingVertical : 10,
                        paddingHorizontal : 10,
                        marginRight : 5,
                        marginLeft : 5,
                        marginTop : 10,
                        marginBottom : 10,
                        justifyContent : 'center', alignItems : 'center',
                        backgroundColor : selectedAnswer.includes(item)  ? theme : background}}
                    
                    onPress =  {() => getSelectedAnswer(item, props.id)}
                    >
                        <Text style = {{color : selectedAnswer.includes(item)  ?   background : 'black'}}>
                            {item}
                        </Text>
                    </TouchableOpacity> 
                )}

                />
            </View>
        </View>
    )
}


const SkinOnboardingTags = () => {
    const [indicator , setIndicator] = React.useState(0)
    const [ questionData , setQuestionData] = React.useState([])
    const [ skinHairTypeQuestion , setSkinHairTypeQuestion] = React.useState([])
    const [ tagsQuestion , setTagsQuestion] = React.useState([])
    const [ skinTags, setSkinTags] = React.useState([])
    const [submitted,setSubmitted] = React.useState(false)
    const navigation  = useNavigation();


    React.useEffect(() => {
          const getTagsQuestion = () => {
            axios.get(URL + "/onboarding", {
                params: {
                 question_type: "tags"
                }
              }, {timeout : 5000})
            .then(res => res.data)
            .then(function (responseData) {
                setTagsQuestion(responseData)
            })
            .catch(function (error) {
               console.log("error: ",error);  
            })
          }
      
          getTagsQuestion()
      
    },[])



    const onSubmitOnboarding = () =>{
        const body = {
          "user_id": 917060947155,
          "question_1": answer[1],
          "question_2": answer[2],
          "question_3": answer[3],
          "question_4": answer[4],
          "question_5": answer[5] , 
          "question_6": answer[6] , 
          "question_7": answer[7] , 
          "question_8": answer[8] ,
          "question_9": answer[9] ,
          "question_10": answer[10] ,
          "question_11": answer[11] ,
          "question_12": skinTags ,
        }
    
    //    console.log("body : " , body)
    
        axios({
          method: 'post',
          url: URL + '/onboarding',
          data: body
        })
      .then(res => {
       //   console.log("reached to post feed")
          ToastAndroid.show("Thanks for adding comment", ToastAndroid.LONG)
        //   refresh()
          setTimeout(function(){
            navigation.navigate("ProductList")
          }, 300);
         
    }).catch((e) => console.log(e))
    
      }

    const [answer , setAnswer] = React.useState([]);

    const getSelectedAnswer = (id , ans) => {
         let answerArray = [...answer]
         answerArray[id] = ans
         setAnswer(answerArray)
        //  console.log(answer)
    }


    const getTagAnswer = (id , ans) => {
        setSkinTags(ans)
       //  console.log(answer)
   }
    // const [skinHairTypeANswer , setSkinHairTypeANswer] = React.useState([]);

//     const getSkinHairTypeSelectedAnswer = (id , ans) => {
//         let answerArray = [...answer]
//         answerArray[id] = ans
//         setSkinHairTypeANswer(answerArray)
//        //  console.log(answer)
//    }


const detailedQuestionnaire = () => {
    setIndicator(1)
    
}

const goToHairOnboarding = () => {
    setSubmitted(true)
    navigation.navigate("HairOnboarding")
}


    return (
        <View style = {{backgroundColor : background, flex : 1}}>

            <View style = {header.headerView}>
                <ModernHeader 
                title="Skin Attributes"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.goBack()}
                rightDisable
                />
            </View>
        
            <ScrollView>
            {tagsQuestion.length?
                <FlatList
                keyExtractor = {(item) => item.id}
                data = {tagsQuestion}
                renderItem = {({item}) =>(
                    <OnboardingTags
                        selctedAnswerFunc = {(id , ans) => getTagAnswer(id , ans) }
                        question_id = {item.id}
                        question = {item.question}
                        option = {item.option}
                        clickedAnswer = {answer[item.id]}
            />
                )
            }
            /> :null
            }
             <View style = {{ marginTop : 30, width : Dimensions.get('screen').width*0.9,
                    alignItems:'flex-end'}}>
                    <TouchableOpacity 
                            onPress = {goToHairOnboarding}
                            disabled = {submitted}
                            style = {{backgroundColor : theme , width : 40, height : 40 , borderRadius : 50, 
                            flex : 1, justifyContent : 'center' , alignItems : 'center'}}>
                        <MaterialIcons name = "navigate-next" size= {40} color = "white" />
                    </TouchableOpacity>
                </View>   
        </ScrollView>
        </View>
    )
}

export default SkinOnboardingTags

const styles = StyleSheet.create({})
