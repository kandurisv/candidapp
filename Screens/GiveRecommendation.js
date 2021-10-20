import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header } from './styles';
import { useNavigation } from '@react-navigation/native';
import { background,borderColor } from './exports';

const GiveRecommendation = () => {
    const navigation = useNavigation()
    return (
        <View style = {{backgroundColor : background , flex : 1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title="Give Recommendation"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.navigate("Home")}
                rightDisable
                />
            </View>
            <Text>GR</Text>
        </View>
    )
}

export default GiveRecommendation

const styles = StyleSheet.create({})
