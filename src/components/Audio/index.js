import React, {useEffect, useRef} from 'react';

const Audio = props=> {

    const audioElementRef = useRef(null);
    useEffect(() => {
        const element = audioElementRef.current;
        props.track.attach(element);

        return () => {
            props.track.detach(element);
        }
    }, [props.track]);

    return (<audio playsInline="1" autoPlay='1' ref={audioElementRef}/>);
}

export default Audio;
