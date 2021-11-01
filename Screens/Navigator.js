import React, { useState , useContext} from "react";
import {View,TouchableOpacity,Dimensions,StyleSheet, Animated, Text} from 'react-native';
import {MaterialCommunityIcons, FontAwesome5} from "@expo/vector-icons";
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import AddPost from './AddPost'
import EditUserProfile from './EditUserProfile'
import Feed from './Feed'
import Home from './Home'
import Login from './Login'
import Pins from './Pins'
import Signout from './Signout'
import UserDetails from './UserDetails'
import PostDetails from './PostDetails'


import Search from './Search'
import { AuthContext, background, borderColor, theme , contrastTheme, lightTheme , contrastLightTheme, URL} from "./exports";
import HeroSearchFeed from "./HeroSearchFeed";
import ActivityNotification from "./ActivityNotification";
import UpdatePost from "./UpdatePost";
import DrawerContent from "./DrawerContent";

import PostLink from "./PostLink";
import FeedSearch from "./FeedSearch";
import UserPostDetails from "./UserPostDetails";
import DiscussionScreen from "./DiscussionScreen";
import DiscussionPost from "./discussionPost";
import Input from "./input";

import ProductDetails from "./productDetails"

import NewPostModal from "./NewPostModal";

import NewUserOnboarding from "./OnboardingScreens/NewUserOnboarding";

import SkinOnboarding from "./OnboardingScreens/SkinOnboarding";
import SkinOnboardingSecondary from "./OnboardingScreens/SkinOnboardingSecondary";
import SkinOnboardingTags from "./OnboardingScreens/SkinOnboardingTags";

import HairOnboarding from "./OnboardingScreens/HairOnboarding";
import HairOnboardingSecondary from "./OnboardingScreens/HairOnboardingSecondary";
import HairOnboardingTags from "./OnboardingScreens/HairOnboardingTags";
import RecommendationOnboarding from "./RecommendationOnboarding";
import WriteReview from "./WriteReview";
import AddJourney from "./AddJourney";
import GiveRecommendation from "./GiveRecommendation"
import StartDiscussion from "./StartDiscussion"
import AskQuestion from "./AskQuestion";
import MyDiscussions from "./MyDiscussions";
import MyQNA from "./MyQNA";
import MyJourneys from "./MyJourneys";
import MyReviews from "./MyReviews";
import MyRecommendations from "./MyRecommendations";
import AppendJourney from "./AppendJourney";
import JourneyDetails from "./JourneyDetails";
import axios from "axios";



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator()

const totalWidth = Dimensions.get("window").width;
const TAB_BAR_HEIGHT = 60
const TAB_ICON_SIZE = 20
const TAB_SLIDER_HEIGHT = 2
// const TAB_SLIDER_COLOR = "#C51E3A"
const TAB_SLIDER_COLOR = "#FFFFFF"
const TAB_ACTIVE_COLOR = theme
const TAB_INACTIVE_COLOR = "#888888"

const BottomMenu = ({ iconName, isCurrent , label, value, index}) => {

    

    const [badgeColor, setBadgeColor] = React.useState(index == 1 ? lightTheme : index == 3 ? contrastTheme : index == 4 ? theme : 'white')
  
    return(
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor :  'white',
        margin : 0,
        padding : 0,
      }}
    >
     
      <View 
        style = {{
          position : 'absolute' , top : 5, right : 10 , 
          borderRadius : 20 , 
          width : 15 , height : 15 , 
          justifyContent : 'center', alignItems: 'center',
          backgroundColor : isCurrent ? 'white' : value ? badgeColor : 'white'}}>
          <Text style = {{
            fontSize : 8, textAlign : 'center' , 
            justifyContent: 'center' , alignSelf: 'center', color : 'white'}}>
              {value}
          </Text>
      </View>
      <FontAwesome5
        name={iconName}
        size={TAB_ICON_SIZE}
        style={{ color:  isCurrent ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR }}
      />
      <Text 
      style = {{ color:  isCurrent ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR }}
      >{label}</Text>
    </View>)
  }




const TabBar = ({state,descriptors,navigation}) => {
    const [userId] = React.useContext(AuthContext)
    const [badgeValue,setBadgeValue] = React.useState([0,10,0,30,40])
    React.useEffect(() => {

      axios.all([
        axios.get(URL + "/discussion/new",{params:{user_id : userId.slice(1,13) }} , {timeout : 5000}),
        axios.get(URL + "/journey/new",{params:{user_id : userId.slice(1,13) }} , {timeout : 5000}), 
        axios.get(URL + "/notifications/newcount",{params:{user_id : userId.slice(1,13) }} , {timeout : 5000})])
        .then(axios.spread((...responses) => {
          console.log(responses[0].data[0].new_discussion_item)
          const responseOne = responses[0].data[0].new_discussion_item
          const responseTwo = responses[1].data[0].new_discussion_item
          const responesThree = responses[2].data[0].new_notification_indicator
          let newArr1 = [...badgeValue]
          newArr1[1] = responseOne
          newArr1[3] = responseTwo
          newArr1[4] = responesThree
          setBadgeValue(newArr1)
        })).catch(errors => {
          // react on errors.
        })


      
      

    },[])

    //Badge Value
   

    const [translateValue] = useState(new Animated.Value(0));
    const tabWidth = totalWidth / state.routes.length;
    return (
    <View style={[style.tabContainer, { width: totalWidth }]}>
      <View style={{ flexDirection: "row" }}>
      <Animated.View
          style={[
            style.slider,
            {
              transform: [{ translateX: translateValue }],
              width: tabWidth - 30,
            },
          ]}
        />
    {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
        const isFocused = state.index === index;
        const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
              //Badge Value Change
              let newArr = [...badgeValue]; // copying the old datas array
              newArr[index] = 0; // replace e.target.value with whatever you want to change it to
              setBadgeValue(newArr);
            }
            Animated.spring(translateValue, {
                toValue: index * tabWidth,
                velocity: 10,
                useNativeDriver: true,
              }).start();
        }
        const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

       


        return (
         
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ["selected"] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1 }}
              key={index}
            >   
                <BottomMenu
                iconName={label.toString()}
                isCurrent={isFocused}
                label = {options.title}
                value = {badgeValue[index]}
                index = {index}
              />
            </TouchableOpacity>
           
          )
        })}
      </View>
    </View>
  );
};


const UserDetailsStack = ({navigation}) => {
  return (
      <Stack.Navigator initialRouteName="UserDetails" screenOptions={{headerShown: false}}>
        <Stack.Screen name="UserDetails" component ={UserDetails} />
        <Stack.Screen name="EditUserProfile" component={EditUserProfile} /> 
      </Stack.Navigator>
  );
}

const AuthStack = ({navigation}) => {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeTab" component={TabNavigator}  /> 
        <Stack.Screen name="Login" component ={Login} />
      </Stack.Navigator>
  );
}

const AddScreenComponent = () => {
  return null;
}

const TabNavigator = () => {



    return (
      <Tab.Navigator 
        screenOptions = {{
        "tabBarActiveTintColor": "green",
        "tabBarStyle": [{"display": "flex"},null],
        "headerShown" : false,
      }}
        sceneContainerStyle={{backgroundColor: 'transparent'}}
        options = {{unmountOnBlur : true , tabBarHideOnKeyboard : false }}
        tabBar={props => <TabBar {...props} />}
        initialRouteName = "Home"  
      >
        <Tab.Screen name="Home" component={Home} options = {tab1Options} />
        <Tab.Screen name="Discuss" component={DiscussionScreen} options = {tab2Options} />
        <Tab.Screen 
          name="Add" 
          component={AddPost}
          options={{
            tabBarLabel: 'calendar-plus',
            title : "Post",
            tabBarColor: 'purple',
            tabBarActiveBackgroundColor : 'transparent'
          }}
         
          />
        <Tab.Screen name="Explore" component={Feed} options = {tab4Options} />
        <Tab.Screen name="Activity" component={ActivityNotification} options = {tab5Options} />
      </Tab.Navigator>
    )
  }

  const HomeStackNavigator = () => {
    const userId = useContext(AuthContext)
    React.useEffect(()=>{
   
    },[])
    return (
      <Stack.Navigator 
        initialRouteName = {userId === "" ? "Auth" : "Tab"}
        screenOptions={{headerShown: false}}
      >
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Tab" component={TabNavigator} />
        <Stack.Screen name="Signout" component ={Signout} />
        <Stack.Screen name="PostDetails" component ={PostDetails} />
        <Stack.Screen name="PostLink" component ={PostLink} />
        <Stack.Screen name="UserPostDetails" component ={UserPostDetails} />
        <Stack.Screen name="UpdatePost" component={UpdatePost} /> 
        <Stack.Screen name="HeroSearchFeed" component ={HeroSearchFeed} />
        <Stack.Screen name="Search" component ={Search} />
        <Stack.Screen name="FeedSearch" component ={FeedSearch} />
        <Stack.Screen name="ActivityNotification" component ={ActivityNotification} />

        <Stack.Screen name="DiscussionPost" component ={DiscussionPost} />
        <Stack.Screen name="Input" component ={Input} />
        <Stack.Screen name="ProductDetails" component ={ProductDetails} />
        <Stack.Screen name="NewPostModal" component ={NewPostModal} />
        <Stack.Screen name="NewUserOnboarding" component ={NewUserOnboarding} />
        <Stack.Screen name="SkinOnboarding" component ={SkinOnboarding} />
        <Stack.Screen name="SkinOnboardingSecondary" component ={SkinOnboardingSecondary} />
        <Stack.Screen name="SkinOnboardingTags" component ={SkinOnboardingTags} />
        <Stack.Screen name="HairOnboarding" component ={HairOnboarding} />
        <Stack.Screen name="HairOnboardingSecondary" component ={HairOnboardingSecondary} />
        <Stack.Screen name="HairOnboardingTags" component ={HairOnboardingTags} />
        <Stack.Screen name="RecommendationOnboarding" component ={RecommendationOnboarding} />
        <Stack.Screen name="StartDiscussion" component ={StartDiscussion} />
        <Stack.Screen name="WriteReview" component ={WriteReview} />
        <Stack.Screen name="AddJourney" component ={AddJourney} />
        <Stack.Screen name="AppendJourney" component ={AppendJourney} />
        <Stack.Screen name="GiveRecommendation" component ={GiveRecommendation} />
        <Stack.Screen name="AskQuestion" component ={AskQuestion} />
        <Stack.Screen name="MyDiscussions" component ={MyDiscussions} />
        <Stack.Screen name="MyQNA" component ={MyQNA} />
        <Stack.Screen name="MyJourneys" component ={MyJourneys} />
        <Stack.Screen name="MyReviews" component ={MyReviews} />
        <Stack.Screen name="MyRecommendations" component ={MyRecommendations} />
        <Stack.Screen name="JourneyDetails" component ={JourneyDetails} />
      </Stack.Navigator>
    );
  }


  const Navigator = () => {
    return (
      <Drawer.Navigator
        screenOptions={{headerShown : false}}
        drawerContent = {props => <DrawerContent {...props}/>}
        >
        <Drawer.Screen name="HomeDrawer" component={HomeStackNavigator} />
        <Drawer.Screen name="UserDetails" component={UserDetailsStack} />
        <Drawer.Screen name="SignOut" component={Signout} />
      </Drawer.Navigator>
    );
  }

  
export default Navigator;

  const style = StyleSheet.create({
    tabContainer: {
      height: TAB_BAR_HEIGHT,
      shadowOffset: {
        width: 0,
        height: -1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.0,
      backgroundColor: background,
      borderTopRightRadius: 5,
      borderTopLeftRadius: 5,
      elevation: 5,
      position: "absolute",
      bottom: 0,
    },
    slider: {
      height: TAB_SLIDER_HEIGHT,
      position: "absolute",
      top: 0,
      left: 13,
      backgroundColor: TAB_SLIDER_COLOR,
      borderRadius: 10,
      width: 50
  },
  
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'grey',
     },
     contentContainer: {
        flex: 1,
        paddingLeft: 50
     },
     bottomSheetTitle: {
         fontSize: 24,
         fontWeight: '500'
     }

  });
  

  const tab1Options = {
    tabBarLabel: 'home',
    title : "Home",
    tabBarColor: 'orange',
    tabBarHideOnKeyboard : false
      }

  const tab2Options = {
  //  tabBarLabel: 'card-plus',
    tabBarLabel: 'users',
    title : "Discuss",
    tabBarColor: 'purple',
    tabBarHideOnKeyboard : true,
    tabBarStyle : {display : 'none'}
  }

  const tab3Options = {
    tabBarLabel: 'calendar-plus',
    title : "Post",
    tabBarColor: 'purple',
    tabBarIcon: ({color}) => (<MaterialCommunityIcons name="home" color ="blue"  size={26}/>),
    tabBarBadge : 2,
    tabBarHideOnKeyboard : false
  }

  const tab4Options = {
    tabBarLabel: 'infinity',
    title : "Explore",
    tabBarColor: 'purple',
    tabBarIcon: ({color}) => (<MaterialCommunityIcons name="home" color ="blue"  size={26}/>),
    tabBarBadge : 2,
    tabBarHideOnKeyboard : false
  }

  const tab5Options = {
    tabBarLabel: 'bell',
    title : "Activity",
    tabBarColor: 'purple',
    tabBarIcon: ({color}) => (<MaterialCommunityIcons name="home" color ="blue"  size={26}/>),
    tabBarBadge : 2,
    tabBarHideOnKeyboard : false
  }

