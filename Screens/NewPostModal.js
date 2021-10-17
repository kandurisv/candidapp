import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { Modal } from 'react-native-modal'
import { addPost } from './styles'


const NewPostModal = () => {
    const [modalVisible,setModalVisible] = React.useState(true)
    const navigation = useNavigation()

    return (
        <>
            <Modal 
                isVisible={modalVisible}
                deviceWidth={Dimensions.get('screen').width}
                deviceHeight={Dimensions.get('screen').height}
                onBackdropPress={() => navigation.goBack()}
                onSwipeComplete={() => navigation.goBack()}
                swipeDirection="left"
                style = {addPost.modalContainer}
                >
                <View style={addPost.modalView}>
                    <Text style = {addPost.modalHeading}>Review:</Text>
                    <Text style = {addPost.modalText}>Try content</Text>
                </View>
            </Modal>
        </>
    )
}

export default NewPostModal

const styles = StyleSheet.create({})
