import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header } from './styles';
import { useNavigation } from '@react-navigation/native';
import { background,borderColor } from './exports';
const WriteReview = () => {
    const navigation = useNavigation()


    return (
        <View style = {{backgroundColor : background , flex : 1}}>
             <View style = {header.headerView}>
                <ModernHeader 
                title="Write Review"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.navigate("Home")}
                rightDisable
                />
            </View>
        </View>
    )
}

export default WriteReview

const styles = StyleSheet.create({})
