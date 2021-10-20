import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header } from './styles';
import { useNavigation } from '@react-navigation/native';
import { background,borderColor } from './exports';
const AskQuestion = () => {
    const navigation = useNavigation()
    return (
        <View style = {{backgroundColor : background, flex : 1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title="Start Discussion"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.navigate("Home")}
                rightDisable
                />
            </View>
            <Text>Category</Text>
            <Text>Title</Text>
            <Text>Comment (if any )</Text>
            <Text>Tags</Text>
            <Text>Image</Text>
        </View>
    )
}

export default AskQuestion

const styles = StyleSheet.create({})
