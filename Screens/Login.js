import React, {useState,useEffect} from "react";
import { Animated,Easing, Text, View, TextInput, Button, TouchableOpacity, Platform, ToastAndroid , Keyboard , ImageBackground, Dimensions , ScrollView, Image} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import { useNavigation } from '@react-navigation/native';
import { firebaseConfig } from "./exports";
import { login } from "./styles";


try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  // ignore app already initialized error in snack
}

export default function Login() {

  const navigation = useNavigation()

  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  
  const [message, showMessage] = React.useState((!firebaseConfig || Platform.OS === 'web')
    ? { text: "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device."}
    : undefined);

  const [loginClick,setLoginClick] = React.useState(false)
  const [valid,setValid] = React.useState(false)
  const [otpvalid,setOTPValid] = React.useState(false)
  const [length,setLength] = React.useState(0)
  const [number, setNumber] = React.useState("");
  const [otplength,setOTPLength] = React.useState(0)
  const [otpnumber, setOTPNumber] = React.useState("");
  



  const [resendButtonDisabledTime, setResendButtonDisabledTime] =  React.useState(60);
  const [isAndroid, setAndroid] = React.useState(true)
  const [attemptsRemaining,setAttemptsRemaining] = React.useState(3)
  

  const [screen,setScreen] = React.useState(false)
  const [mins, setMins] = useState(0)
  const [secs, setSecs] = useState(60)
  
  
  React.useEffect(()=>{



    const timerId = setInterval(() => {
      if (secs <= 0) {
        setSecs(-1)
      }
      else setSecs(s => s - 1)
    }, 1000)
    return () => {
 
      clearInterval(timerId);}
  },[secs])



  const onChangeNumber = (text) => {
      setNumber(text)
      setPhoneNumber("+91" + text)
      setLength(text.length)
    //  console.log(text.length)
      if(text.length === 10) {
        setValid(true)
        Keyboard.dismiss(false)
      } else {
        setValid(false)
      }
    }

    const onChangeOTP = (text) => {
      setOTPNumber(text)
      setOTPLength(text.length)
    //  console.log(text.length)
      if(text.length === 6) {
        setOTPValid(true)
        Keyboard.dismiss(false)
      } else {
        setOTPValid(false)
      }
    }


  const onPressLogin = async () => {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber,recaptchaVerifier.current);
      setVerificationId(verificationId);
      ToastAndroid.show("Verification code has been sent to your phone",ToastAndroid.SHORT)
      setLoginClick(true)
      setScreen(true)
    } catch (err) {
      ToastAndroid.show("Please wait or try again later !!",ToastAndroid.SHORT )
      setLoginClick(true)
    }
  }




  const onSubmit = async () => {
  
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId,otpnumber);
      await firebase.auth().signInWithCredential(credential);
      navigation.navigate("HomeTab" , {userId : phoneNumber})
      console.log("it logged in")
    } catch (err) {
      console.log("it didnt log in")
    }
  }

  return (
    
    <ScrollView 
      contentContainerStyle={login.contentContainer}
      style={login.container}>
      {!screen ?  (
      <View style = {login.loginViewContainer}> 
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <View style = {login.loginViewCoverContainer}>
        <Image
          source = {require("../assets/A500T.png")}
          style = {{width : 300 , height : 300}}
          />
      </View>
      <View style={login.loginViewPhoneNumberHeaderContainer}>
        <Text style={login.loginViewPhoneNumberHeaderText}>Enter phone number</Text>
      </View>
      <View style = {login.loginViewPhoneNumberInputContainer}>
      <View style = {login.loginViewPhoneNumberInputCountryContainer}>
            <Text style = {login.loginViewPhoneNumberInputCountryText}>+91</Text>
      </View>
      <TextInput
        style={length ? login.loginViewPhoneNumberInputNumberInput : [login.loginViewPhoneNumberInputNumberInput, {fontSize : 12, letterSpacing : 1 }]  }
        placeholder="10 Digit mobile number"
        autoFocus
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={(phoneNumber) => onChangeNumber(phoneNumber)}
        value = {number}
      />
      
        <TouchableOpacity onPress={onPressLogin}>
          <Text>GET OTP</Text>
        </TouchableOpacity> 
      </View>
      <View style = {login.loginViewFooterContainer} />
      </View>
      ) : (
      <View style = {login.validationViewContainer}>
      <View style = {login.validationViewCoverContainer}>
        <Image
          source = {require("../assets/A500T.png")}
          style = {{width : 200 , height : 200}}
          />
      </View>
      <View style = {login.validationViewOTPContainer}>
        <Text style = {login.validationViewOTPHeader}> Enter OTP </Text>
     
      <View style = {login.validationViewOTPBoxesContainer}>
      <TextInput
        style={length ? login.loginViewPhoneNumberInputNumberInput : [login.loginViewPhoneNumberInputNumberInput, {fontSize : 12, letterSpacing : 1 }]  }
        placeholder="Please enter your 6 digit OTP"
        autoFocus
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={(otp) => onChangeOTP(otp)}
        value = {otpnumber}
      />
      </View>
      
      {
        secs > 0 ?
        <Text style = {login.validationViewResendOTPInactiveText}>Resend OTP in 0{mins}:{secs < 10 ? "0"+secs : secs}</Text> :
        <TouchableOpacity 
          style = {login.validationViewResendOTPButton}
          onPress={()=>{
            setScreen(false)
            setAttemptsRemaining(attemptsRemaining-1)
            setSecs(60)

          }}>
            <Text style = {login.validationViewResendOTPActiveText}> Resend OTP </Text>
        </TouchableOpacity>
      }
      <Text style = {login.validationViewResentOTPAttemptsText}> {attemptsRemaining} Attempts Remaining</Text>
      </View>
       <TouchableOpacity style = {login.validationViewSubmitButton} 
        onPress = {onSubmit} 
        >
        <Text style = {login.validationViewSubmitText}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
      )}
    </ScrollView>
  );
}
