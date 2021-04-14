import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import Connection from "./components/Connection";
import store from './store/store';
import ContactEmp from './components/ContactEmp';
import { getToken } from './utils';
import ReactGa from 'react-ga';
import { GOOGLE_ANALYTICS_TRACKING_ID } from './config';

function App() {
    useEffect(()=>{
        const FetchToken = async () => {
            const token = await getToken();
            window.localStorage.setItem('token', token);
        }
    FetchToken();
    }, [])
     
    useEffect(()=>{
        ReactGa.initialize(GOOGLE_ANALYTICS_TRACKING_ID);
        console.log('react', ReactGa);
        ReactGa.pageview('/')
    },[])

    const clickHandler = () => {
        ReactGa.event({
            category: 'user',
            action: 'user clicked'
        })
    }

    return (
        <Provider store={store}>
            <div className="App">
                <Connection/>
                {/* <ContactEmp /> */}
                <button onClick={clickHandler}>click</button>
            </div>
        </Provider>
    );
}

export default App;
