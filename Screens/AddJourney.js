import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header } from './styles';
import { useNavigation } from '@react-navigation/native';
import { background,borderColor, theme } from './exports';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';



const AddJourney = () => {
    const navigation = useNavigation()
    return (
        <View style = {{backgroundColor : background, flex:1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title="Add Journey"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.navigate("Home")}
                rightDisable
                />
            </View>
            <TouchableOpacity style = {{
                margin : 10 , justifyContent : 'center', alignItems : 'center', padding : 10 ,
                elevation : 5,
                }}
            onPress = {()=>console.log("new journey")}    
            >       
                <Text style={{color : theme, fontWeight:'bold', fontSize : 15}}>Create a New Journey</Text>   
            </TouchableOpacity>
            <View style = {{padding : 20 , elevation : 1, flex : 1,}}>
                <Text style = {{fontWeight : 'bold', marginBottom : 10, fontSize : 18}}>Existing Journeys</Text>
                <View>
                    <Text>MamaEarth Ubtan Face Wash</Text>
                </View>
            </View>
        </View>
    )
}

export default AddJourney

const styles = StyleSheet.create({})
