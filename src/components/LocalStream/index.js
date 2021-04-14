import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Video from "../../components/Video";
import { addParticipant, addParticipantsIdList, getParticipantById } from '../../store/actions/participantActions';
import store from '../../store/store';
import {Strophe} from 'strophe.js';
import SariskaMediaTransport from 'sariska-media-transport/build/SariskaMediaTransport';
import { AMPLITUDE_HANDLER_API_KEY, GOOGLE_ANALYTICS_TRACKING_ID} from '../../config';
//import { createHandlers, initAnalytics } from '../../features/analytics/functions';
import whiteListedEvents from '../../config/whiteListedEvents';
import { bootstrapCalendarIntegration } from '../../features/calender-sync/action';
import googleApi from '../../features/google-api/googleApi.web';
import { loadGoogleAPI, showAccountSelection } from '../../features/google-api/actions';
import { isRtcstatsEnabled } from '../../features/RTC/function';
import RTCStats from '../../features/RTC/RTCStats';
//import { setVirtualBackground, toggleBackgroundEffect } from '../../features/virtual-background/actions';

// const analyticsStore = {
//     config: {
//          analyticsConfig : {
//                 amplitudeAPPKey: AMPLITUDE_HANDLER_API_KEY,
//                 scriptURLs: [require('../../features/analytics/analytics-ga.js'), "http://localhost:8080"],
//                 googleAnalyticsTrackingId: GOOGLE_ANALYTICS_TRACKING_ID,
//                 whiteListedEvents: whiteListedEvents
//             }
        
//     },
//     token: window.localStorage.getItem('token'),
// }


console.log('key', AMPLITUDE_HANDLER_API_KEY);
const LocalStream = props=> {
    const {localTracks, room} = props;
    const [ids, setIds]=useState([]);
    const [lock, setLock] = useState(false);
    const participantList=useSelector(state=>state.participants.participantList)
    const idList = useSelector(state=>state.participants.idList)
    const participant = useSelector(state=>state.participants.participant);
    const dispatch = useDispatch();
    const displayName = '';
    const [handlers, setHandlers] = useState([]);
    
    useEffect(()=>{
        if(room) {
            dispatch(addParticipant([ room.user, room.getParticipants()].flat()));
            room.setStartMutedPolicy({audio: false, video: false})
            console.log('pol', room.getStartMutedPolicy(), room.isStartVideoMuted());
            console.log('local prty', room.user.name);
            if( room.getParticipants().length===1) {
                if(!room.isP2P){
                room.startP2PSession();
                room.on(SariskaMediaTransport.events.conference.P2P_STATUS, (room, p2p)=> {
                    console.log('p2p status changed in room', p2p, room);
                })
        console.log('p2ptojvb', room.getActivePeerConnection() && room.getActivePeerConnection().isP2P, room.getP2PConnectionState())}
            }
            else {
                room.stopP2PSession()
            }
    //Analytics
        // createHandlers(analyticsStore).then(handlerList => {
        //     if(handlerList) {
        //     setHandlers( handlers => [...handlers, handlerList]); 
        //         console.log('listh', handlerList);
        // initAnalytics(analyticsStore, handlerList);
        //     }
        // }).catch(err=> console.log('error in handler', err)); 

    //RTCSTATS

    if (isRtcstatsEnabled() && RTCStats.isInitialized()) {
        // Once the conference started connect to the rtcstats server and send data.
        try {
            //RTCStats.connect();
            // const localParticipant = getLocalParticipant(state);

            // // Unique identifier for a conference session, not to be confused with meeting name
            // // i.e. If all participants leave a meeting it will have a different value on the next join.
            // const { conference } = action;
            // const meetingUniqueId = conference && conference.getMeetingUniqueId();

            // // The current implementation of rtcstats-server is configured to send data to amplitude, thus
            // // we add identity specific information so we can correlate on the amplitude side. If amplitude is
            // // not configured an empty object will be sent.
            // // The current configuration of the conference is also sent as metadata to rtcstats server.
            // // This is done in order to facilitate queries based on different conference configurations.
            // // e.g. Find all RTCPeerConnections that connect to a specific shard or were created in a
            // // conference with a specific version.
            // RTCStats.sendIdentityData({
            //     ...getAmplitudeIdentity(),
            //     ...config,
            //     displayName: localParticipant?.name,
            //     meetingUniqueId
            // });
        } catch (error) {
            // If the connection failed do not impact jitsi-meet just silently fail.
            console.error('RTCStats connect failed with: ', error);
        }
    }


        }
        if(room)
        {
        //console.log('sendan', room._sendConferenceJoinAnalyticsEvent(), SariskaMediaTransport.analytics);
        }
        //calendar-integration
        bootstrapCalendarIntegration();
    // Audio Mixer
        const audioMixer = SariskaMediaTransport.createAudioMixer();
        if(room && localTracks) {
            localTracks.map(track => {
                const localStream = track.getOriginalStream();
                audioMixer.addMediaStream(localStream);
                audioMixer.start();
            })
        console.log('audio mixerss', audioMixer);
        }
    },[room ]);


    // useEffect(async ()=>{
    //     // const enableBlur = async () => {
    //     //     await setVirtualBackground('', false);
    //     //     await toggleBackgroundEffect(true, localTracks);
    //     // };
    //     // await enableBlur();
    // })

    useEffect(()=>{
        if(room) {
            //changing display name of local participants
            room.setDisplayName('local guru');
            //changing display name of participants
            room.onDisplayNameChanged("test6we9999j9e8@muc.sariska.io/1617029639411" , 'Trndulkar') 
            room.onDisplayNameChanged("test6we9999j9e8@muc.sariska.io/1617029698627" , 'Sachin');

            room.on(SariskaMediaTransport.events.conference.DISPLAY_NAME_CHANGED, (id, name)=>{
                console.log('display changed', id, name);
            })
            console.log('room8', room, room.getParticipants());
            }


    },[room])
    
    useEffect(()=>{
        participantList.map((p,i)=>{
            dispatch(addParticipantsIdList(p._id || p.id))
        });
        }, [participantList])

    useEffect(()=>{
    if(room && idList) {
        dispatch(getParticipantById(idList[1]));
        idList.map(id => {
            let p = getSingleParticipantById(participantList, id);
            console.log('p dis', p);
           console.log('id with', p._role, room.getRole(), id , room.isModerator(), participantList.find(p=>(p.id || p._id)===id));
       })
    };
    },[idList])
    
    //console.log('devs', SariskaMediaTransport.getActiveAudioDevice());

    //console.log('participantList', participantList);
    if(room){
        room.setDisplayName(displayName);
        //console.log('p2pjvb', room.getActivePeerConnection());
    }
    
    const lockRoom = () => {
        if(room && room.getRole()==='moderator') {
            room.lock('password').then (lock => console.log('room locked', lock));
            setLock(true)
        }
        console.log('room will lock');
    }
    const unlockRoom = () => {
        if(room && room.getRole()==='moderator' && lock) {
            room.unlock().then(unlock=>console.log('room unlocked', unlock))
            setLock(false);
        }
        console.log('room will unlock');
    }
    const speakerStats = () => {
        return room && room.getSpeakerStats();
    }

    const getSingleParticipantById = (participantList, id)=>{
        return participantList && participantList.find(p=>(p.id || p._id)===id)
    }

    const getLocalParticipant = () => {
        return room.user;
    }

    const toPinParticipant = (id) => {
        if(room) {
        console.log('partlog', participantList, room);
        
        room.pinParticipant(id);
        console.log('pinned', id);
        }
    }

    const toKickParticipant = (id) => {
        if(room) {
        function userKicked(id) { 
            console.log('kicked', id); // kicked out user id 
         }
        room.on(SariskaMediaTransport.events.conference.KICKED, userKicked);
        room.kickParticipant(id);
        }
    }


    const toGrantOwner = (id) => {
        if(room) {
        room.grantOwner(id);
        console.log('new owner ', id);
        console.log('room', room);
        }
    }

    const toSetDisplayName = (name) => {
        if(room){
            room.setDisplayName(name);
            function displayNameChanged(id, displayName) { 
                console.log('id',id); //user id 
                console.log('displayName',displayName) //new display name
            }
            room.on(SariskaMediaTransport.events.conference.DISPLAY_NAME_CHANGED, displayNameChanged);
            console.log('names', name);
            console.log('local name', room.getParticipants());
        }
    }

     
     // set new display name
    // notifies to everyone in the room that display name has changed
    
    const toStartP2PSession = () => {
        room.startP2PSession();
        console.log('p2p session started', room.isP2PEnabled());
    }

    const toMuteParticipant=(id)=>{
        if(room){
            room.muteParticipant(id);
            console.log('participant muted', id, room.getParticipants()[0]);

            //room.muteParticipant(JitsiParticipant.room.myUserId, false);
        }
    }

    const toMuteLocalParticipant = () => {
        if(localTracks){
            localTracks.map(track => {
                if(track && track.isVideoTrack()){
                    track.mute()
                }
            })
        }
    }
    const toUnmuteLocalParticipant = () => {
        if(localTracks){
            localTracks.map(track => {
                if(track && track.isVideoTrack()){
                    track.unmute()
                }
            })
        }
    }
    

    return (
        <div className="localStream">
           {
           room && room.isModerator() && <button onClick={!lock ? lockRoom : unlockRoom}>{!lock ? 'Lock Room': 'Unlock Room'}</button>
            }
            {
           room && room.isModerator() && <button onClick={()=>toPinParticipant(1616534761226)}>Pin Participant</button>
            }
            {
           room && room.isModerator() && <button onClick={()=>toGrantOwner(1617029639411)}>Grant Owner</button>
            }
            {
           room && room.isModerator() && <button onClick={()=>toKickParticipant(1616509371317)}>Kick Participant</button>
            }
            {
           room && room.isModerator() && <button onClick={()=>toSetDisplayName('gurudeep shr')}>set Display Name</button>
            }
            {
           room && room.isModerator() && <button onClick={()=>toStartP2PSession()}>Start P2P Session</button>
            }
            { <button onClick={()=>toMuteParticipant(1617890644957)}>Mute Participant</button> }

            { <button onClick={()=>toMuteLocalParticipant()}>Mute Local Participant</button> }
            
            { <button onClick={()=>toUnmuteLocalParticipant()}>Unmute Local Participant</button> }

            {/* { <button onClick={()=>enableBlur()}>Enable Blur</button> } */}

            <div>role {room && room.getRole()} NAME {displayName}</div>
            {localTracks.map((track, idx) => {
                return track.isVideoTrack() && (
                    <div key={track.track.id}>
                        <div>local</div>
                    <Video key={track.track.id} track={track} />
                    </div>
                )
            })}
        </div>
    );
}

export default LocalStream;
