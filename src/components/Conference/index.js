import React, {useEffect, useState} from 'react';
import SariskaMediaTransport from "sariska-media-transport";
import RemoteStream from "../../components/RemoteStream";
import LocalStream from "../../components/LocalStream";


const Conference = props => {
    const {connection} = props;
    const [localTracks, setLocalTracks] = useState([]);
    const [remoteTracks, setRemoteTracks] = useState([]);

    useEffect(() => {
        const {connection} = props;
        if (!connection) {
            return;
        }
        const room = connection.initJitsiConference({ enableVirtualBackground: true });

        const captureLocalStream = async () => {
            const tracks = await SariskaMediaTransport.createLocalTracks({devices: ["audio", "video"]});
            tracks.forEach(async track => await room.addTrack(track));
            setLocalTracks(tracks);
            room.join();
        }

        captureLocalStream();

        const onConferenceJoined = async () => {
            console.log("confernce joined")
            window.room = room;
        }

        const onTrackRemoved = (track) => {
            setRemoteTracks(tracks => tracks.filter(item => item.track.id !== track.track.id));
        }

        const onRemoteTrack = (track) => {
            if (!track || track.isLocal()) {
                return;
            }
            console.log("track", track);
            setRemoteTracks(tracks => [...tracks, track]);
        }

        room.addEventListener(SariskaMediaTransport.events.conference.CONFERENCE_JOINED, onConferenceJoined);
        room.addEventListener(SariskaMediaTransport.events.conference.TRACK_ADDED, onRemoteTrack);
        room.addEventListener(SariskaMediaTransport.events.conference.TRACK_REMOVED, onTrackRemoved);

        return () => {
            room.leave();
        }
    }, [connection]);

    return (
        <div>
            <button>blur background </button>
            <button>image background</button>
            <button>screen sharing background</button>
            <LocalStream tracks={localTracks}/>
            <RemoteStream tracks={remoteTracks}/>
        </div>
    );
}

export default Conference;
