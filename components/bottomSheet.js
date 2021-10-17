import React from 'react';
import { StyleSheet, Text, 
    View  , TouchableOpacity ,
     FlatList  , Image ,Keyboard ,
      KeyboardAvoidingView, Button ,
       ToastAndroid , Dimensions} from 'react-native';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Animated from 'react-native-reanimated';
import { isTranslateY } from 'react-native-redash';
import { TapGestureHandler } from 'react-native-gesture-handler';

const {width , height} = Dimensions.get('window')
const BottomSheet = (props) => {

    return(
    <>
        <TapGestureHandler
        {...props.gestureHandler}
        >
            <Animated.View 
                style = {{...StyleSheet.absoluteFill , backgroundColor:"rgba(0,0,0,0.5)" , zIndex:-1}}
            />
        </TapGestureHandler>
        <Animated.View style = {{...styles.bottomSheet , transform:[{translateY: props.translateY}]}}>
              <Text>
                  Animated sheet
              </Text>
        </Animated.View>

    </>
    );  
}

const styles = StyleSheet.create({
    
    container:{
        // flex:1,
    },
    
      bottomSheet: { 
        position: 'absolute',
        bottom: 0,
        width:width - 20,
        height:300,
        backgroundColor:'white',
        borderRadius:25,
        marginHorizontal:10,
        alignItems:'center'
      },

})

export default BottomSheet;