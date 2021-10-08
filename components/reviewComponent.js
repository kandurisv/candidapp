import React from 'react';
import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import fontawesome from 'react-native-vector-icons/fontawesome';

const ReviewComponenet = (props) => {
    return(
        <View style = {styles.container}>
            <View style ={styles.header}>
                <View style = {styles.profile}>
                    <Image
                    source={require('../img/52.png')}
                    style = {{height: 50 , width:  50 , borderRadius: 25} }
                    />
                </View>
                <View style = {styles.postinfo}>
                    <View>
                        <Text>
                            {props.username}
                        </Text>
                    </View>
                    <View>
                        <Text>
                            6h ago
                        </Text>
                    </View>

                    <View style = {styles.reviewtitle}>
                        <Text>
                            Review Title
                        </Text>
                    </View>
                    
                </View>
                <View style = {styles.reviewimage}>
                        <Image
                            source={require('../img/52.png')}
                            style = {{height: 100 , width:  100 } }
                        />
                    </View>
            </View>

            <View style = {styles.content}>
                <Text>
                    {props.content}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    //   flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginLeft: 20,
      marginTop: 15,
      marginRight:10,
      backgroundColor: 'white',
      padding: 10
    //   width: '80%'
    },

    header:{
        // backgroundColor:'pink',
        flexDirection:'row'
    },

    profile:{
        // flex:1
    },
    postinfo:{
        flexDirection:'column',
        // flex: 6,
        marginTop: 5,
        marginLeft: 10
    },
    reviewimage:{
        width:'65%',
        alignItems:'flex-end',
        // backgroundColor: 'red'
    },
    reviewtitle:{
        marginTop: 20
    }

    
  })

export default ReviewComponenet;