import { list } from '@/constants/Types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState:list[]=[];
 const listSlice=createSlice({
    name: 'items',
    initialState,
    reducers: {
        setList(state, action:PayloadAction<list[]>){
            return action.payload;
        },
        addListItem(state,action:PayloadAction<list>){
           state.push(action.payload);
        },
        removeListItem(state,action:PayloadAction<string>){
            return state.filter(item=>item.uid!==action.payload);
        }


    }});

    export const {setList, addListItem,removeListItem}=listSlice.actions;
    export default listSlice.reducer;