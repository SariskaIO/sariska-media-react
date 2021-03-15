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
    
    useEffect(() => {
        if (room && room.isJoined() && localTracks.length) {

            return localTracks.forEach(track =>{room.addTrack(track).catch(err => console.log("track is already added"))});
        }
        SariskaMediaTransport.createLocalTracks({devices: ["audio", "video"], resolution: "180"}).then(tracks => {
            setLocalTracks(tracks); 
            if (room && room.isJoined()) {

    console.log('room w', room);
                tracks.forEach(track => { room.addTrack(track).catch(err => console.log("track is already added"))
                });
                
            }
        }).catch((e) => console.log(e, "failed to fetch tracks"));

    }, [room]);

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

        const onConferenceJoined = ()=> {
            setRoom(room);
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

        function onUserJoined(id, participant) {
            const userdetails={id: id, participant: participant};
            console.log("user joined!!!", userdetails);
        }
        function onUserLeft(id, participant) {
            console.log("user left!!!", id, participant);
        }

        function dominantSpeakerChanged(id) {
           console.log('dominant speaker', id) //dominant speaker Id
        }

        function lastNspeakersChanged(leavingEndpointIds, enteringEndpointIds) {
            console.log('leavingEndpointIds', leavingEndpointIds) //Array of ID's of users leaving lastN
            console.log('enteringEndpointIds', enteringEndpointIds) //Array of ID's of users entering lastN
         }

        room.on(SariskaMediaTransport.events.conference.CONFERENCE_JOINED, onConferenceJoined);
        room.on(SariskaMediaTransport.events.conference.TRACK_ADDED, onRemoteTrack);
        room.on(SariskaMediaTransport.events.conference.TRACK_REMOVED, onTrackRemoved);
        room.on(SariskaMediaTransport.events.conference.USER_JOINED, onUserJoined);
        room.on(SariskaMediaTransport.events.conference.USER_LEFT, onUserLeft);
        room.on(SariskaMediaTransport.events.conference.DOMINANT_SPEAKER_CHANGED, dominantSpeakerChanged);
        room.on(SariskaMediaTransport.events.conference.LAST_N_ENDPOINTS_CHANGED, lastNspeakersChanged);
        
        room.join();

        return ()=> {
            leave();
        }
    }, [connection]);

    return (
        <div>
            <LocalStream room ={room} localTracks={localTracks} />
            <RemoteStream remoteTracks={remoteTracks} room ={room}/>
        </div>
    );
}

export default Conference;
