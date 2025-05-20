export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainScreen:undefined;
    DetailScreen:undefined;
};


export type user={
    uid:string;
    name:string;
    email:string;
    item:string[];
}

export type item={
    uid:number;
    title:string;
    checked:boolean;
}

export type list={
    uid:string;
    title:string;
    description:string;
    creator:string;
    items:item[];
}