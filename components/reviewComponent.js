import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { background, width } from '../Screens/exports';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const ReviewComponenet = (props) => {
    return(
        <View style = {{backgroundColor : background , margin : 5}}>
            <View style ={{flexDirection : 'row'}}>
                <View style = {{margin:5}}>
                    <Image
                    source={require('../img/52.png')}
                    style = {{height: 40 , width:  40 , borderRadius: 40} }
                    />
                </View>
                <View style = {{flex : 1}}>
                    <View style = {{flexDirection : 'row' , justifyContent : 'space-between'}}>
                        <View>
                            <Text style = {{fontWeight : 'bold'}}>{props.username}</Text>
                        </View>
                        <View>
                            <Text style = {{fontSize : 12, fontStyle: 'italic'}}>6h ago</Text>
                        </View>
                    </View>
                    <View style = {{fontWeight : 'bold'}}>
                        <Text>
                            Review Title
                        </Text>
                    </View>
                </View>
                
            </View>

            <View style = {{}}>
                <View style = {{}}>
                    <Image
                            source={require('../img/52.png')}
                            style = {{width : width*0.92 , height : width*0.69, marginHorizontal : width*0.02 } }
                    />
                </View>
                <View>
                    <Text>{props.content}</Text>
                </View>  
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    
  })

export default ReviewComponenet;