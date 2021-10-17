import React from 'react';
import { StyleSheet, Text, View  , TouchableOpacity , FlatList  , Image ,Keyboard , KeyboardAvoidingView, Button , ToastAndroid} from 'react-native';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomSheet from '../components/bottomSheet';
import Animated, { cond, eq, set, useCode, Value } from 'react-native-reanimated';
import {TapGestureHandler , State} from "react-native-gesture-handler";

 

const BottomSheetScreen = () => {
    translateY = new Animated.Value(300)
    const state = new Value(State.UNDETERMINED)
    const isOpen = new Value(0)
    
    useCode(() =>
        cond(
            eq(state,State.END),
            cond(eq(translateY,300) , set(translateY , 0 ) , set(translateY,300)),
        ),
    )
    return(
        <>

        <View>
            <TapGestureHandler
                onHandlerStateChange ={Animated.event([{
                    nativeEvent:{state}
                }])}
            >
                <Animated.View>
                    <Button
                        title = "button"
                    />
                </Animated.View>
            </TapGestureHandler>
        </View>
                <BottomSheet
                    gestureHandler = {{
                        onHandlerStateChange :Animated.event([{
                            nativeEvent:{state}
                        }])
                    }}
                    translateY = {translateY}
                />
            
            
              
        </>
    );  
}

const styles = StyleSheet.create({
    
    container:{
        // flex:1,
    },
    
      textInput: { 
        // flex: 1,
        // borderColor: "#000000",
        // borderWidth: 1,
        // marginBottom: 36,
      },

})

export default BottomSheetScreen;