import {GENERATE_TOKEN_URL} from "../constants";

export async function getToken() {
        
    // let user = {
    //     id: "user_id",
    //     name: "user_name"
    // };

    // if (window.location.search.indexOf("param")===1){
    //    user = {
    //             id: "user_id1",
    //             name: "user_name1"
    //         };
    // };
    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sessionId: "p4sujtyakuyi", // enter your sessionId
            apiKey: "25916faa8bcf17467d3c98fb21f3b38466d003b99cee308c7ecf"
        })
    };

    try {
        const response = await fetch(GENERATE_TOKEN_URL, body);
        if (response.ok) {
            const json = await response.json();
            localStorage.setItem("token", json.token);
            return json.token;
        } else {
            console.log(response.status);
        }
    } catch (error) {
        console.log('error', error);
    }
}



function isIncognito(callback){
    var fs = window.RequestFileSystem || window.webkitRequestFileSystem;

    if (!fs) {
        callback(false);
    } else {
        fs(window.TEMPORARY,
            100,
            callback.bind(undefined, false),
            callback.bind(undefined, true)
        );
    }
}