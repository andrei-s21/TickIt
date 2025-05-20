import React, { useState } from "react";
import { StyleSheet,SafeAreaView ,Text,View, Image, TouchableOpacity, TextInput, ScrollView, Alert} from "react-native";
import { Colors } from "@/constants/Colors";
import { RootStackParamList } from "@/constants/Types"
import { CommonActions, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { singUp } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "@/firebaseconfig";
import { AuthErrorCodes } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { ref, set } from "firebase/database";


const RegisterScreen=()=>{
    const navigator=useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const[secure1,setSecure1]=useState(true);
    const[secure2,setSecure2]=useState(true);
    const[name,setName]=useState<String>("");
    const[email,setEmail]=useState('');
    const[password1,setPassword1]=useState('');
    const[password2,setPassword2]=useState('');
    const path1=secure1?require("../assets/images/right_eye.png"):require("../assets/images/left_eye.png");
    const path2=secure2?require("../assets/images/right_eye.png"):require("../assets/images/left_eye.png");

    const signup=async()=>{
        if(name==""||email==""||password1==""||password2=="")
            Alert.alert("Error","All fields need to be filled");
        else if(password1!=password2)
            Alert.alert("Error","Passwords do not match");
        else{
            try{
                const user=await singUp(email,password1);
                console.log("User creat");
                console.log(user?.uid);
                await AsyncStorage.setItem('userID',user.uid);
                await set(ref(db,'users/'+user.uid),{
                    uid:user.uid,
                    name:name,
                    email:user.email,
                    list:[]
                });
                navigator.dispatch(CommonActions.reset({
                                    index:0,
                                    routes:[{name:'MainScreen'}],
                                }));
                
            }catch(error){
                console.log(error);
                if(error instanceof FirebaseError)
                {
                    if (error.code==AuthErrorCodes.INVALID_EMAIL) 
                        Alert.alert("Error","Invalid email");
                    else if(error.code==AuthErrorCodes.EMAIL_EXISTS)
                        Alert.alert("Error","Email allready exists") 
                    else if(error.code==AuthErrorCodes.WEAK_PASSWORD)
                        Alert.alert("Error","Password should be at least 6 characters") 
                }
                
            }
        } 
        
    }

    return <SafeAreaView style={styles.screen}>
        <ScrollView style={{flex:1}}>
        <TouchableOpacity style={styles.arrowContainer} onPress={()=>{navigator.goBack();}}>
            <Image source={require('../assets/images/arrow.png')} style={styles.arrowImg}/>
        </TouchableOpacity>
        <View style={styles.fieldesContainer}>
            <Text style={styles.textInput}>Name</Text>
            <TextInput style={styles.fieldInput} onChangeText={setName} placeholder="Pop Alexandru" placeholderTextColor={"#4b6bab"}/>
            <Text  style={styles.textInput}>Email</Text>
            <TextInput style={styles.fieldInput} onChangeText={setEmail} placeholder="popalexandru@gmail.com" placeholderTextColor={"#4b6bab"}/>
            <Text  style={styles.textInput}>Password</Text>
            <View style={styles.fieldInputContainer}>
                <TextInput style={styles.fieldInput} onChangeText={setPassword1} placeholder="Password" placeholderTextColor={"#4b6bab"} secureTextEntry={secure1}/>
                <TouchableOpacity onPress={()=>setSecure1(!secure1)} style={styles.fieldImgContainer}>
                    <Image source={path1} style={styles.fieldImg}/>
                </TouchableOpacity>
            </View>
            <Text  style={styles.textInput}>Confirm Password</Text>
            <View style={styles.fieldInputContainer}>
                <TextInput style={styles.fieldInput} onChangeText={setPassword2} placeholder="Confirm Password" placeholderTextColor={"#4b6bab"} secureTextEntry={secure2}/>
                <TouchableOpacity onPress={()=>setSecure2(!secure2)} style={styles.fieldImgContainer}>
                    <Image source={path2} style={styles.fieldImg}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button}onPress={signup}>
                <Text style={styles.textInput}>Register</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    </SafeAreaView>
}


const styles=StyleSheet.create({
    screen:{
        backgroundColor:Colors.background,
        flex:1,
        justifyContent:'center'
    },
    arrowContainer:{
        backgroundColor:Colors.border,
        marginTop:50,
        margin:10,
        borderRadius:25,
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        position:'relative',
        bottom:10,
    },
    arrowImg:{
        
        height:35,
        resizeMode:'contain',
        width:'90%'
    },
    fieldesContainer:{
        borderWidth:3,
        borderColor:Colors.border,
        width:'90%',
        alignSelf:'center',
        alignItems:'center',
        borderRadius:20,
        padding:25,
        marginTop:'25%'
    },
    textInput:{
        color:'white',
        fontSize:19,
        margin:10,
    },
    fieldInput:{
        borderBottomWidth:1,
        borderColor:Colors.underline,
        width:'90%',
        color:"white",
    },
    fieldInputContainer:{
        width:'100%',
        flexDirection:'row',
        marginLeft:30
    },
    fieldImg:{
        resizeMode:'contain',
        width:25,
        height:25,
    },
    fieldImgContainer:{
        position:'absolute',
        left:220,
    },
    button:{
        borderWidth:2,
        marginTop:20,
        borderRadius:15,
        borderColor:'#122346'
    }
});

export default  RegisterScreen