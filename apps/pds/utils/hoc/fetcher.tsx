import axios from 'axios'

// // use this to fetch data using session
// export const fetchWithSession = (url: string) => fetch(url).then((res) => res.json())

export const fetchWithSession = (url: string) => axios(url, { withCredentials: true }).then((res: any) => res.data);

// use this to fetch data using token
export const fetchWithToken = (url: string, token: string) =>
    axios({
        method: 'GET',
        url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res: any) => res.data)
        .catch((error) => console.log(error));
