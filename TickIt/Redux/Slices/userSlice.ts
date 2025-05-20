import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import{user} from '@/constants/Types';

const initialState:user={
    uid:'',
    name:'',
    email:'',
    item:[]
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setUser(state, action: PayloadAction<user>) {
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.uid = action.payload.uid;
        state.item=action.payload.item
      },
      clearUser(state) {
        state={name:'',email:'',uid:'',item:[]};
      },
      addItem(state, action:PayloadAction<string>)
      {
        return {
          ...state,
          item: [...state.item, action.payload]
        };
      },
      removeItem(state, action:PayloadAction<string>)
      {
        state.item.filter(item=>item!==action.payload);
      }

    },
  });

  export const {setUser,clearUser,addItem,removeItem}=userSlice.actions;
  export default userSlice.reducer;