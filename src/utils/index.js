import {GENERATE_TOKEN_URL} from "../constants";

export async function getToken() {
    var url = window.location.search;
    url = url.replace("?", ''); // remove the ?
    const room = url.split("=")[1]


    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sessionId: room, // enter your sessionId
            apiKey: "27936faa8ad60e4a3d3ac2b422eca58f6cc855a99fb42aca3ed4", // enter your app secret
            // user: {  Optionally, you can provide user display information for better tracking and user experience
            //     id: <user_id>
            //     name: <user_name>,
            //     avatar: <user_avatar>,
            //     email: <user_email>
            // }
        })
    };
    
    try {
        const response = await fetch(GENERATE_TOKEN_URL, body);
        if (response.ok) {
            const json = await response.json();
            return json.token;
        } else {
            console.log(response.status);
        }
    } catch (error) {
        console.log('error', error);
    }
}
