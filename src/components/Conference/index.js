import React, { useEffect, useState} from 'react';
import SariskaMediaTransport from "sariska-media-transport";
import RemoteStream from "../../components/RemoteStream";
import LocalStream from "../../components/LocalStream";
import {conferenceConfig} from "../../constants";


const Conference = props=> {
    const {connection} = props;
    const [room, setRoom] = useState(null);
    const [localTracks, setLocalTracks] = useState([]);
    const [remoteTracks, setRemoteTracks] = useState([]);
    const [status, setStatus] = useState("calling");

    useEffect(() => {
        const {connection} = props;
        if (!connection) {
            return;
        }

        window.addEventListener('beforeunload', leave);
        const room = connection.initJitsiConference(conferenceConfig);
     
        function leave(event) {
            if (room && room.isJoined()) {
                room.leave().then(() => connection.disconnect(event));
            }
        }

        const onConferenceJoined = async ()=> {
            setRoom(room);
            const localTracks = await SariskaMediaTransport.createLocalTracks({devices: ["video", "audio"], resolution: "180"});
            localTracks.forEach(track=>room.addTrack(track));
            setLocalTracks(localTracks);
        }

        const onTrackRemoved = (track)=> {
            setRemoteTracks(tracks=>tracks.filter(item=>item.track.id !== track.track.id));
        }

        const onRemoteTrack = (track)=> {
            if (!track  || track.isLocal()) {
                return;
            }
            setRemoteTracks(tracks=>[...tracks, track]);
        }

        room.on(SariskaMediaTransport.events.conference.CONFERENCE_JOINED, onConferenceJoined);
        room.on(SariskaMediaTransport.events.conference.TRACK_ADDED, onRemoteTrack);
        room.on(SariskaMediaTransport.events.conference.TRACK_REMOVED, onTrackRemoved);
        room.on(SariskaMediaTransport.events.conference.USER_JOINED, (id, track)=>console.log('USER_JOINED',id, track));
        room.on(SariskaMediaTransport.events.conference.ENDPOINT_MESSAGE_RECEIVED, (message, a, b, c)=>{ });


        room.join();

        return ()=> {
            leave();
        }
    }, [connection]);

    return (
        <div>
           <button onClick={()=>{room.startTranscriber();}}>start transcription</button>
            {status}
            <LocalStream localTracks={localTracks}/><RemoteStream remoteTracks={remoteTracks}/>
        </div>
    );
}

export default Conference;
