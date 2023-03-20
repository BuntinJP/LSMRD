// import interface for toml object from index.ts
import { Config } from './index';
//modules
import { CronJob } from 'cron';
import execSync from 'child_process';
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import {
    RESTPostAPIChannelMessageJSONBody,
    RESTPatchAPIChannelMessageJSONBody,
    APIEmbed,
    APIEmbedField,
} from 'discord-api-types/v10';
import toml from 'toml';
import fs from 'fs';
//main client class(class is )
class Client {
    private count: number;
    private cronJob: CronJob;
    private channelID: string;
    private messageID: string = '';
    private versionImageURL: string | undefined;
    private headers: AxiosRequestHeaders = {
        Accept: 'application/json',
        'Content-type': 'application/json',
    };
    private config: AxiosRequestConfig = {
        headers: this.headers,
    };
    static regx: RegExp = /".*"/;
    constructor(cronPlan: string, settingFilePath: string = 'settings.toml') {
        this.count = 0;
        const config: Config = loadTomlSettings(settingFilePath);
        this.headers.Authorization = `Bot ${config.token}`;
        this.channelID = config.channelID;
        this.versionImageURL = config.versionImageURL;
        this.cronJob = new CronJob(cronPlan, async () => {
            try {
                await this.main();
            } catch (e) {
                console.error(e);
            }
        });
    }
    private async postMessage(
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
    private async updateMessage(
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
    private async getServerStatus(
        services: string[]
    ): Promise<APIEmbedField[]> {
        let fields: APIEmbedField[] = [];
        for (const service of services) {
            const status: string = shell(`systemctl status ${service}`);
            const output = status.split('\n').slice(0, 7).join('\n');
            fields.push({
                name: service,
                value: `\`\`\`${output}\`\`\``,
            });
        }
        return fields;
    }
    private async generateContent(
        text: string = ''
    ): Promise<RESTPostAPIChannelMessageJSONBody> {
        const services: string[] = [
            'nginx.service',
            'mysqld.service',
            'buntin-api.service',
            'bbs.service',
            'buntin-jupyter.service',
        ];
        const fields: APIEmbedField[] = await this.getServerStatus(services);
        let version: string = shell('cat /etc/os-release | grep PRETTY_NAME');
        version = version.match(Client.regx)![0].replace(/"/g, '');
        const uptime: string = shell('uptime -p');
        let embed: APIEmbed = {
            title: 'Linux Server Manager for Discord',
            description: `\`\`\` \n
            ipv4: [${shell('curl inet-ip.info')}]\n
            ipv6: [${shell('curl -6 https://ifconfig.co')}]
            \`\`\`
            \n
            https://cockpit.buntin.tech
            \n\n\`count: ${this.count}\`
            `,
            author: {
                name: version,
                icon_url: this.versionImageURL,
            },
            timestamp: new Date().toISOString(),
            fields: fields,
            footer: {
                text: uptime,
            },
        };
        return { content: text, embeds: [embed] };
    }
    //main process of cron job
    private async main(): Promise<void> {
        this.count++;
        let data = await this.generateContent();
        await this.updateMessage(data);
    }
    //prepare the class properties
    public async pripare(): Promise<string> {
        if (this.messageID === '') {
            let data: RESTPostAPIChannelMessageJSONBody = {
                content:
                    'Linux Server Manager for Discord v0.1.0\nCron Job Priparing\n Cron is ready.\n\nPlan is every 30 minutes.\n\nhttps://github.com/BuntinJP/Linux-Server-Manager',
            };
            await this.postMessage(data);
            return 'Cron Job ready.';
        } else {
            return 'Cron Job already ready.';
        }
    }
    //start cron job
    public start(): String {
        if (this.cronJob.running) {
            return 'Already running';
        } else {
            this.cronJob.start();
            return 'Started';
        }
    }
    //stop cron job
    public stop(): String {
        if (this.cronJob.running) {
            this.cronJob.stop();
            return 'Stopped';
        } else {
            return 'Already stopped';
        }
    }
}

const shell = (command: string): string => {
    return execSync.execSync(command).toString().trim();
};

// sleep a process while sec seconds function
const sleep = (sec: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
};

const loadTomlSettings = (path: string) => {
    return JSON.parse(
        JSON.stringify(toml.parse(fs.readFileSync(path).toString()))
    ) as Config;
};

export { Client, sleep, loadTomlSettings, shell };
