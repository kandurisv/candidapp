import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image ,Keyboard , KeyboardAvoidingView, Button , ToastAndroid, Dimensions} from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TextInput  , TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from '../exports'
import axios from 'axios';

import { header, user } from '../styles';
import { MaterialIcons } from '@expo/vector-icons';

const SkinPrimaryQuestions = (props) => {
    const [selectedAnswer , setSelectedAnswer] = React.useState()
    const [questionId , setQuestionId] = React.useState()
    const getSelectedAnswer = (item , id) =>{
        setSelectedAnswer(item)
        // console.log(id)
        props.selctedAnswerFunc(id , item)
        setQuestionId(id)
    }

    
    return(
        <View style = {{backgroundColor : background , elevation : 5, marginTop : 10, }}>
            <View style = {{ marginTop : 10, marginBottom : 10, marginLeft : 10}}>
                <Text style = {user.editUserProfileHeader}>{props.questionNo+1}.{props.question}</Text>
            </View>
            <View style = {{flexDirection : 'row' , flexWrap : 'wrap'}}>
            {props.option.map((item,index)=>{
                return(
                    <TouchableOpacity
                    key = {index.toString()}
                    style = {{
                        borderRadius : 20, width : Dimensions.get('screen').width* 0.4,
                        borderWidth : 1, borderColor : "#DDD",
                        paddingVertical : 3,
                        marginRight : Dimensions.get('screen').width* 0.05,
                        marginLeft : Dimensions.get('screen').width* 0.05,
                        marginTop : 10,
                        marginBottom : 10,
                        justifyContent : 'center', alignItems : 'center',
                        backgroundColor : item == props.clickedAnswer  ? theme : background}}
                    onPress =  {() => getSelectedAnswer(item, props.question_id)}>
                        <Text style = {{color : item == props.clickedAnswer  ? background : borderColor}}> {item} </Text>
                    </TouchableOpacity>
                    
                    )
            })}
            </View> 
        </View>
    )
}

const SkinOnboarding = () => {

    const [ indicator , setIndicator ] = React.useState(0)
    const [ questionData , setQuestionData ] = React.useState([])
    const [ skinTypeQuestion , setSkinTypeQuestion ] = React.useState([])
    const [ tagsQuestion , setTagsQuestion ] = React.useState([])
    const [ skinTags, setSkinTags ] = React.useState([])
    const [ submitted,setSubmitted ] = React.useState(false)
    const route = useRoute()
    const [ body,setBody ] = React.useState({
        username : route?.params?.userName,
        instagram_username : route?.params?.instagram,
        dob : route?.params?.userDob,
        gender : route?.params?.gender,
        profile_image : route?.params?.userProfileImage,
        expo_token : route?.params?.expoToken,
        device_token : route?.params?.deviceToken,
        skin_answer_primary : {},
        skin_answer_quiz :{},
        skin_tags : [],
        hair_answer_primary : {},
        hair_answer_quiz : {},
        hair_tags : [],
        var : route?.params?.var
    })


    const navigation  = useNavigation();


    React.useEffect(() => {
        // console.log("item_id" , 1)
        setIndicator(0)
        console.log("indicator", indicator)
        console.log("Body" , URL)
      
        const getSkinTypeQuestions = () => {
            axios.get(URL + "/onboarding", {
                params: {
                 question_type: "skinprimary"
                }
              }, {timeout : 10000})
            .then(res => res.data)
            .then(function (responseData) {
                console.log("Skin primary",responseData)
                setSkinTypeQuestion(responseData)
            })
            .catch(function (error) {
               console.log("error: ",error);
            //   setError(true);      
            })
          }

            getSkinTypeQuestions()

          
    },[])


    const [answer , setAnswer] = React.useState({});

    const getSkinSelectedAnswer = (id , ans) => {
         let answerObject = {...answer}
         answerObject[id] = ans
         setAnswer(answerObject)
         setBody({...body, skin_answer_primary : answerObject })
         console.log(body)
    }


    const getTagAnswer = (id , ans) => {
        setSkinTags(ans)
       //  console.log(answer)
   }
 


const detailedQuestionnaire = () => {
    setIndicator(1)
    navigation.navigate("SkinOnboardingSecondary" , {body: body})
}

const goToTags = () => {
    console.log(body)
    setSubmitted(true)
    navigation.navigate("SkinOnboardingTags", {body : body})
}



    return( 
        <View style = {{backgroundColor : background, flex : 1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title="Skin Profile"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.goBack()}
                rightDisable
                />
            </View>
            <ScrollView style = {{backgroundColor : background}}>
            {skinTypeQuestion.length ? skinTypeQuestion.map((item,index)=>{
                return(<SkinPrimaryQuestions
                    key = {index.toString()}
                    selctedAnswerFunc = {(index , ans) => getSkinSelectedAnswer(index , ans) }
                    question_id = {index}
                    questionNo = {index}
                    question = {item.question}
                    option = {item.option}
                    clickedAnswer = {answer[index]}
                />)
            }) : null }
                {skinTypeQuestion.length ? <View>
                    <View style = {{justifyContent : 'center',alignItems : 'center', marginTop : 20}}>
                        <TouchableOpacity 
                        style = {{ elevation : 1,}}
                        onPress = {detailedQuestionnaire}
                        >
                            <Text style = {{fontSize : 14, fontStyle:'italic', textShadowRadius : 0, color : '#0E76A8'}} > Not sure ? Take this simple quiz </Text>
                        </TouchableOpacity>
                    </View>
                </View>  : null}
               
                <View style = {{ marginTop : 20, width : Dimensions.get('screen').width*0.95,
                    alignItems:'flex-end'}}>
                    <TouchableOpacity 
                            onPress = {goToTags}
                            style = {{backgroundColor : theme , width : 40, height : 40 , borderRadius : 50, 
                            flex : 1, justifyContent : 'center' , alignItems : 'center'}}>
                        <MaterialIcons name = "navigate-next" size= {40} color = "white" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}


export default SkinOnboarding;