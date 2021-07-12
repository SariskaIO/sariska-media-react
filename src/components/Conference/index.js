import React, {useEffect, useState} from 'react';
import SariskaMediaTransport from "sariska-media-transport";
import RemoteStream from "../../components/RemoteStream";
import LocalStream from "../../components/LocalStream";

const Conference = props => {

    const {connection} = props;
    const [localTracks, setLocalTracks] = useState([]);
    const [remoteTracks, setRemoteTracks] = useState([]);
    const [conference, setConference] = useState(null);
    const [effect, setEffect] = useState(null);

    const cancelNoise = async ()=>{
       await SariskaMediaTransport.effects.createRnnoiseProcessor();
    }

    const stopCancelNoise = ()=>{

    }

    const startLiveStreaming = () => {
        conference.startLocalRecording("flac");  // can flac, wav or ogg
    }

    const stopLiveStreaming = () => {
        conference.stopLocalRecording();
    }

    const startCloudRecording = () => {
        const appData = {
            file_recording_metadata : {
                share: true
            }
        }

        conference.startRecording({
            mode: SariskaMediaTransport.constants.recording.mode.FILE,
            appData: JSON.stringify(appData)
        });
    }

    const stopCloudRecording = () => {
        conference.stopLocalRecording();
    }

    const startLocalRecording = () => {
        conference.startLocalRecording("flac");  // can flac, wav or ogg
    }

    const stopLocalRecording = () => {
        conference.stopLocalRecording();
    }

    const processScreenShot = (canvas) => {
        var dataURL = canvas.toDataURL();
        console.log("data", dataURL);
    }

    const captureScreenShotEffect = async () => {
        const [ desktopTrack ] = await SariskaMediaTransport.createLocalTracks({devices: ["desktop"]});
        const effect = await SariskaMediaTransport.effects.createScreenshotCaptureEffect(processScreenShot);
        await effect.startEffect(
            desktopTrack.getOriginalStream(),
            desktopTrack.videoType
        );
    }

    const stopCaptureScreenShotEffect = async () => {
        setEffect(effect);
    }

    const unmuteVideoTrack = async () => {
        localTracks[1].unmute();
    }

    const muteVideoTrack = async () => {
        localTracks[1].mute();
    }

    const unmuteAudioTrack = async () => {
        localTracks[0].unmute();
    }

    const muteAudioTrack = async () => {
        localTracks[0].mute();
    }



    useEffect(() => {
        const {connection} = props;
        if (!connection) {
            return;
        }
        const conference = connection.initJitsiConference();

        setConference(conference);

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
            setRemoteTracks(tracks => [...tracks, track]);
        }

        const recorderStateChanged = (status)=>{
            console.log("status", status);
        }

        const startedMuted = (status)=>{
            console.log("startedMuted", status);
        }

        const startedMutedChanged = (status)=>{
            console.log("startedMutedChanged", status);
        }

        conference.addEventListener(SariskaMediaTransport.events.conference.START_MUTED_POLICY_CHANGED, startedMuted);
        conference.addEventListener(SariskaMediaTransport.events.conference.STARTED_MUTED, startedMutedChanged);
        conference.addEventListener(SariskaMediaTransport.events.conference.CONFERENCE_JOINED, onConferenceJoined);
        conference.addEventListener(SariskaMediaTransport.events.conference.TRACK_ADDED, onRemoteTrack);
        conference.addEventListener(SariskaMediaTransport.events.conference.TRACK_REMOVED, onTrackRemoved);
        conference.addEventListener(SariskaMediaTransport.events.conference.RECORDER_STATE_CHANGED, recorderStateChanged);
        return () => {
            conference.leave();
        }
    }, [connection]);

    return (
        <div>
            <button onClick={startCloudRecording}>start cloud recording</button>
            <button onClick={stopCloudRecording}>stop cloud recording</button>
            <button onClick={startLocalRecording}>start local recording</button>
            <button onClick={stopLocalRecording}>stop local recording</button>
            <button onClick={captureScreenShotEffect}>capture screenshot</button>
            <button onClick={stopCaptureScreenShotEffect}>stop capture screenshot</button>
            <button onClick={cancelNoise} >cancel noise</button>
            <button onClick={stopCancelNoise} >stop noise cancellation</button>
            <button onClick={unmuteVideoTrack} >unmute video track</button>
            <button onClick={muteVideoTrack} >mute video track</button>
            <button onClick={unmuteAudioTrack} >unmute audio track</button>
            <button onClick={muteAudioTrack} >mute audio track</button>

            <LocalStream tracks={localTracks}/>
            <RemoteStream tracks={remoteTracks}/>
        </div>
    );
}

export default Conference;
