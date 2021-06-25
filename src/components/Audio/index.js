import React, {useEffect, useRef} from 'react';

const Audio = props=> {
    const audioElementRef = useRef(null);

    useEffect(() => {
        props.track.attach(audioElementRef.current);
        return () => {
            props.track.detach(audioElementRef.current);
        }
    }, [props.track]);

    return (<audio playsInline="1" autoPlay='1' ref={audioElementRef}/>);
}

export default Audio;
