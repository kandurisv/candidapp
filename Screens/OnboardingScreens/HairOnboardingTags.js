import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image ,Keyboard , KeyboardAvoidingView, Button , ToastAndroid, Dimensions} from 'react-native';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';

import { ScrollView, TextInput  , TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from '../exports'

import axios from 'axios';

import { header, user } from '../styles';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';





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


const HairOnboardingTags = () => {
    const [ indicator , setIndicator] = React.useState(0)
    const [ questionData , setQuestionData] = React.useState([])
    const [ skinHairTypeQuestion , setSkinHairTypeQuestion] = React.useState([])
    const [ tagsQuestion , setTagsQuestion] = React.useState([])
    const [ hairTags, setHairTags] = React.useState([])
    const [ submitted,setSubmitted] = React.useState(false)
    const navigation  = useNavigation();
    const route = useRoute()
    const [body,setBody] = React.useState(route.params?.body ? route.params?.body : {})
    const [userId, userDetails, isLoggedIn] = React.useContext(AuthContext)

    React.useEffect(() => {
          const getTagsQuestion = () => {
            axios.get(URL + "/onboarding", {
                params: {
                 question_type: "hairtags"
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
        var expoToken = AsyncStorage.getItem('expoToken')
        var deviceToken = AsyncStorage.getItem('deviceToken')
        const userbody = {
            "var" : body.var,
            "user_id": userId.slice(1,13),
            "username": body.username,
            "gender": body.gender,
            "dob": body.dob,
            "email": "",
            "phone_number": userId,
            "location": "",
            "expo_token" : body.expo_token,
            "device_token" : body.device_token,
            "instagram_username" : body.instagram_username
        }

        const onboardingBody = {
            "var" : body.var,
            "user_id": userId.slice(1,13),
            "skin_answer_quiz": body.skin_answer_quiz,
            "skin_answer_primary": body.skin_answer_primary,
            "hair_answer_quiz": body.hair_answer_quiz,
            "hair_answer_primary": body.hair_answer_primary,
            "skin_tags":body.skin_tags,
            "hair_tags": body.hair_tags
          }

      console.log("USER BODY",userbody)
      console.log("BODY",onboardingBody)

    axios({
    method: 'post',
    url: URL + '/user/info',
    data: userbody
    })
    .then(res => {
        console.log("USER", res)
        ToastAndroid.show("Hi " + body.username, ToastAndroid.SHORT)
        axios({
            method: 'post',
            url: URL + '/onboarding',
            data: onboardingBody
          })
            .then(res => {
                console.log("ONBOARDING",res)
                ToastAndroid.show("Thank you for onboarding", ToastAndroid.LONG)
                setTimeout(function(){
                navigation.navigate("Home", {source : "Onboarding"})
                }, 300);      
            }).catch((e) => console.log(e))
        }).catch((e) => {
            ToastAndroid.show("Error updating details. Please try later")
            setSubmitted(false)
        })
    }

    const [answer , setAnswer] = React.useState([]);

    const getSelectedAnswer = (id , ans) => {
         let answerArray = [...answer]
         answerArray[id] = ans
         setAnswer(answerArray)
        //  console.log(answer)
    }


    const getTagAnswer = (id , ans) => {
        setHairTags(ans)
        setBody({...body, hair_tags : ans })
   }


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
                title="Hair Attributes"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.goBack()}
                rightDisable
                />
            </View>
        
            <ScrollView>
            {tagsQuestion.length? tagsQuestion.map((item,index)=>{
                return( <OnboardingTags
                        selctedAnswerFunc = {(id , ans) => getTagAnswer(id , ans) }
                        question_id = {item.id}
                        question = {item.question}
                        option = {item.option}
                        clickedAnswer = {answer[item.id]}
            />)
            })
                :
                <View style = {{margin : 20 ,}}>
                    <Text style = {{fontWeight : 'bold'}}>No Hair Onboarding Tags</Text>
                </View>
            }
             <View style = {{ marginTop : 30, width : Dimensions.get('screen').width*0.9,
                    alignItems:'flex-end'}}>
                    <TouchableOpacity 
                            onPress = {onSubmitOnboarding}
                            disabled = {submitted}
                            style = {{
                                backgroundColor : submitted ? "#888" : theme , width : Dimensions.get('screen').width*0.3, height : 40 , borderRadius : 50, 
                            flex : 1, justifyContent : 'center' , alignItems : 'center'}}>
                        <Text
                         style = {{
                            fontSize : 15, 
                            color : submitted ? '#555' : background }}
                        >Submit</Text>
                    </TouchableOpacity>
                </View>   
        </ScrollView>
        </View>
    )
}

export default HairOnboardingTags

const styles = StyleSheet.create({})
