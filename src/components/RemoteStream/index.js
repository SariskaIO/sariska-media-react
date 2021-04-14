import React, { useContext, useEffect, useState }  from 'react';
import Video from "../../components/Video";
import Audio from "../../components/Audio";
import { ParticipantContext } from '../../store/participantContext';
import { useDispatch, useSelector } from 'react-redux';
import { addParticipantsIdsList, getParticipants } from '../../store/actions/participantActions';

const RemoteStream = props=> {
    const {remoteTracks, room} = props;
    const participantList= useSelector(state=>state.participants.participantList);
    const dispatch = useDispatch();

    
    return (
        <div className="remoteStream">
            <div>remote role {room && room.getRole()}</div>
            {remoteTracks.map((track, idx) => {
            return track.isVideoTrack() ? <Video key={track.track.id} track={track}/> : 
                 <Audio key={track.track.id} track={track}/>
              
            })}
        </div>
    );
}

export default RemoteStream;
