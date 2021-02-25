import React  from 'react';
import Video from "../../components/Video";
import Audio from "../../components/Audio";

const RemoteStream = props=> {
    const {remoteTracks} = props;
    return (
        <div className="remoteStream">
            {remoteTracks.map((track, idx) => {
                return track.isVideoTrack() ? <Video key={idx} track={track}/> : <Audio key={idx} track={track}/>
            })}
        </div>
    );
}

export default RemoteStream;
