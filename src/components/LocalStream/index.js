import React, { useEffect, useState } from 'react';
import SariskaMediaTransport from 'sariska-media-transport/build/SariskaMediaTransport';
import Video from "../../components/Video";

const LocalStream = props=> {
    const {localTracks, room} = props;
    const [ids, setIds]=useState([]);
    const [lock, setLock] = useState(false);
    
    useEffect(()=>{
        if(room) {
            const participants=room.getParticipants();
            console.log('participants', participants);
            participants.forEach((participant)=> {
                console.log('participant ind', participant);
                setIds(ids=> [...ids, participant._id]);
            })
        }

    },[room]);

    useEffect(()=> {
        speakerStats()
    },[])

    console.log('room', room);
    if(room && ids) {
    console.log('ids', ids);
    }
    const lockRoom = () => {
        if(room && room.getRole()==='moderator') {
            room.lock('password');
            setLock(true)
        }
    }
    const unlockRoom = () => {
        if(room && room.getRole()==='moderator' && lock) {
            setLock(false);
        }
    }
    const speakerStats = () => {
        return room && room.getSpeakerStats();
    }
    const kickPart=()=>{
        if(room){
            console.log('kicked');
            room.unlock()
        //room.setDisplayName(name);
        } 

        // function userKicked(id) { 
        //     console.log('kicke', id); // kicked out user id 
        //  }
        // room.on(SariskaMediaTransport.events.conference.KICKED, userKicked);
        // room.kickParticipant(id);
        //room.grantOwner(id);
        //console.log('getconn', room.startTranscriber());
    }

     
     // set new display name
    // notifies to everyone in the room that display name has changed
    
    return (
        <div className="localStream">
            <button onClick={!lock ? lockRoom : unlockRoom}>{!lock ? 'Lock Room': 'Unlock Room'}</button>
            {localTracks.map((track, idx) => {
                return track.isVideoTrack() && (
                    <Video key={track.track.id} track={track} />
                )
            })}
            
        </div>
    );
}

export default LocalStream;
