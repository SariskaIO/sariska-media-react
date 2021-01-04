import React, {useState, useEffect, Fragment} from 'react';
import Conference from "../../components/Conference";
import JitsiMeetJS from "sariska-media-transport";
import {connectionConfig, initSDKConfig} from "../../constants";
import {getToken, getL} from "../../utils";

const Connection = props=> {

    const [connection, setConnection] = useState(null);

    useEffect(() => {
        JitsiMeetJS.init(initSDKConfig);
        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR); //TRACE ,DEBUG, INFO, LOG, WARN, ERROR
        let conn;

        const fetchData =  async ()=>{
            const token = await getToken();
            if (!token) {
                return;
            }
            conn = new JitsiMeetJS.JitsiConnection(token, connectionConfig);
            conn.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
            conn.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
            conn.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, onConnectionDisconnected);
            conn.addEventListener(JitsiMeetJS.events.connection.PASSWORD_REQUIRED, onConnectionDisconnected);
            conn.connect();
        }

        const onConnectionSuccess = ()=>{
            setConnection(conn);
        }

        const onConnectionDisconnected = (error)=>{
            console.log('connection disconnect!!!', error);
            if (!connection) {
                return;
            }
            connection.removeEventListener(
                JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
                onConnectionSuccess);
            connection.removeEventListener(
                JitsiMeetJS.events.connection.CONNECTION_FAILED,
                onConnectionFailed);
            connection.removeEventListener(
                JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
                onConnectionDisconnected);

        }

        const onConnectionFailed = async (error)=> {
            console.log('connection failed!!!', error);
            if (error === "connection.passwordRequired") {  // token expired,  fetch new token and set again
                const token = await getToken();
                conn.setToken(token);
            }
        }

        const updateNetwork = ()=>{  //  set internet connectivity status
            JitsiMeetJS.setNetworkInfo({isOnline: window.navigator.onLine});
        }

        fetchData();
        
        window.addEventListener("offline", updateNetwork);
        window.addEventListener("online", updateNetwork);

        return () => {
            window.removeEventListener("offline", updateNetwork);
            window.removeEventListener("online", updateNetwork);
        };

    }, []);


    return (<Conference connection={connection}/>);
}

export default Connection;
