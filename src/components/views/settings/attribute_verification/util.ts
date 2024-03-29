import {MatrixClientPeg} from "../../../../MatrixClientPeg";



export const getData = async (url: string): Promise<any | undefined> => {
    // todo: Executing the API should be implemented as a MatrixClient function.
    const response = await fetch(url, {headers:
            {Authorization: `Bearer ${MatrixClientPeg.safeGet().getAccessToken()}`}
    });
    if (response.ok) {
        return await response.json();
    }
    console.log(`response is ${JSON.stringify(response)}`)
    return undefined;
}

export const postData = async (url: string, data: any): Promise<any | undefined> => {
    const response = await fetch(url,
        {method: "POST",
            body: JSON.stringify(data),
            headers:
                {Authorization: `Bearer ${MatrixClientPeg.safeGet().getAccessToken()}`,
                    "Content-Type": "application/json"}
        });
    if (response.ok) {
        return await response.json();
    }
    return undefined
}
