import { DOMINANT_SPEAKER_CHANGED, GRANT_MODERATOR, KICK_PARTICIPANT } from "./actionTypes";

export function dominantSpeakerChanged(id, conference) {
    return {
        type: DOMINANT_SPEAKER_CHANGED,
        participant: {
            conference,
            id
        }
    };
}

export function grantModerator(id) {
    return {
        type: GRANT_MODERATOR,
        id
    };
}

export function kickParticipant(id) {
    return {
        type: KICK_PARTICIPANT,
        id
    };
}

