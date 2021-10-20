import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ModernHeader } from "@freakycoder/react-native-header-view";
import { header } from './styles';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const RecommendationOnboarding = () => {
    return (
        <View style = {{backgroundColor : background, flex : 1}}>
            <View style = {header.headerView}>
                <ModernHeader 
                title="Recommend Products"
                titleStyle = {header.headerText}
                backgroundColor= {background}
                leftIconColor = {borderColor}
                leftIconOnPress={() => navigation.goBack()}
                rightDisable
                />
            </View>
            <View>
                <TouchableOpacity>
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['rgba(0,0,0,0.8)', 'transparent']}
                        style={styles.background}
                    />
                    <LinearGradient
                        // Button Linear Gradient
                        colors={['#4c669f', '#3b5998', '#192f6a']}
                        style={styles.button}>
                        <Text style={styles.text}>Find friends on Candid</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            <ScrollView 
            contentContainerStyle = {home.mainViewScrollableContentContainer}
            style = {home.mainViewScrollableContainer}
            >
              <View
                style = {{flexDirection : 'row' , borderWidth : 1 , borderColor : '#bbb', backgroundColor : '#EEE' ,
                borderRadius : 2, padding : 5, margin : 5 , height : 50, justifyContent: 'center', 
                alignItems:'center'}}>
                <TextInput 
                  style = {{flex : 1 , fontSize : 14}}
                  placeholder = "Search categories, brands or products"
                  onChangeText = {(text)=>setHeroSearchText(text)}
                  value = {heroSearchText}
                />

                <TouchableOpacity 
                  style = {{ paddingTop : 2, paddingBottom : 2, paddingLeft : 5, paddingRight: 5, justifyContent : 'center' , alignItems : 'center', borderRadius : 5 }}
                  onPress = {onSearchHero}
                >
                  <Fontisto name = "search" size = {20} color = {theme} />
                </TouchableOpacity>
              </View>

        {response.length > 0 && response.map((item,index) =>{
            return (
            <View key = {index} style = {[home.mainViewCarouselContainer,{marginTop : 0, paddingRight : 10 , elevation:1 , shadowRadius : 2, shadowColor : theme  , backgroundColor : background  }]}>
              <Text style = {[home.mainViewCarouselTitle,{marginTop : 5}]}>{item.header}</Text>
              <View style = {home.mainViewCarouselChild}>
                <UpdatedCarousel DATA = {item.data} onClickItem = {goToProductFeed} varValue = {item.var}/>
              </View>
            </View> )
        })}
    </ScrollView>

        </View>
    )
}

export default RecommendationOnboarding

const styles = StyleSheet.create({})
