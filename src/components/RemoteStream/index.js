import React  from 'react';
import Video from "../../components/Video";
import Audio from "../../components/Audio";

const RemoteStream = props=> {
    const {remoteTracks} = props;

    return (
        <div className="remoteStream">
            {remoteTracks.map((track, idx) => {
                return track.isVideoTrack() ? <Video key={track.track.id} track={track}/> : <Audio key={track.track.id} track={track}/>
            })}
        </div>
    );
}

export default RemoteStream;
