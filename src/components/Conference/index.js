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
            return localTracks.forEach(track => room.addTrack(track).catch(err => console.log("track is already added")));
        }
        SariskaMediaTransport.createLocalTracks({devices: ["audio", "video"], resolution: "180"}).then(tracks => {
            setLocalTracks(tracks);
            if (room && room.isJoined()) {
                tracks.forEach(track => room.addTrack(track).catch(err => console.log("track is already added")));
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

        room.on(SariskaMediaTransport.events.conference.CONFERENCE_JOINED, onConferenceJoined);
        room.on(SariskaMediaTransport.events.conference.TRACK_ADDED, onRemoteTrack);
        room.on(SariskaMediaTransport.events.conference.TRACK_REMOVED, onTrackRemoved);
        room.join();

        return ()=> {
            leave();
        }
    }, [connection]);

    return (
        <div><LocalStream localTracks={localTracks}/><RemoteStream remoteTracks={remoteTracks}/></div>
    );
}

export default Conference;
