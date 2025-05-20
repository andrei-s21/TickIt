import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseconfig";

export const singUp= async(email:string,password:string)=>{

    try{
        const userCredential= await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user
    }catch(error){
        console.log(error);
        throw error;
    }

}

export const signIn= async(email:string, password:string)=>{
    try{
        const user= await signInWithEmailAndPassword(auth,email,password);
        return user.user;
    }catch(error){
        console.log(error)
    }
}