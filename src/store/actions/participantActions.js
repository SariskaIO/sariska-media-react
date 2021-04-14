import { ADD_PARTICIPANT, DECREASE_COUNT, GET_PARTICIPANTS, INCREASE_COUNT, GET_PARTICIPANT_BY_ID, ADD_PARTICIPANTS_ID_LIST } from "./actionTypes"

export const addParticipant=(participant) => {
    return {
        type: ADD_PARTICIPANT,
        payload: participant
    }
}

export const getParticipants = () => {
    return {
        type: GET_PARTICIPANTS
    }
}

export const getParticipantById = (id) => {
    return {
        type: GET_PARTICIPANT_BY_ID,
        payload: id
    }
}

export const addParticipantsIdList=(ids)=>{
    return {
        type: ADD_PARTICIPANTS_ID_LIST,
        payload: ids
    }
}

export const increaseCount = (num) => {
    return {
        type: INCREASE_COUNT,
        payload: num
    }
}

export const decreaseCount = () => {
    return {
        type: DECREASE_COUNT,
    }
}