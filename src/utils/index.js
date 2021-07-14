import {GENERATE_TOKEN_URL} from "../constants";

export async function getToken() {
    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sessionId: "p4sujtyakuy90", // enter your sessionId
            apiKey: "27fd6f8080d512442a3694f461adb3986cda5ba39dbe368d75"
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
