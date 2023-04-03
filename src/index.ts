//setting the toml file Types
export interface Config {
    channelID: string;
    token: string;
    versionImageURL?: string;
    services: string[];
    domain: string[];
}
import path from 'path';
import { Client } from './discordUtils';
//configration variables
const plan: string = '0 0,30 * * * *';
const configPath: string = path.join(__dirname, '../config.toml');

//main process
const main = async () => {
    const client = new Client(plan, configPath);
    await client.pripare();
    client.start();
};
const testRun = async () => {
    const client = new Client(plan, configPath);
    console.log(await client.pripare());
    await client.test();
};
main();
