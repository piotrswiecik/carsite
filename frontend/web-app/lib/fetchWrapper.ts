import {getTokenWorkaround} from "@/app/actions/authActions";

const baseUrl = "http://localhost:6001"

async function get(url: string) {
    const requestOptions = {
        headers: await getHeaders(),
        method: "GET",
    };
    
    const response = await fetch(`${baseUrl}${url}`, requestOptions);
    
    return await handleResponse(response);
}

async function post(url: string, body: {}) {
    const requestOptions = {
        headers: await getHeaders(),
        method: "POST",
        body: JSON.stringify(body)
    };
    
    const response = await fetch(`${baseUrl}${url}`, requestOptions);
    
    return await handleResponse(response);
}

async function put(url: string, body: {}) {
    const requestOptions = {
        headers: await getHeaders(),
        method: "PUT",
        body: JSON.stringify(body)
    };

    const response = await fetch(`${baseUrl}${url}`, requestOptions);

    return await handleResponse(response);
}

async function del(url: string) {
    const requestOptions = {
        headers: await getHeaders(),
        method: "DELETE",
    };

    const response = await fetch(`${baseUrl}${url}`, requestOptions);

    return await handleResponse(response);
}

async function getHeaders() {
    const token = await getTokenWorkaround();
    const headers = {
        "Content-Type": "application/json",
    } as any;
    if (token) {
        headers["Authorization"] = `Bearer ${token.access_token}`;
    }
    return headers;
}

async function handleResponse(response: Response) {
    const text = await response.text();
    const data = text && JSON.parse(text);
    
    if (response.ok) {
        return data || response.statusText;
    }
    else {
        const error = {
            status: response.status,
            message: response.statusText
        };
        
        return {error};
    }
}

export const fetchWrapper = {
    get,
    post,
    put,
    del
};