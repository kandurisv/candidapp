import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image ,Keyboard , KeyboardAvoidingView, Button , ToastAndroid, Dimensions} from 'react-native';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';

import { ScrollView, TextInput  , TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from '../exports'

import axios from 'axios';


import { header, user } from '../styles';
import { MaterialIcons } from '@expo/vector-icons';





const SkinOnboardingTagsChild = (props) => {

    const [selectedAnswer , setSelectedAnswer] = React.useState([])
    const [questionId , setQuestionId] = React.useState()
    const route = useRoute()
    

    

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
            <View style = {{marginLeft : 10, marginRight : 10, marginTop : 10 , flexDirection : 'row', flexWrap : 'wrap'}}>
                {props.option.map((item,index)=>{
                    return (
                    <TouchableOpacity
                    key = {index.toString()}
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
                    )
                })}
            </View>
        </View>
    )
}


const SkinOnboardingTags = () => {
    const [ indicator , setIndicator] = React.useState(0)
    const [ questionData , setQuestionData] = React.useState([])
    const [ skinHairTypeQuestion , setSkinHairTypeQuestion] = React.useState([])
    const [ tagsQuestion , setTagsQuestion] = React.useState([])
    const [ skinTags, setSkinTags] = React.useState([])
    const [ submitted,setSubmitted] = React.useState(false)
    const navigation  = useNavigation();
    const route = useRoute()
    const [body,setBody] = React.useState(route?.params?.body)

    React.useEffect(() => {
          const getTagsQuestion = () => {
            axios.get(URL + "/onboarding", {
                params: {
                 question_type: "skintags"
                }
              }, {timeout : 5000})
            .then(res => res.data)
            .then(function (responseData) {
                console.log("Skin tags",responseData)
                setTagsQuestion(responseData)
            })
            .catch(function (error) {
               console.log("error: ",error);  
            })
          }
      
          getTagsQuestion()
      
    },[])



 
    const [answer , setAnswer] = React.useState([]);

    const getSelectedAnswer = (id , ans) => {
         let answerArray = [...answer]
         answerArray[id] = ans
         setAnswer(answerArray)
        //  console.log(answer)
    }


    const getTagAnswer = (id , ans) => {
        setSkinTags(ans)
        setBody({...body, skin_tags : ans })
      
   }
   


const detailedQuestionnaire = () => {
    setIndicator(1)
    
}

const goToHairOnboarding = () => {
    setSubmitted(true)
    console.log("body",body)
    navigation.navigate("HairOnboarding", {body : body})
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
            {tagsQuestion.length? tagsQuestion.map((item,index)=>{
                return(<SkinOnboardingTagsChild
                        key = {index.toString()}
                        selctedAnswerFunc = {(id , ans) => getTagAnswer(id , ans) }
                        question_id = {item.id}
                        question = {item.question}
                        option = {item.option}
                        clickedAnswer = {answer[item.id]}
            />)
            }) : null}
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
