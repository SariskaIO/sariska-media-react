import { toState } from "../../../store/base/functions";
import { HIDDEN_PARTICIPANT_JOINED, HIDDEN_PARTICIPANT_LEFT, PARTICIPANT_JOINED, PARTICIPANT_KICKED, PARTICIPANT_LEFT, PARTICIPANT_UPDATED } from "./actionTypes";
import { PARTICIPANT_ROLE } from "./constants";

var interfaceConfig;

export function getLocalParticipant(stateful) {
    const participants = _getAllParticipants(stateful);

    return participants.find(p => p.local);
}

export function getNormalizedDisplayName(name) {
    if (!name || !name.trim()) {
        return undefined;
    }

    return name.trim().substring(0, MAX_DISPLAY_NAME_LENGTH);
}

export function getParticipantById(stateful, id) {
const participants = _getAllParticipants(stateful);

return participants.find(p => p.id === id);
}

export function getParticipantCount(stateful) {
    return getParticipants(stateful).length;
}

export function getParticipantDisplayName(stateful, id ) {
const participant = getParticipantById(stateful, id);

if (participant) {
    if (participant.name) {
        return participant.name;
    }

    if (participant.local) {
        return typeof interfaceConfig === 'object'
            ? interfaceConfig.DEFAULT_LOCAL_DISPLAY_NAME
            : 'me';
    }
}

return typeof interfaceConfig === 'object'
    ? interfaceConfig.DEFAULT_REMOTE_DISPLAY_NAME
    : 'Fellow Sariskan';
}

export function getParticipantPresenceStatus(stateful, id) {
if (!id) {
    return undefined;
}
const participantById = getParticipantById(stateful, id);

if (!participantById) {
    return undefined;
}

return participantById.presence;
}

export function getParticipants(stateful) {
    return _getAllParticipants(stateful).filter(p => !p.isFakeParticipant);
}

export function getPinnedParticipant(stateful) {
    return _getAllParticipants(stateful).find(p => p.pinned);
}

export function _getAllParticipants(stateful) {
    return (
        Array.isArray(stateful)
            ? stateful
            : toState(stateful)['features/base/participants'] || []);
}

export function isParticipantModerator(participant) {
    return participant && participant.role === PARTICIPANT_ROLE.MODERATOR;
}

export function isEveryoneModerator(stateful) {
    const participants = _getAllParticipants(stateful);

    return participants.every(isParticipantModerator);
}

export function isLocalParticipantModerator(stateful) {
    const state = toState(stateful);
    const localParticipant = getLocalParticipant(state);

    if (!localParticipant) {
        return false;
    }

    return localParticipant.role === PARTICIPANT_ROLE.MODERATOR;
}

export function localParticipantJoined(participant = {}) {
    return participantJoined(set(participant, 'local', true));
}

export function localParticipantLeft() {
    return (dispatch, getState) => {
        const participant = getLocalParticipant(getState);

        if (participant) {
            return (
                dispatch(
                    participantLeft(
                        participant.id,

                        // XXX Only the local participant is allowed to leave
                        // without stating the JitsiConference instance because
                        // the local participant is uniquely identified by the
                        // very fact that there is only one local participant
                        // (and the fact that the local participant "joins" at
                        // the beginning of the app and "leaves" at the end of
                        // the app).
                        undefined)));
        }
    };
}

export function localParticipantRoleChanged(role) {
    return (dispatch, getState) => {
        const participant = getLocalParticipant(getState);

        if (participant) {
            return dispatch(participantRoleChanged(participant.id, role));
        }
    };
}

export function muteRemoteParticipant(id, mediaType) {
    return {
        type: MUTE_REMOTE_PARTICIPANT,
        id,
        mediaType
    };
}

export function participantJoined(participant) {
    // Only the local participant is not identified with an id-conference pair.
    if (participant.local) {
        return {
            type: PARTICIPANT_JOINED,
            participant
        };
    }

    // In other words, a remote participant is identified with an id-conference
    // pair.
    const { conference } = participant;

    if (!conference) {
        throw Error(
            'A remote participant must be associated with a JitsiConference!');
    }

    return (dispatch, getState) => {
        // A remote participant is only expected to join in a joined or joining
        // conference. The following check is really necessary because a
        // JitsiConference may have moved into leaving but may still manage to
        // sneak a PARTICIPANT_JOINED in if its leave is delayed for any purpose
        // (which is not outragous given that leaving involves network
        // requests.)
        const stateFeaturesBaseConference
            = getState()['features/base/conference'];

        if (conference === stateFeaturesBaseConference.conference
                || conference === stateFeaturesBaseConference.joining) {
            return dispatch({
                type: PARTICIPANT_JOINED,
                participant
            });
        }
    };
}

export function hiddenParticipantJoined(id, displayName) {
    return {
        type: HIDDEN_PARTICIPANT_JOINED,
        id,
        displayName
    };
}

export function hiddenParticipantLeft(id) {
    return {
        type: HIDDEN_PARTICIPANT_LEFT,
        id
    };
}

export function participantLeft(id, conference) {
    return {
        type: PARTICIPANT_LEFT,
        participant: {
            conference,
            id
        }
    };
}

export function participantRoleChanged(id, role) {
    return participantUpdated({
            id,
            role
    });
}

export function participantUpdated(participant = {}) {
    const participantToUpdate = {
            ...participant
    };
    if (participant.name) {
    participantToUpdate.name = getNormalizedDisplayName(participant.name);
    }
    return {
    type: PARTICIPANT_UPDATED,
    participant: participantToUpdate
    };
}

export function participantMutedUs(participant, track) {
    return (dispatch, getState) => {
    if (!participant) {
    return;
}

const isAudio = track.isAudioTrack();
dispatch(showNotification({
descriptionKey: isAudio ? 'notify.mutedRemotelyDescription' : 'notify.videoMutedRemotelyDescription',
titleKey: isAudio ? 'notify.mutedRemotelyTitle' : 'notify.videoMutedRemotelyTitle',
titleArguments: {
participantDisplayName:
getParticipantDisplayName(getState, participant.getId())
}
}));
};
}

export function participantKicked(kicker, kicked) {
    return (dispatch, getState) => {
    dispatch({
    type: PARTICIPANT_KICKED,
    kicked: kicked.getId(),
    kicker: kicker.getId()
    });
    dispatch(showNotification({
    titleArguments: {
    kicked:
    getParticipantDisplayName(getState, kicked.getId()),
    kicker:
    getParticipantDisplayName(getState, kicker.getId())
    },
    titleKey: 'notify.kickParticipant'
    }, NOTIFICATION_TIMEOUT * 2)); // leave more time for this
    };
}

export function pinParticipant(id) {
    return {
    type: PIN_PARTICIPANT,
    participant: {
                id
    }
    };
}

