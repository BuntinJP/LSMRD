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
        const response = await axios.post(url, data, this.config);
        return response.data;
    }
    public async updateMessage(
        data: RESTPatchAPIChannelMessageJSONBody
    ): Promise<object> {
        const url: string = `https://discord.com/api/channels/${this.channelID}/messages/${this.messageID}`;
        const response = await axios.patch(url, data, this.config);
        return response.data;
    }
}

export { client };
