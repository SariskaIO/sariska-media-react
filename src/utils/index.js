import {GENERATE_TOKEN_URL} from "../constants";

export async function getToken() {
    
    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sessionId: "mj4uwy8nmr", // enter your sessionId
            apiKey: "25916faa8bcf17467d3c98fb21f3b38466d003b99cee308c7ecf" // enter your app secret

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
