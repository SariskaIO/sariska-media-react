import React, {useEffect, useState} from 'react';
import SariskaMediaTransport from "sariska-media-transport";
import RemoteStream from "../../components/RemoteStream";
import LocalStream from "../../components/LocalStream";


const Conference = props => {
    const {connection} = props;
    const [localTracks, setLocalTracks] = useState([]);
    const [remoteTracks, setRemoteTracks] = useState([]);


    const imageBackground = async()=>{
        const videoTrack = localTracks.find(track=>track.getType()==="video");
        const options  = {
            backgroundEffectEnabled: true,
            backgroundType: "image",
            virtualSource: "https://image.shutterstock.com/z/stock-photo-jasna-lake-with-beautiful-reflections-of-the-mountains-triglav-national-park-slovenia-1707906793.jpg"
        };
        const effect = await SariskaMediaTransport.effects.createVirtualBackgroundEffect(options);
        await videoTrack.setEffect(effect);
    }

    const blurBackground = async ()=>{
        const videoTrack = localTracks.find(track=>track.getType()==="video");
        const options  = {
            backgroundEffectEnabled: true, 
            backgroundType: "blur" ,
            blurValue: 25
        }
        
        const effect = await SariskaMediaTransport.effects.createVirtualBackgroundEffect(options);
        await videoTrack.setEffect(effect);
    }

    const screenSharingBackground = async ()=>{
        const videoTrack = localTracks.find(track=>track.getType()==="video");
        const [ desktopTrack ] = await SariskaMediaTransport.createLocalTracks({devices: ["desktop"]});

        const options = {
            backgroundEffectEnabled: true,
            backgroundType: "desktop-share",
            virtualSource: desktopTrack
        }

        const effect = await SariskaMediaTransport.effects.createVirtualBackgroundEffect(options);
        await videoTrack.setEffect(effect);
    }

    const removeBackground = async ()=>{
        const videoTrack = localTracks.find(track=>track.getType()==="video");
        await videoTrack.setEffect(undefined);
    }

    useEffect(() => {
        const {connection} = props;
        if (!connection) {
            return;
        }
        const conference = connection.initJitsiConference();

        const captureLocalStream = async () => {
            const tracks = await SariskaMediaTransport.createLocalTracks({devices: ["audio", "video"]});
            tracks.forEach(async track => await conference.addTrack(track));
            setLocalTracks(tracks);
            conference.join();
        }

        captureLocalStream();

        const onConferenceJoined = async () => {
            console.log("confernce joined")
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

        conference.addEventListener(SariskaMediaTransport.events.conference.CONFERENCE_JOINED, onConferenceJoined);
        conference.addEventListener(SariskaMediaTransport.events.conference.TRACK_ADDED, onRemoteTrack);
        conference.addEventListener(SariskaMediaTransport.events.conference.TRACK_REMOVED, onTrackRemoved);

        return () => {
            conference.leave();
        }
    }, [connection]);

    return (
        <div>
            <button onClick={blurBackground}>blur background </button>
            <button onClick={imageBackground}>image background</button>
            <button onClick={screenSharingBackground}>screen sharing background</button>
            <button onClick={removeBackground}>remove background</button>
            <LocalStream tracks={localTracks}/>
            <RemoteStream tracks={remoteTracks}/>
        </div>
    );
}

export default Conference;
