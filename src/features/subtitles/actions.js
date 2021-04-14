import { ENDPOINT_MESSAGE_RECEIVED, REMOVE_TRANSCRIPT_MESSAGE, TOGGLE_REQUESTING_SUBTITLES, UPDATE_TRANSCRIPT_MESSAGE } from "./actionTypes";

export function endpointMessageReceived(participant, json) {
    return {
        type: ENDPOINT_MESSAGE_RECEIVED,
        participant,
        json
    };
}

export function removeTranscriptMessage(transcriptMessageID) {
    return {
        type: REMOVE_TRANSCRIPT_MESSAGE,
        transcriptMessageID
    };
}

export function updateTranscriptMessage(transcriptMessageID, newTranscriptMessage) {
return {
    type: UPDATE_TRANSCRIPT_MESSAGE,
    transcriptMessageID,
    newTranscriptMessage
};
}

export function toggleRequestingSubtitles() {
    return {
        type: TOGGLE_REQUESTING_SUBTITLES
    };
}