import React, {useState, useEffect} from 'react';
import Conference from "../../components/Conference";
import SariskaMediaTransport from "sariska-media-transport";
import {connectionConfig, initSDKConfig} from "../../constants";
import {getToken} from "../../utils";
import { useDispatch, useSelector } from 'react-redux';
import { isRtcstatsEnabled } from '../../features/RTC/function';
import RTCStats from '../../features/RTC/RTCStats';

const Connection = props=> {

    const [connection, setConnection] = useState(null);
    const dispatch = useDispatch()
    const {analytics} = initSDKConfig;    

    useEffect(() => {
        if (isRtcstatsEnabled()) {
            // RTCStats "proxies" WebRTC functions such as GUM and RTCPeerConnection by rewriting the global
            // window functions. Because lib-jitsi-meet uses references to those functions that are taken on
            // init, we need to add these proxies before it initializes, otherwise lib-jitsi-meet will use the
            // original non proxy versions of these functions.
            try {
                // Default poll interval is 1000ms if not provided in the config.
                const pollInterval = analytics.rtcstatsPollInterval || 1000;

                // Initialize but don't connect to the rtcstats server wss, as it will start sending data for all
                // media calls made even before the conference started.
                RTCStats.init({
                    rtcstatsEndpoint: analytics.rtcstatsEndpoint,
                    rtcstatsPollInterval: pollInterval
                });
                console.log('RTCStats initialised', RTCStats);
            } catch (error) {
                logger.error('Failed to initialize RTCStats: ', error);
            }
        }
        SariskaMediaTransport.init(initSDKConfig);
        SariskaMediaTransport.setLogLevel(SariskaMediaTransport.logLevels.ERROR); //TRACE ,DEBUG, INFO, LOG, WARN, ERROR
        let conn;

        const fetchData = ()=>{
            const token = window.localStorage.getItem('token');
            console.log('token', token);
            if (!token) {
                return;
            }
            conn = new SariskaMediaTransport.JitsiConnection(token, connectionConfig);
            conn.addEventListener(SariskaMediaTransport.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
            conn.addEventListener(SariskaMediaTransport.events.connection.CONNECTION_FAILED, onConnectionFailed);
            conn.addEventListener(SariskaMediaTransport.events.connection.CONNECTION_DISCONNECTED, onConnectionDisconnected);
            conn.addEventListener(SariskaMediaTransport.events.connection.PASSWORD_REQUIRED, onConnectionDisconnected);
            conn.connect();
        }

        const onConnectionSuccess = ()=>{
            setConnection(conn);

        }

        const onConnectionDisconnected = (error)=>{
            if (!connection) {
                return;
            }
            connection.removeEventListener(
                SariskaMediaTransport.events.connection.CONNECTION_ESTABLISHED,
                onConnectionSuccess);
            connection.removeEventListener(
                SariskaMediaTransport.events.connection.CONNECTION_FAILED,
                onConnectionFailed);
            connection.removeEventListener(
                SariskaMediaTransport.events.connection.CONNECTION_DISCONNECTED,
                onConnectionDisconnected);

        }

        const onConnectionFailed = async (error)=> {
            if (error === SariskaMediaTransport.connection.error.PASSWORD_REQUIRED) {  // token expired,  fetch new token and set again
                const token = await getToken();
                conn.setToken(token);
            }
        }

        const updateNetwork = ()=>{  //  set internet connectivity status
            SariskaMediaTransport.setNetworkInfo({isOnline: window.navigator.onLine});
        }

        fetchData();

        window.addEventListener("offline", updateNetwork);
        window.addEventListener("online", updateNetwork);

        return () => {
            window.removeEventListener("offline", updateNetwork);
            window.removeEventListener("online", updateNetwork);
        };

    }, []);


    return (
    <Conference connection={connection}/>
    );
}

export default Connection;
