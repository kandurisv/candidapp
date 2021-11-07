import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { background, blueText, contrastLightTheme, contrastTheme, theme } from '../Screens/exports';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const Overview = (props) => {

    


    return(
        <ScrollView 
        showsVerticalScrollIndicator = {false}
        style = {{backgroundColor : background , flex : 1, }}
        contentContainerStyle = {{margin : 10 }}
        >
            <View style = {{borderWidth : 1 , borderColor : "#CCC", backgroundColor : 'white', borderRadius : 20 , padding : 10 }}>
                <Text style = {{color : contrastTheme , fontStyle : 'italic'}}>
                    10 people of your skin type added it in their journeys
                </Text>
                <Text style = {{color : contrastLightTheme , fontStyle : 'italic', marginTop : 10}}>
                    3 community members of your skin type recommended this product 
                </Text>
            </View>
            <View style = {{marginTop : 20 , padding : 5, }}>
                <Text style = {{fontWeight : 'bold', fontSize : 16, }}>How to use </Text>
                <Text style = {{marginTop : 10 }}>dafsdfa dsfas fsad fsa fsaf sadf sadf sadf sadf sadf saf saf saf saf asf asf safsa fsaf saf saf saf asf saf saf saf asf saf saf asf saf saf asf sag seg wef werf wsa fsad fasf safsaf safsag gw ge a gseg eg wgwe sdga faw fasf asf af asfasf asf as fas fas f</Text>
            </View>
            <View style = {{marginTop : 20 , padding : 5, }}>
                <Text style = {{fontWeight : 'bold', fontSize : 16, }}>Ingredients </Text>
                <Text style = {{marginTop : 10 }}>dafsdfa dsfas fsad fsa fsaf sadf sadf sadf sadf sadf saf saf saf saf asf asf safsa fsaf saf saf saf asf saf saf saf asf saf saf asf saf saf asf sag seg wef werf wsa fsad fasf safsaf safsag gw ge a gseg eg wgwe sdga faw fasf asf af asfasf asf as fas fas f</Text>
            </View>
            
            
            
        </ScrollView>
    )
}

export default Overview;