import React, { useRef } from "react"
import { StatusBar } from "expo-status-bar"
import { Text, View, StyleSheet, SafeAreaView, Animated, TextInput, TouchableOpacity, Alert } from "react-native"
import { Image } from "react-native"
import { useState, useEffect } from "react"
import { CommonActions, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/constants/Types"
import { Colors } from "@/constants/Colors"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AuthErrorCodes, User } from "firebase/auth"
import { signIn } from "@/hooks/useAuth"
import {ref, onValue} from "firebase/database"
import { db } from "@/firebaseconfig"
import { FirebaseError } from "firebase/app"
import { user } from "@/constants/Types"


const Login=()=>{
    
    const[showView,setShowView]=useState(false);
    const[username,setUsername]=useState('');
    const[password,setPassword]=useState('');
    const[secure,setSecure]=useState(true);
    const[startAnimation,setStartAnimation]=useState(false);
    

    const position = useRef(new Animated.Value(0)).current;
    const position2=useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const opacity=useRef(new Animated.Value(0)).current;
    

    const path=secure?require("../assets/images/right_eye.png"):require("../assets/images/left_eye.png")
    const navigator=useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    useEffect(()=>{
        //AsyncStorage.clear();
        fetch();
    },[])
    const fetch=async()=>{
        const data=await AsyncStorage.getItem('userID');
        if(data==null||data=='')
        {
            setStartAnimation(true);
            return;
        }else{
            try{
                navigator.dispatch(CommonActions.reset({
                    index:0,
                    routes:[{name:'MainScreen'}],
                }));

            }catch(error){
                Alert.alert('Error','Ooops..., something went wrong, please try again'+error);
                return;
            }
            
        }
    }
    useEffect(()=>{

    if(startAnimation){
        Animated.parallel([
            Animated.timing(position,{toValue:-180,duration:800,useNativeDriver:true}),
            Animated.timing(scale,{toValue:0.5,duration:1200,useNativeDriver:true}),
        ]).start(()=>{
            setShowView(true);
            Animated.parallel([
                Animated.timing(position2,{toValue:-370, duration:1200,useNativeDriver:true}),
                Animated.timing(opacity,{toValue:1, duration:2000, useNativeDriver:true})
            ]).start(()=>{})
        });
        }
    },[startAnimation]);

    const signin=async()=>{
        if(username!=''&&password!=""){
            try{
                const userData=await signIn(username,password);
                AsyncStorage.setItem('userID',userData?.uid??'');
                navigator.dispatch(CommonActions.reset({
                    index:0,
                    routes:[{name:'MainScreen'}],
                }));

            }catch(error){
                if(error instanceof FirebaseError)
                {
                    if(error.code==AuthErrorCodes.INVALID_PASSWORD)
                         Alert.alert('Error','Incorect password');
                    else if(error.code==AuthErrorCodes.INVALID_EMAIL)
                        Alert.alert('Error','Invalid email addres');   
                }
                Alert.alert('Error','Ooops..., something went wrong, please try again'+error);
                return;
            }
        }else Alert.alert('Error','All fields need to be completed');
    }


 return<>
 <StatusBar  translucent={true}  />
 <SafeAreaView style={styles.container}>
    <Animated.View style={[styles.imageContainer,{transform:[{translateY:position},{scale:scale}]}]}>
        <Image source={require('../assets/images/Tick.png')} style={styles.image}></Image>
        
    </Animated.View>
    <Animated.View style={[styles.inputContainer,{opacity:opacity,transform:[{translateY:position2}]}]}>
        <Text style={styles.inputText}>Email</Text>
        <TextInput 
            style={styles.inputFields}
            onChangeText={setUsername}
            placeholder="popadrian@gmail.com" placeholderTextColor={"#4b6bab"}/>
        <Text style={styles.inputText}>Password</Text>
        <View style={{width:"100%",height:'auto', alignItems:"center"}}>
            <TextInput 
            style={styles.inputFields}
            onChangeText={setPassword}
            secureTextEntry={secure}
            placeholder="Password" placeholderTextColor={"#4b6bab"}/>
            <TouchableOpacity onPress={()=>setSecure(!secure)} style={{position:'absolute',right:22,top:-100}}>
                <Image source={path} style={{resizeMode:"contain", width:20}}/>
            </TouchableOpacity>
        </View>
        <View style={styles.viewButtons}>
            <TouchableOpacity style={styles.touchButtons} onPress={signin}>
                <Text style={styles.textButtons}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchButtons} onPress={()=>navigator.navigate('Register')}>
                <Text style={styles.textButtons}>Register</Text>
            </TouchableOpacity>
        </View>
    </Animated.View> 
 </SafeAreaView>
 </>
}
export default Login

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',  
        alignItems: 'center',
        backgroundColor:Colors.background
    },
    image:{
        marginTop:350,
        width:300,
        resizeMode:'contain'
    },
    imageContainer: {
        width: 350,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer:{
        borderColor:Colors.border,
        borderRadius:20,
        shadowOffset:{width:-2,height:4},
        shadowColor:'#8ca4cc',
        shadowRadius:0,
        shadowOpacity:100,
        borderWidth:2,
        padding:20,
        width:"90%",
        alignItems:"center"
    },
    inputText:{
        fontSize:19,
        margin:15,
        color:"white"
    },
    inputFields:{
        width:"85%",
        color:"white",
        fontSize:18,
        borderBottomWidth:2,
        borderColor:Colors.underline
    },
    viewButtons:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        marginTop:23,
        alignItems:'center',
        justifyContent:'space-around',
    },
    textButtons:{
        fontSize:20,
        color:'white',
        padding:7
    },
    touchButtons:{
        borderColor:'#122346',
        borderWidth:2,
        borderRadius:10
    }
});