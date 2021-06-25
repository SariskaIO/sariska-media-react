import React, {useEffect, useRef} from 'react';
import './index.css';

const Video  = props=> {
    const videoElementRef = useRef(null);

    useEffect(() => {
        props.track.attach(videoElementRef.current);
        return () => {
            props.track.detach(videoElementRef.current);
        }
    }, [props.track]);

    return (<video playsInline="1" autoPlay='1' className="Video" ref={videoElementRef}/>);
}

export default Video;
