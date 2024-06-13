import {getTokenWorkaround} from "@/app/actions/authActions";

const baseUrl = process.env.API_URL;

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
    let data;
    try {
        data = text && JSON.parse(text);
    } catch (error) {
        data = text;
    }
    
    if (response.ok) {
        return data || response.statusText;
    }
    else {
        const error = {
            status: response.status,
            message: typeof data === "string" ? data: response.statusText
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