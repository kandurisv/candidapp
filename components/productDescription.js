import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View , Image, TouchableOpacity } from 'react-native';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const ProductDescription = (props) => {

// console.log("data: " ,props.product_name)
    const navigation = useNavigation();
    
    return(
        <TouchableOpacity 
        style = {styles.container}
        onPress = {()=> navigation.navigate('ProductDetails' , {product_id: props.product_id , product_name: props.product_name ,image: props.image})}
        >
            <View style = {styles.imageview}>
                <Image
                    source={{uri:props.image}}
                    style = {{height: 70 , width: 70  } }
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
                    <View>
                        <Text>
                            Reviews
                        </Text>
                    </View>
                    <View>
                        <Text style = {{marginLeft: 10}}>
                            {props.number_of_reviews}
                        </Text>
                    </View>
                    </View>
            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        // flex: 1
        flexDirection:'row',
        width: '100%',
        backgroundColor:'white',
        marginTop: 2,
        // marginRight: 5
    },

    imageview :{
        width : '25%',
        alignItems:'center',
        justifyContent:'center',
    },

    contentview:{
        marginLeft: 10 , 
        marginTop:1,
    }, 
    reviewnumber:{
        flexDirection: 'row',
        
    }
})

export default ProductDescription;