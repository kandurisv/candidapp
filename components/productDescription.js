import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View , Image, TouchableOpacity } from 'react-native';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const ProductDescription = (props) => {

// console.log("data: " ,props.product_name)
    const navigation = useNavigation();
    
    return(
        <TouchableOpacity 
        style = {{borderRadius : 20,}}
        onPress = {()=> navigation.navigate('ProductDetails' , {body : props })}
        >
            <View style = {{borderRadius : 70 , backgroundColor : 'red'}}>
                <Image
                    source={{uri:props.image}}
                    style = {{height: 70 , width: 70 , borderRadius : 70  } }
                    />
            </View>
            <View style = {styles.contentview}>
                <View>
                    <Text style = {{fontWeight: 'bold' , fontSize:15}}>
                        {props.product_name}
                    </Text>
                </View>
                <View>
                    <Text>
                        {props.brand}
                    </Text>
                </View>
                <View>
                    <Text>
                        {props.category_name}
                    </Text>
                </View>
                <View style = {styles.reviewnumber}>
                    <Text>
                        {props.number_of_reviews} Reviews
                    </Text>
                </View>
            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    
})

export default ProductDescription;