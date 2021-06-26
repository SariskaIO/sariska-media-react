import {GENERATE_TOKEN_URL} from "../constants";

export async function getToken() {
    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sessionId: "p4sujtyakuyi", // enter your sessionId
            apiKey: "25fd6f978bc51457203898e134eaba806cd104f480b8269f38"
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
