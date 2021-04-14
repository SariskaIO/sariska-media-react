import React, {useEffect, useRef} from 'react';
import './index.css';

const Video  = props=> {
    const videoElementRef = useRef(null);
    useEffect(() => {
        const element = videoElementRef.current;
        props.track.attach(element);
        return () => {
            props.track.detach(element);
        }
    }, [props.track]);

    return (
        <div>
            <div>trsack {props.track && props.track.getParticipantId()}</div>
    <video playsInline="1" autoPlay='1' className="Video" ref={videoElementRef}/>
    </div>
    );
    
}

export default Video;
