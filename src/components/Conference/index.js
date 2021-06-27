import React, {useEffect, useState} from 'react';
import SariskaMediaTransport from "sariska-media-transport";
import RemoteStream from "../../components/RemoteStream";
import LocalStream from "../../components/LocalStream";


const Conference = props => {
    const {connection} = props;
    const [localTracks, setLocalTracks] = useState([]);
    const [remoteTracks, setRemoteTracks] = useState([]);
    const [desktopTrack, setDesktopTrack] = useState(null);
    const [conference, setConference] = useState(null);


    const startScreenSharingWithPresenterMode = async()=> {
        if (desktopTrack) {
             console.log("screen is already shared");
             return;
        }
        const videoTrack = localTracks.find(track=>track.getType()==="video");
        const [ track ] = await SariskaMediaTransport.createLocalTracks({devices: ["desktop"]});
        const effect = await SariskaMediaTransport.effects.createPresenterEffect(videoTrack.stream);
        await track.setEffect(effect);
        await conference.replaceTrack(videoTrack, track);
        setDesktopTrack(track);

        track.addEventListener(SariskaMediaTransport.events.track.LOCAL_TRACK_STOPPED, async ()=>{ // stopped from Window UI dialog box
            await stopScreenSharing();
        });
    }


    const startScreenSharing = async()=> {
        if (desktopTrack) {
             console.log("screen is already shared");
             return;
        }
        const videoTrack = localTracks.find(track=>track.getType()==="video");
        const [ track ] = await SariskaMediaTransport.createLocalTracks({devices: ["desktop"]});
        await conference.replaceTrack(videoTrack, track);
        setDesktopTrack(track);
        track.addEventListener(SariskaMediaTransport.events.track.LOCAL_TRACK_STOPPED, async ()=>{ // stopped from Window UI dialog box
            await stopScreenSharing();
        });
    }


    const stopScreenSharing = async()=> {
        const videoTrack = localTracks.find(track=>track.getType()==="video");
        await conference.replaceTrack(desktopTrack, videoTrack);
        if ( desktopTrack ) {
            await desktopTrack.setEffect(undefined);
            await desktopTrack.dispose();
        }        
        setDesktopTrack(null);
    }

    useEffect(() => {
        const {connection} = props;
        if (!connection) {
            return;
        }
        const conference = connection.initJitsiConference({startVideoMuted: true});
        
        setConference(conference);

        const captureLocalStream = async () => {
            const tracks = await SariskaMediaTransport.createLocalTracks({devices: ["audio", "video"], resolution: 240});
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
            <button onClick={startScreenSharingWithPresenterMode}>start screen sharing presenter mode</button>
            <button onClick={startScreenSharing}>start screen sharing</button>
            <button onClick={stopScreenSharing}>stop screen sharing</button>
            <LocalStream tracks={localTracks}/>
            <RemoteStream tracks={remoteTracks}/>
        </div>
    );
}

export default Conference;
