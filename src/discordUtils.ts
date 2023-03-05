import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import {
    RESTPostAPIChannelMessageJSONBody,
    RESTPatchAPIChannelMessageJSONBody,
} from 'discord-api-types/v10';

class client {
    private token: string;
    private channelID: string;
    private headers: AxiosRequestHeaders = {
        Accept: 'application/json',
        'Content-type': 'application/json',
    };
    private config: AxiosRequestConfig = {
        headers: this.headers,
    };
    private messageID: string = '';
    constructor(token: string, channelID: string) {
        this.token = token;
        this.headers.Authorization = `Bot ${token}`;
        this.channelID = channelID;
    }
    public async postMessage(
        data: RESTPostAPIChannelMessageJSONBody
    ): Promise<object> {
        const url: string = `https://discord.com/api/channels/${this.channelID}/messages`;
        try {
            const response = await axios.post(url, data, this.config);
            this.messageID = response.data.id;
            return response.data;
        } catch (e) {
            return { error: e };
        }
    }
    public async updateMessage(
        data: RESTPatchAPIChannelMessageJSONBody
    ): Promise<object> {
        const url: string = `https://discord.com/api/channels/${this.channelID}/messages/${this.messageID}`;
        try {
            const response = await axios.patch(url, data, this.config);

            return response.data;
        } catch (e) {
            return { error: e };
        }
    }
}

// sleep a process while sec seconds function
const sleep = (sec: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
};

export { client, sleep };
