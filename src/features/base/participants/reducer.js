import { DOMINANT_SPEAKER_CHANGED, GRANT_MODERATOR, KICK_PARTICIPANT, MUTE_REMOTE_PARTICIPANT, PARTICIPANT_DISPLAY_NAME_CHANGED, PIN_PARTICIPANT } from "./actionTypes";

export const participantReducer=(state, action)=>{
    switch(action.type){
        case DOMINANT_SPEAKER_CHANGED: {
            // Ensure the raised hand state is cleared for the dominant speaker
            // and only if it was set when this is the local participant
    
            const { conference, id } = action.participant;
            const participant = getLocalParticipant(store.getState());
            const isLocal = participant && participant.id === id;
    
            if (isLocal && participant.raisedHand === undefined) {
                // if local was undefined, let's leave it like that
                // avoids sending unnecessary presence updates
                break;
            }
    
            participant
                && store.dispatch(participantUpdated({
                    conference,
                    id,
                    local: isLocal,
                    raisedHand: false
                }));
    
            break;
        }
        case GRANT_MODERATOR: {
            const { conference } = store.getState()['features/base/conference'];
    
            conference.grantOwner(action.id);
            break;
        }
        case KICK_PARTICIPANT: {
            const { conference } = store.getState()['features/base/conference'];
    
            conference.kickParticipant(action.id);
            break;
        }
    
        case MUTE_REMOTE_PARTICIPANT: {
            const { conference } = store.getState()['features/base/conference'];
    
            conference.muteParticipant(action.id, action.mediaType);
            break;
        }
        case PARTICIPANT_DISPLAY_NAME_CHANGED: {
            if (typeof APP !== 'undefined') {
                const participant = getLocalParticipant(store.getState());
    
                if (participant && participant.id === action.id) {
                    APP.UI.emitEvent(UIEvents.NICKNAME_CHANGED, action.name);
                }
            }
    
            break;
        }
        case PIN_PARTICIPANT:
        return state.map(p => _participant(p, action));

        
    }
}

