import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { background, theme } from '../Screens/exports';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const ProductDetailsHeader = (props) => {
    return(
        <View style = {{ flexDirection : 'row' , backgroundColor : background}}>
            <View style = {{borderRadius : 10}}>
                <Image
                    source={{uri:props.image}}
                    style = {{height: 70 , width: 70 , borderRadius: 10  } }
                    />
            </View>
            <View style = {{flexShrink : 1 , marginLeft : 10}}>
                <View style = {{flex : 1, }}>
                    <View  style = {{justifyContent : 'flex-end' , borderRadius : 5,}}>
                        <Text style = {{color : theme, fontWeight : 'bold'}}>
                            {props.brand}
                        </Text>
                    </View>
                </View>
                <View style = {{flexShrink : 1}}>
                    <Text style = {{ fontSize:13 ,flexShrink : 1}}>
                        {props.product_name}
                    </Text>
                </View>
                
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    
})

export default ProductDetailsHeader;