import React  from 'react';
import Video from "../../components/Video";
import Audio from "../../components/Audio";

const RemoteStream = props => {
    return (
        <div className="remoteStream">
            {props.tracks.map((track, idx) => {
                return track.getType()==="video" ? <Video key={idx} track={track}/> : <Audio key={idx} track={track}/>
            })}
        </div>
    );
}

export default RemoteStream;
