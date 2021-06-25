import React from 'react';
import Video from "../../components/Video";

const LocalStream = props => {
    return (
        <div className="localStream">
            { props.tracks.map((track, idx) => {
                return track.getType() === "video" && <Video key={idx} track={track}/>
            })}
        </div>
    );
}

export default LocalStream;
