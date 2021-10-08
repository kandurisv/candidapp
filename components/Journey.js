import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const Journey = (props) => {
    return(
        <View>
            <Text>
                {props.product_id}
            </Text>
        </View>
    )
}

export default Journey;