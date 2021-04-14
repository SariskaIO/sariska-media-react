import React, { createContext, useReducer } from "react";
import { getToken } from "../utils";

export const ParticipantContext = createContext();


const FetchToken = async () => {
    const token = await getToken();
    if(!token)
    window.localStorage.setItem('token', token);
    
}

//getToken().then(val => window.localStorage.setItem('token', val))


FetchToken();

const initialState = {  
    participants: [],
    token: window.localStorage.getItem('token')
}

const reducer = (state, action) => {
    console.log('initial', state);
    switch(action.type) {
        case 'ADD_PARTICIPANT':
            return {
                participants: action.payload
            };
        // case 'REM_PARTICIPANT':
        //     return {
        //         participants: state.participants.filter(
        //             participant => (participant.id || participant._id)!==action.payload
        //         )
        //     };
        case 'GET_PARTICIPANTS': 
        return {
            ...state.participants
        };
        case 'GET_TOKEN':
            return {
                ...state.token
            };
        default: 
            return {...state};
    }
}
// const initialState = {count: []};

// function reducer(state, action) {
//   console.log('state', state);
//   switch (action.type) {
//     case 'increment':
//       return {count: [...state.count, action.payload]};
//     case 'decrement':
//       return {count: state.count - 1};
//     default:
//       throw new Error();
//   }
// }


export const ParticipantContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <ParticipantContext.Provider value={[state, dispatch]}>
            {props.children}
        </ParticipantContext.Provider>
    )
}