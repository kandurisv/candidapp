import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { background } from '../Screens/exports';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const Journey = (props) => {
    return(
        <View style = {{backgroundColor : background, flex : 1}}>
            <Text>
                {props.product_id}
            </Text>
        </View>
    )
}

export default Journey;