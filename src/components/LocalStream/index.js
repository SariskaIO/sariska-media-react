import React, {useEffect, useState} from 'react';
import Video from "../../components/Video";
import Audio from "../../components/Audio";

const LocalStream = props=> {
    const {localTracks} = props;
    return (
        <div className="localStream">
            {localTracks.map((track, idx) => {
                return track.isVideoTrack() ? <Video key={idx} track={track}/> : <Audio key={idx} track={track}/>
            })}
        </div>
    );
}

export default LocalStream;
