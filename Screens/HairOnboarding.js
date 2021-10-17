import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image ,Keyboard , KeyboardAvoidingView, Button , ToastAndroid, Dimensions} from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TextInput  , TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { AuthContext , theme , background, LoadingPage, ErrorPage, URL, borderColor, width, height} from './exports'
import axios from 'axios';
// import OnboardingQuestions from '../components/onboardingQuestion';
import OnboardingTags from '../components/onboardingTags';
import { header, user } from './styles';
import { MaterialIcons } from '@expo/vector-icons';

const PrimaryQuestions = (props) => {
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
            <View>
                <FlatList 
                keyExtractor = {(item,index)=> index}
                data = {props.option} 
                style = {{flexWrap: 'wrap', flexDirection : 'row',}} 
                renderItem = {({item, index})=> (
                    <TouchableOpacity
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
                )}/>
            </View>
        </View>
    )
}



const HairOnboarding = () => {

    const [indicator , setIndicator] = React.useState(0)
    const [ questionData , setQuestionData] = React.useState([])
    const [ skinHairTypeQuestion , setSkinHairTypeQuestion] = React.useState([])
    const [ tagsQuestion , setTagsQuestion] = React.useState([])
    const [ skinTags, setSkinTags] = React.useState([])
    const [submitted,setSubmitted] = React.useState(false)

    const navigation  = useNavigation();


    React.useEffect(() => {
        // console.log("item_id" , 1)
        setIndicator(0)
        console.log("indicator", indicator)

      
        const getSkinHairTypeQuestions = () => {
            axios.get(URL + "/onboarding", {
                params: {
                 question_type: "primary"
                }
              }, {timeout : 5000})
            .then(res => res.data)
            .then(function (responseData) {
                setSkinHairTypeQuestion(responseData)
            })
            .catch(function (error) {
               console.log("error: ",error);
            //   setError(true);      
            })
          }

            getSkinHairTypeQuestions()

          
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
       //  console.log(answer)
   }
 


const detailedQuestionnaire = () => {
    setIndicator(1)
    navigation.navigate("HairOnboardingSecondary")
}

const goToTags = () => {
    setIndicator(2)
    setSubmitted(true)
    navigation.navigate("HairOnboardingTags")
}



    return( 
        <View style = {{backgroundColor : background, flex : 1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title="Hair Profile"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.goBack()}
                rightDisable
                />
            </View>
            <ScrollView style = {{backgroundColor : background}}>
            {skinHairTypeQuestion.length ?
                <View>
                    <FlatList
                        keyExtractor = {(item) => item.id}
                        data = {skinHairTypeQuestion}
                        renderItem = {({item,index}) =>(
                            <PrimaryQuestions
                                selctedAnswerFunc = {(id , ans) => getSelectedAnswer(id , ans) }
                                question_id = {item.id}
                                questionNo = {index}
                                question = {item.question}
                                option = {item.option}
                                clickedAnswer = {answer[item.id]}
                            />
                        )
                    }
                    />
                    <View style = {{justifyContent : 'center',alignItems : 'center'}}>
                    <TouchableOpacity 
                    style = {{ elevation : 1,}}
                    onPress = {detailedQuestionnaire}
                    >
                        <Text style = {{fontSize : 14, fontStyle:'italic', textShadowRadius : 0, color : '#0E76A8'}} > Not sure ? Take this simple quiz </Text>
                    </TouchableOpacity>
                    </View>
                    <View style = {{ marginTop : 20, width : Dimensions.get('screen').width*0.95,
                        alignItems:'flex-end'}}>
                        <TouchableOpacity 
                                onPress = {goToTags}
                                disabled = {submitted}
                                style = {{backgroundColor : theme , width : 40, height : 40 , borderRadius : 50, 
                                flex : 1, justifyContent : 'center' , alignItems : 'center'}}>
                            <MaterialIcons name = "navigate-next" size= {40} color = "white" />
                        </TouchableOpacity>
                    </View>


                </View> : null
            }
            </ScrollView>
        </View>
    );
}


export default HairOnboarding;