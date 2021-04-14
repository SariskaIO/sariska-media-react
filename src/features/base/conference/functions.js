function getDisplayName(id) {
    const participant = getParticipantById(APP.store.getState(), id);

    return participant && participant.name;
}

function muteLocalAudio(muted) {
    APP.store.dispatch(setAudioMuted(muted));
}

function muteLocalVideo(muted) {
    APP.store.dispatch(setVideoMuted(muted));
}

function isLocalId(room, id) {
    return room.getMyUserId() === id;
}

function listMembersIds() {
    return room.getParticipants().map(p => p.getId());
}
function isParticipantModerator(id) {
    const user = room.getParticipantById(id);

    return user && user.isModerator();
}

function listMembers() {
    return room.getParticipants();
}

function getSpeakerStats() {
    return room.getSpeakerStats();
}

function isJoined() {
    return room && room.isJoined();
}

function getConnectionState() {
    return room && room.getConnectionState();
}

function  getP2PConnectionState() {
    return room && room.getP2PConnectionState();
}

function getLocalDisplayName() {
    return getDisplayName(this.getMyUserId());
}

function  getParticipantById(id) {
    return room ? room.getParticipantById(id) : null;
}

function getParticipantDisplayName(id) {
    const displayName = getDisplayName(id);

    if (displayName) {
        return displayName;
    }
}

function getMyUserId() {
    return room && room.myUserId();
}

