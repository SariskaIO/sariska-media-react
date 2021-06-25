import React, {useState, useEffect} from 'react';
import Conference from "../../components/Conference";
import SariskaMediaTransport from "sariska-media-transport";
import {getToken} from "../../utils";

const Connection = () => {

    const [connection, setConnection] = useState(null);

    useEffect(() => {
        SariskaMediaTransport.initialize();
        SariskaMediaTransport.setLogLevel(SariskaMediaTransport.logLevels.ERROR); //TRACE ,DEBUG, INFO, LOG, WARN, ERROR
        let conn;

        const createConnection = async () => {
            let token = localStorage.getItem("token") ? localStorage.getItem("token") : await getToken();
            conn = new SariskaMediaTransport.JitsiConnection(token);
            conn.addEventListener(SariskaMediaTransport.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
            conn.addEventListener(SariskaMediaTransport.events.connection.CONNECTION_FAILED, onConnectionFailed);
            conn.addEventListener(SariskaMediaTransport.events.connection.CONNECTION_DISCONNECTED, onConnectionDisconnected);
            conn.addEventListener(SariskaMediaTransport.events.connection.PASSWORD_REQUIRED, onConnectionDisconnected);
            conn.connect();
        }

        const onConnectionSuccess = () => {
            setConnection(conn);
        }

        const onConnectionDisconnected = (error) => {
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

        const onConnectionFailed = async (error) => {
            console.log("error", error);
            if (error === SariskaMediaTransport.errors.connection.PASSWORD_REQUIRED) {  // token expired,  fetch new token and set again
                const token = await getToken();
                conn.setToken(token);
            }
        }

        const updateNetwork = () => { //  set internet connectivity status
            SariskaMediaTransport.setNetworkInfo({isOnline: window.navigator.onLine});
        }

        createConnection();

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
