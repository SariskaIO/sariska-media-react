import React, { useEffect, useState} from 'react';
import SariskaMediaTransport from "sariska-media-transport";
import RemoteStream from "../../components/RemoteStream";
import LocalStream from "../../components/LocalStream";


const Conference = props=> {
    const {connection} = props;
    const [room, setRoom] = useState(null);
    const [localTracks, setLocalTracks] = useState([]);
    const [remoteTracks, setRemoteTracks] = useState([]);

    useEffect(() => {
        const {connection} = props;
        if (!connection) {
            return;
        }

        window.addEventListener('beforeunload', leave);
        const room = connection.initJitsiConference();

        function leave(event) {
            if (room && room.isJoined()) {
              room.leave().then(() => connection.disconnect(event));
            }
        }

        const onConferenceJoined = async ()=> {
            setRoom(room);
            const localTracks = await SariskaMediaTransport.createLocalTracks({devices: ["video", "audio"], resolution: "180"});
            localTracks.forEach(track=>room.addTrack(track).then(()=>console.log("track added success")).catch(()=>console.log("failed to add track ")));
            setLocalTracks(localTracks);
        }

        const onTrackRemoved = (track)=> {
            console.log("track removed", track);
            setRemoteTracks(tracks=>tracks.filter(item=>item.track.id !== track.track.id));
        }

        const onRemoteTrack = (track)=> {
            console.log("remote track added", track);
            if (!track  || track.isLocal()) {
                return;
            }
            setRemoteTracks(tracks=>[...tracks, track]);
        }

        const onUserLeft = ()=>{
            console.log("user lef.r...");
        }

        const startedMuted = (a, b, c)=>{
            console.log("startedMuted", a, b, c);
        }

        const mutedPolicyChanged = (a, b, c)=>{
            console.log("mutedPolicyChanged", a, b, c);
        }


        room.on(SariskaMediaTransport.events.conference.CONFERENCE_JOINED, onConferenceJoined);
        room.on(SariskaMediaTransport.events.conference.USER_LEFT, onUserLeft);
        room.on(SariskaMediaTransport.events.conference.TRACK_ADDED, onRemoteTrack);
        room.on(SariskaMediaTransport.events.conference.TRACK_REMOVED, onTrackRemoved);
        room.on(SariskaMediaTransport.events.conference.STARTED_MUTED, startedMuted);
        room.on(SariskaMediaTransport.events.conference.START_MUTED_POLICY_CHANGED, mutedPolicyChanged);
        room.join();

        return ()=> {
            leave();
        }
    }, [connection]);

    return (
        <div>
            <button>start transcription</button>
            <button>start local recording</button>
            <button>start cloud recording</button>
            <button>start transcription</button>
            <LocalStream localTracks={localTracks}/>
            <RemoteStream remoteTracks={remoteTracks}/>
        </div>
    );
}

export default Conference;
