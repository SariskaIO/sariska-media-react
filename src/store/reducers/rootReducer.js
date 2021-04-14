import { combineReducers } from "redux"
import { countReducer, participantReducer } from "./participantsReducer"

export const rootReducer = combineReducers({
        participants: participantReducer,
        //count: countReducer
    })
