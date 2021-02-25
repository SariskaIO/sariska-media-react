import React from 'react';
import Video from "../../components/Video";

const LocalStream = props=> {
    const {localTracks} = props;
    return (
        <div className="localStream">
            {localTracks.map((track, idx) => {
                return track.isVideoTrack() && <Video key={track.track.id} track={track}/>
            })}
        </div>
    );
}

export default LocalStream;
