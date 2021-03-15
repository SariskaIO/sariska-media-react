import React, { useEffect, useState }  from 'react';
import Video from "../../components/Video";
import Audio from "../../components/Audio";

const RemoteStream = props=> {
    const {remoteTracks, room} = props;
    const [idr, setIdr]=useState([]);
    useEffect(()=>{
        if(room) {
            const participants=room.getParticipants();
            console.log('participantr', participants);
            participants.forEach((participant)=> {
                console.log('participantr ind', participant);
                setIdr(idr=> [...idr, participant._id]);
                //room.kickParticipant(part[1])
            })
        }

    },[room])
    console.log('rem', remoteTracks);
    return (
        <div className="remoteStream">
            {remoteTracks.map((track, idx) => {
            return track.isVideoTrack() ? <Video key={track.track.id} track={track}/> : 
                 <Audio key={track.track.id} track={track}/>
              
            })}
        </div>
    );
}

export default RemoteStream;
