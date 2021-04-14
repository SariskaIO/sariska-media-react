import { ADD_PARTICIPANT, DECREASE_COUNT, GET_PARTICIPANTS, INCREASE_COUNT, GET_PARTICIPANT_BY_ID, ADD_PARTICIPANTS_ID_LIST } from "../actions/actionTypes";

const initialState = {
    // countNumber: [],
    // result: 20,
    participantList: [],
    participant: {},
    idList: [],
}

export const participantReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_PARTICIPANT:
            return {
                ...state,
                participantList: action.payload
            };
        case GET_PARTICIPANTS:
            return {
                participantList: state.participantList
            };
        case GET_PARTICIPANT_BY_ID:
            return {
                ...state,
                participant: state.participantList.find(p=>(p._id||p.id)===action.payload)
            };
        case ADD_PARTICIPANTS_ID_LIST:
            return{
                ...state,
                idList:  [state.idList, action.payload].flat().filter(Number)
            };
        default:
            return state;
    }
}

// export const countReducer = (state=initialState, action) => {
//     console.log('state', state.countNumber);
//     switch(action.type) {
//         case INCREASE_COUNT:
//              return {
//                  ...state,
//                  countNumber: [...state.countNumber, action.payload],
//                  result: state.result+10
//              } ;
            
//         case DECREASE_COUNT:
//             return {
//                 countNumber: state.countNumber-1
//             };
//         default:
//             return state;
//     }
// }