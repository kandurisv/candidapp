import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const ProductDetailsHeader = (props) => {
    return(
        <View style = {styles.container} >
            <View style = {styles.imageContainer} >
                <Image 
                    source={{uri:props.image}}
                    style = {styles.image}
                />
            </View>
            <View style = {styles.productname}>
                <Text style={{fontWeight:'bold' , fontSize: 18}}>
                    {props.product_name}
                </Text>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems:'center',
        backgroundColor:'#FFFFFF'
    }, 
    imageContainer:{
        width:'80%',
        
    },
    image:{ width: '100%',
            height: undefined,
            aspectRatio: 1, 
    },
    productname:{
        width: '80%',
        alignItems:'flex-start',
        // marginLeft:0,
        // backgroundColor: 'red'
    }
})

export default ProductDetailsHeader;