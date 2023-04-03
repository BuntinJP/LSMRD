// import interface for toml object from index.ts
import { Config } from './index';
//modules
import { CronJob } from 'cron';
import { execSync } from 'child_process';
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
    private services: string[];
    private domain: string[] = [];
    private headers: AxiosRequestHeaders = {
        Accept: 'application/json',
        'Content-type': 'application/json',
    };
    private config: AxiosRequestConfig = {
        headers: this.headers,
    };
    static regx: RegExp = /".*"/;
    //Constructor
    constructor(cronPlan: string, settingFilePath: string = 'config.toml') {
        this.count = 0;
        const config: Config = loadTomlSettings(settingFilePath);
        this.headers.Authorization = `Bot ${config.token}`;
        this.channelID = config.channelID;
        this.versionImageURL = config.versionImageURL;
        this.services = config.services;
        this.domain = config.domain;
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
    ): Promise<void> {
        const url: string = `https://discord.com/api/channels/${this.channelID}/messages/${this.messageID}`;
        console.log("update\n" + url);
        try {
            const response = await axios.patch(url, data, this.config).catch((e) => {
                console.log('error in updateMessage');
                console.log(e.toJSON());
            })
            return;
        } catch (e) {
            return;
        }
    }
    private async createServerStatusFields(
        services: string[]
    ): Promise<APIEmbedField[]> {
        let fields: APIEmbedField[] = [];
        for (const service of services) {
            const status: string = checkServiceStatus(service);
            fields.push({
                name: service,
                value: `\`\`\`${status}\`\`\``,
            });
        }
        return fields;
    }
    private async generateContent(
        text: string = ''
    ): Promise<RESTPostAPIChannelMessageJSONBody> {
        const fields: APIEmbedField[] = await this.createServerStatusFields(
            this.services
        );
        let version: string = shell('cat /etc/os-release | grep PRETTY_NAME');
        version = version.match(Client.regx)![0].replace(/"/g, '');
        const uptime: string = shell('uptime');
        let embed: APIEmbed = {
            title: 'Linux Server Manager foR Discord (LSMRD)',
            description: `\`\`\` \n
            ipv4: [${shell('curl inet-ip.info')}]\n
            ipv6: [${shell('curl ifconfig.co')}]\n
            domain: [${this.domain.join(', ')}]\n
            \`\`\`
            \n
            ${'https://cockpit.' + this.domain[0]}
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
    public async prepare(): Promise<string> {
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
    //debug
    public async debug(): Promise<void> {
        console.log("debug-mode\ngenerate content\n");
        console.log(await this.generateContent());
    }
    public async test(): Promise<void> {
        let data = await this.generateContent();

        await this.updateMessage(data);
    };
}

// 引数のコマンドを実行し結果を文字列で返す。
const shell = (command: string): string => {
    return execSync(command).toString().trim();
};

// 引数の秒数だけ同期処理を止める。
const sleep = (sec: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
};

// tomlファイルを読み込み、Config型に変換して返す。(Config型はindex.tsに定義)
const loadTomlSettings = (path: string) => {
    return JSON.parse(
        JSON.stringify(toml.parse(fs.readFileSync(path).toString()))
    ) as Config;
};

//systemctl status <service>でサービスの状態を確認する。
const checkServiceStatus = (service: string): string => {
    let isactive = true;
    try {
        shell(`systemctl is-active ${service}`);
    } catch (e) {
        isactive = false;
    }
    if (!isactive) {
        return 'inactive';
    }
    const outputs = shell(`systemctl status ${service}`).trim();
    //        .replace(/^\n/gm, '');
    const outputArray = outputs.split('\n');
    const title = outputArray[0];
    const loaded = outputArray[1];
    const active = outputArray[2];
    let mainPID = '';
    let tasks = '';
    let memory = '';
    let cpu = '';
    //MainPID
    mainPID = outputArray.find((line) => line.includes('Main PID')) + '\n';
    //Tasks
    tasks = outputArray.find((line) => line.includes('Tasks')) + '\n';
    //CPU
    cpu = outputArray.find((line) => line.includes('CPU')) + '\n';
    const result = `${title}\n${loaded}\n${active}\n${mainPID}${tasks}${cpu}`;
    return result;
};

export { Client };
