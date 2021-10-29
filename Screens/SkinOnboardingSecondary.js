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
import OnboardingTags from '../components/onboardingTags';
import { header, user } from './styles';
import { MaterialIcons } from '@expo/vector-icons';

const SecondaryQuestions = (props) => {
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
                keyExtractor = {(item,index)=> index.toString()}
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




const SkinOnboardingSecondary = () => {
    const [indicator , setIndicator] = React.useState(0)
    const [ questionData , setQuestionData] = React.useState([])
    const [ skinHairTypeQuestion , setSkinHairTypeQuestion] = React.useState([])
    const [ tagsQuestion , setTagsQuestion] = React.useState([])
    const [ skinTags, setSkinTags] = React.useState([])
    const [submitted,setSubmitted] = React.useState(false)
    const navigation  = useNavigation();
    const route = useRoute()
    const [body,setBody] = React.useState(route?.params?.body)


    React.useEffect(() => {
        // console.log("item_id" , 1)
        setIndicator(0)
        console.log("indicator", indicator)
      const getOnboardingQuestions = () => {
        axios.get(URL + "/onboarding", {
            params: {
             question_type: "skinquiz"
            }
          }, {timeout : 5000})
        .then(res => res.data)
        .then(function (responseData) {
        //    console.log( "productData : ", responseData)
            setQuestionData(responseData)
            // setLoading(false)
            // setFirstLoaded(true)
        })
        .catch(function (error) {
           console.log("error: ",error);
        //   setError(true);      
        })
      }
    

      getOnboardingQuestions()
      
       
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

    const [answer , setAnswer] = React.useState({});

    const getSelectedAnswer = (id , ans) => {
         let answerObject = {...answer}
         answerObject[id] = ans
         setAnswer(answerObject)
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

const goToTags = () => {
    setSubmitted(true)
    setIndicator(2)
    navigation.navigate("SkinOnboardingTags", {body: body})
}


    return (
        <View style = {{marginBottom : 0, backgroundColor : background , flex : 1}}>
          <View style = {{backgroundColor : background , flex : 1}}>
             <View style = {header.headerView}>
                <ModernHeader 
                title="Skin Profile Quiz"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.goBack()}
                rightDisable
                />
            </View>
            <ScrollView>
           
            {questionData.length?
                <FlatList
                keyExtractor = {(item) => item.id.toString()}
                data = {questionData}
                renderItem = {({item, index}) =>(
                    <SecondaryQuestions
                        selctedAnswerFunc = {(id , ans) => getSelectedAnswer(id , ans) }
                        question_id = {item.id}
                        question = {item.question}
                        questionNo = {index}
                        option = {item.option}
                        clickedAnswer = {answer[item.id]}
            />
                )
            }
            />: null}
                <View style = {{ marginTop : 30, width : Dimensions.get('screen').width*0.9,
                    alignItems:'flex-end'}}>
                    <TouchableOpacity 
                            onPress = {goToTags}
                            disabled = {submitted}
                            style = {{backgroundColor : theme , width : 40, height : 40 , borderRadius : 50, 
                            flex : 1, justifyContent : 'center' , alignItems : 'center' , marginBottom : 20}}>
                        <MaterialIcons name = "navigate-next" size= {40} color = "white" />
                    </TouchableOpacity>
                </View>   
            </ScrollView>
        </View>
        </View>
    )
}

export default SkinOnboardingSecondary

const styles = StyleSheet.create({})
