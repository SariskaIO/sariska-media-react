import React, {Fragment, useEffect, useState} from 'react';
import JitsiMeetJS from "sariska-media-transport";
import RemoteStream from "../../components/RemoteStream";
import LocalStream from "../../components/LocalStream";
import {conferenceConfig} from "../../constants";


const Conference = props=> {
    const {connection} = props;
    const [room, setRoom] = useState(null);
    const [localTracks, setLocalTracks] = useState([]);
    const [remoteTracks, setRemoteTracks] = useState([]);

    useEffect(()=> {
        JitsiMeetJS.createLocalTracks({devices:["audio", "video"], resolution: "180"}).
        then(tracks => {
            setLocalTracks(tracks);
            room && tracks.forEach(track=>room.addTrack(track).catch(err =>console.log("track already added")));
        }).
        catch(()=>console.log("failed to fetch tracks"));
    } ,[room]);

    useEffect(() => {
        const {connection} = props;
        if (!connection) {
            return;
        }

        window.addEventListener('beforeunload', beforeUnload);
        const room = connection.initJitsiConference(conferenceConfig);

        function beforeUnload(event) {
            if (room && room.isJoined()) {
                room.leave().then(() => connection.disconnect(event));
            }
        }

        const onConferenceJoined = ()=> {
            setRoom(room);
        }

        const onTrackRemoved = (track)=> {
            setRemoteTracks(remoteTracks.filter(item => item.track.id !== track.track.id));
        }
   
        const onRemoteTrack = (track)=> {
            if (!track  || track.isLocal()) {
                return;
            }
            setRemoteTracks(remoteTracks => [...remoteTracks, track]);
        }

        room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
        room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
        room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, onTrackRemoved);
        room.join();

        return ()=> {
            beforeUnload();
        }
    }, [connection]);

    return (
        <div><LocalStream localTracks={localTracks}/><RemoteStream remoteTracks={remoteTracks}/></div>
    );
}

export default Conference;
