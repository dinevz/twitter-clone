const baseUrl = 'https://postterr.herokuapp.com';


export const getDummyProfile = async (str) => {
    if(str === undefined) {
        return
    }
    const response = await fetch(`${baseUrl}/jsonstore/profile/profiles/${str}`, {
        headers: {
            'Content-type': 'application/json',
        },
    });
    const result = await response.json()
    if (response.ok) {
        return result;
    } else {
        throw result;
    }
}

export const getDummyPosts = async () => {
    const response = await fetch(`${baseUrl}/jsonstore/profile/posts`, {
        headers: {
            'Content-type': 'application/json',
        },
    });
    const result = await response.json()
    if (response.ok) {
        return result;
    } else {
        throw result;
    }
}

export const getDummyComments = async () => {
    const response = await fetch(`${baseUrl}/jsonstore/profile/comments`, {
        headers: {
            'Content-type': 'application/json',
        },
    });
    const result = await response.json()
    if (response.ok) {
        return result;
    } else {
        throw result;
    }
}

