"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const axios_1 = __importDefault(require("axios"));
class client {
    token;
    channelID;
    headers = {
        Accept: 'application/json',
        'Content-type': 'application/json',
    };
    config = {
        headers: this.headers,
    };
    messageID = '';
    constructor(token, channelID) {
        this.token = token;
        this.headers.Authorization = `Bot ${token}`;
        this.channelID = channelID;
    }
    async postMessage(data) {
        const url = `https://discord.com/api/channels/${this.channelID}/messages`;
        const response = await axios_1.default.post(url, data, this.config);
        return response.data;
    }
    async updateMessage(data) {
        const url = `https://discord.com/api/channels/${this.channelID}/messages/${this.messageID}`;
        const response = await axios_1.default.patch(url, data, this.config);
        return response.data;
    }
}
exports.client = client;
