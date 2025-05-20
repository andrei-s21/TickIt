import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {StyleSheet,Text, TouchableOpacity,Image, View, ScrollView, TextInput, FlatList, Alert} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import { Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { user,item, list, RootStackParamList } from "@/constants/Types"
import {ref, get, push, set, onValue} from "firebase/database"
import { db } from "@/firebaseconfig";


const MainScreen=()=>{
    const [isVisible,setIsVisible]=useState(false);
    const toggleModal=()=>{setIsVisible(!isVisible);};
    const [user,setUser]=useState<user>();
    const [List,setList]=useState<list[]>([])
    
    const[visibleAdd,setVisibleAdd]=useState(false);
    const toggleAdd=()=>{
        setVisibleAdd(!visibleAdd);
        setItemList([]);
        setTitle('');
        setDescription('');
        contor=0;
    };
    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');
    const [Item,setItem]=useState('');
    let contor=0;
    let userID;


    const [itemList,setItemList]=useState<item[]>([]);
    const additem=()=>{
        if(Item!==''){
            setItemList([...itemList,{title:Item,uid:contor++,checked:false}]);
            setItem('');
        }else Alert.alert('Error','Need to specify a task');
    };
    const renderItem=({item}:{item:item}) =>{
        return <View style={styles.viewCard}><Text style={styles.TextCard}>{item.title}</Text></View>
    }

    useEffect(()=>{getData()},[]);

    const getData= async ()=>{
        await new Promise(resolve => setTimeout(resolve, 1000))
        userID=await AsyncStorage.getItem('userID');
        if(userID==null||userID==''){
            console.log('user de la async null'); 
            Alert.alert('Error','Unable to load user ID');
            navigator.dispatch(CommonActions.reset({
                                index:0,
                                routes:[{name:'Login'}],
                            }));
            return;
        }
        try{
           
            onValue(ref(db,'users/'+userID), (snapshot) => {
                if (snapshot.exists()) {
                    setUser(snapshot.val());
                    fetchItems();
                    console.log('fetch apelat')
                }
                
            },(error)=>{console.log(error)})
        
        }catch(error){
            console.log(error);
            Alert.alert('Error','Something went wrong');
        }
        
    }

    const fetchItems=async ()=>{
        setList([]);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const newArray:list[]=[];
        for(const item in user?.item){     
            console.log(item)
            const snap=await get(ref(db,'items/'+user.item[Number(item)]));
            
            if(snap.exists()){
                newArray.push(snap.val());
            }
            else {console.log('snapshot!=exists');return;}
        }
        setList(newArray)
    }

    useEffect(()=>{console.log(user);},[user])


    const navigator=useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    const disconnect=()=>{
        AsyncStorage.clear();
        navigator.dispatch(CommonActions.reset({
                            index:0,
                            routes:[{name:'Login'}],
                        }));
    }

    const saveData=async ()=>{
        if(title!==''&&description!==''&&itemList.length>0){
            try{
                const uid= await push(ref(db,'items')).key;
                const item:list={title:title,description:description,creator:user?.uid??'',items:itemList,uid:uid||''};
                setList([...List,item]);
                await set(ref(db,'items/'+uid),item);
                
                await new Promise(resolve => setTimeout(resolve, 2000));
                await set(ref(db,'users/'+item.creator+'/item'),[...(user?.item||[]),uid]);
                console.log(List);
                toggleAdd();
            }catch(error) {
                Alert.alert('Error','Something went wrong, please try again');
                toggleAdd();
            }    
        }else Alert.alert('Error','All Fields need to be filled');
    }

    const renderitem2=({item}:{item:list})=>{
        
        let done:boolean=true;
        item.items.every((a:item)=>{
            if(!a.checked)
                done=false;
        })
        return <TouchableOpacity style={styles.viewCard}>
            <Text>
                {item.title}
            </Text>
            {done&&<View><Image source={require('@/assets/images/check.png')}/></View>}
        </TouchableOpacity>
    }

    return <>
        <StatusBar  translucent={true}  />
    <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.userContainer} onPress={toggleModal}>
                <Image style={styles.user} source={require("@/assets/images/user.png")}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addContainer} onPress={toggleAdd}>
                <Image style={styles.add} source={require("@/assets/images/plus.png")}/>
            </TouchableOpacity>
        </View>
        
            <FlatList data={List} renderItem={renderitem2} style={{width:'100%'}} keyExtractor={(_, index) => index.toString()}/>
        
            <Modal style={styles.modal} transparent={true} visible={isVisible} animationType="slide" onRequestClose={toggleModal}>
                <View style={styles.modalView}>
                    <View style={styles.modalContainer}>
                         <View style={styles.modalTextContainer}>
                            <Text style={styles.modalText}>{user?.name??''}</Text>
                         </View>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={toggleModal}>
                                <Text style={styles.modalCancelTextButton}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalDisconnectButton} onPress={disconnect}>
                                <Text style={styles.modalDisconnectTextButton}>Disconnect</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal style={styles.modal} transparent={false} visible={visibleAdd} animationType="slide" onRequestClose={toggleAdd}>
                <View style={styles.viewAdd}>
                    <View style={styles.headerAdd}>
                        <TouchableOpacity style={styles.headerAddBack} onPress={toggleAdd}>
                            <Image style={styles.headerAddBackImage} source={require('@/assets/images/arrow.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerAddSave} onPress={saveData}>
                            <Text style={styles.headerAddSaveText}>
                                Save
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput style={styles.headerAddTitleInput} placeholderTextColor={"#4b6bab"} placeholder="Title" onChangeText={setTitle} value={title}/>
                    <TextInput style={styles.headerAddDescriptionInput} placeholderTextColor={"#4b6bab"} placeholder="Description" onChangeText={setDescription} value={description}/>
                    <View style={styles.headerAddViewTask}>
                        <TextInput style={styles.headerAddViewTaskInput} placeholderTextColor={"#4b6bab"} placeholder="Task" onChangeText={setItem} value={Item}/>
                        <TouchableOpacity style={styles.headerAddViewTaskImageTouch} onPress={additem} >
                            <Image style={styles.headerAddViewTaskImage} source={require('@/assets/images/plus.png')}/>
                        </TouchableOpacity>
                    </View>
                    <FlatList data={itemList} renderItem={renderItem} style={{width:'100%'}}>

                    </FlatList>
                </View>
            </Modal>
        <ScrollView>

        </ScrollView>
    </SafeAreaView>
    </>
    
}

const styles=StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:Colors.background,
        alignItems:'center',
    },
    header:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:10,
        borderBottomWidth:2,
        borderColor:Colors.border
    },
    userContainer:{
        margin:10,
        backgroundColor:Colors.border,
        borderRadius:30,
        padding:15
    },
    user:{
        resizeMode:'contain',
        width:25,
        height:25,
    },
    addContainer:{
         margin:10,
        backgroundColor:Colors.border,
        borderRadius:30,
        padding:15
    },
    add:{
        resizeMode:'contain',
        width:25,
        height:25,
    },
    modal:{
        
    },
    modalView:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#00000000',
    },
    modalContainer:{
        backgroundColor: Colors.border,
        width:'70%',
        height:'25%',
        borderRadius:20,
        alignItems:'center',
        justifyContent:'space-around',


    },
    modalTextContainer:{
        backgroundColor:'lightgrey',
        padding:10,
        borderRadius:23,
        width:'100%',
        alignItems:'center',
        marginTop:-35
    },
    modalText:{
        color:Colors.border,
        fontSize:18
    },
    modalButtonContainer:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        width:'100%',
        
    },
    modalDisconnectButton:{
        backgroundColor:'#D04547',
        padding:10,
        borderRadius:20
    },
    modalCancelButton:{
        backgroundColor:Colors.background,
        padding:10,
        borderRadius:20
    },
    modalCancelTextButton:{
        fontSize:15,
        color:'white'
    },
    modalDisconnectTextButton:{
        fontSize:15,
        color:'black'
    },
    viewAdd:{
        flex:1,
        backgroundColor:Colors.background,
        alignItems:'center',
    },
    headerAdd:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
    },
    headerAddBack:{
        padding:10,
        margin:8,
        backgroundColor:Colors.border,
        borderRadius:30
    },
    headerAddBackImage:{
        resizeMode:'contain',
        width:30,
        height:30,
    },
    headerAddSave:{
        padding:10,
        margin:8,
        backgroundColor:Colors.border,
        borderRadius:30
    }, 
    headerAddSaveText:{
        color:'white',
        fontSize:20
    },
    headerAddTitleInput:{
        borderBottomColor:Colors.underline,
        borderBottomWidth:2,
        width:'90%',
        fontSize:20,
        marginTop:50,
        color:'white',
    },
    headerAddDescriptionInput:{
        borderBottomColor:Colors.underline,
        borderBottomWidth:2,
        width:'90%',
        fontSize:20,
        color:'white',
        
    },
    headerAddViewTask:{
        display:'flex',
        flexDirection:'row',
        marginTop:30,
        width:'90%',
        justifyContent:'space-between',
        marginBottom:15,
    },
    headerAddViewTaskImageTouch:{
        padding:10,
        backgroundColor:Colors.border,
        borderRadius:30,
        alignItems:'center',
        justifyContent:'center'
    },
    headerAddViewTaskImage:{
        resizeMode:'contain',
        width:30,
        height:30
    },
    headerAddViewTaskInput:{
        flex:1,
        borderBottomColor:Colors.underline,
        borderBottomWidth:2,
        marginRight:10,
        fontSize:18,
        color:'white',
    },
    viewCard:{
        backgroundColor:Colors.border,
        margin:5,
        width:'90%',
        alignSelf:'center',
        alignItems:'center',
        borderRadius:30,
    },
    TextCard:{
        fontSize:20,
        color:'white',
        padding:5,
    }


})

export default MainScreen;