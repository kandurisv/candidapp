import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header } from './styles';
import { useNavigation } from '@react-navigation/native';
import { background,borderColor, theme } from './exports';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';



const MyQNA = () => {
    const navigation = useNavigation()
    return (
        <View style = {{backgroundColor : background, flex:1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title="My Questions and Answers"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.navigate("UserDetails")}
                rightDisable
                />
            </View>
            <Text>MJ</Text>
        </View>
    )
}

export default MyQNA

const styles = StyleSheet.create({})
