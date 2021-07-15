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
    const [recorderSessionId, setRecorderSessionId] = useState(null);
    const [sipSession, setSipSession] = useState(null);

    const startLiveStreaming = () => {

        conference.startRecording({
            broadcastId: "broadcastId",
            mode: SariskaMediaTransport.constants.recording.mode.STREAM,
            streamId: "key"
        });

    }

    const stopLiveStreaming = () => {
        conference.stopRecording(recorderSession);
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

        conference.stopRecording(recorderSessionId);

    }

    const startTranscription = () => {

        conference.startTranscriber();

    }

    const stopTranscription = () => {

        conference.stopTranscriber();

    }


    const startSip = () => {

        conference.startSIPVideoCall('address@sip.domain.com', "someroom");

    }


    const stopSip = () => {

        conference.stopSIPVideoCall('address@sip.domain.com');

    }


    const startSubtitles = () => {


        conference.setLocalParticipantProperty("translation_language", 'hi'); // hi for hindi

    }


    const stopSubtitles = () => {

        conference.setLocalParticipantProperty("requestingTranscription",   false);

    }


    const startDialIn = () => {

        conference.dial("8130017202");

    }


    const stopDialIn = () => {

        conference.hangup();

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

        const recorderStateChanged = (payload)=>{
            console.log("status", payload);
            if (payload._status === "pending") {
                setRecorderSessionId(payload._sessionID);
            }
        }

        const sipGatewayStateChanged = (payload)=>{
            console.log("payload", payload);
        }

        const transcriberStateChanged = (payload)=>{
            console.log("payload", payload);
        }

        conference.addEventListener(SariskaMediaTransport.events.conference.CONFERENCE_JOINED, onConferenceJoined);
        conference.addEventListener(SariskaMediaTransport.events.conference.TRACK_ADDED, onRemoteTrack);
        conference.addEventListener(SariskaMediaTransport.events.conference.TRACK_REMOVED, onTrackRemoved);
        conference.addEventListener(SariskaMediaTransport.events.conference.RECORDER_STATE_CHANGED, recorderStateChanged);
        conference.addEventListener(SariskaMediaTransport.events.conference.VIDEO_SIP_GW_SESSION_STATE_CHANGED, sipGatewayStateChanged);
        conference.addEventListener(SariskaMediaTransport.events.conference.TRANSCRIPTION_STATUS_CHANGED, transcriberStateChanged);

        return () => {
            conference.leave();
        }
    }, [connection]);

    return (
        <div>
            <button onClick={startCloudRecording}>start cloud recording</button>
            <button onClick={stopCloudRecording}>stop cloud recording</button>

            <button onClick={startLiveStreaming}>start live streaming</button>
            <button onClick={stopLiveStreaming}>top cloud recording</button>
            
            <button onClick={startTranscription}>start transcription </button>
            <button onClick={stopTranscription}>stop transcription</button>
            
            <button onClick={startDialIn}>start dial in </button>
            <button onClick={stopDialIn}>stop dial in</button>            

            <button onClick={startSubtitles}>start subtitles</button>
            <button onClick={stopSubtitles}>stop subtitles</button>            

            <button onClick={startSip}>start sip</button>
            <button onClick={stopSip}>stop sip</button>

            <LocalStream tracks={localTracks}/>
            <RemoteStream tracks={remoteTracks}/>
        </div>
    );
}

export default Conference;
