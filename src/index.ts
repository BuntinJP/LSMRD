//setting the toml file Types
export interface Config {
    channelID: string;
    token: string;
    versionImageURL?: string;
    services: string[];
    domain: string[];
}
import path from 'path';
import { Client } from './lsmrdClient';
//configration variables
const plan: string = '0 0,30 * * * *';
const configPath: string = path.join(__dirname, '../config.toml');

//main process
const main = async () => {
    const client = new Client(plan, configPath);
    await client.prepare();
    client.start();
};
const testRun = async () => {
    const client = new Client(plan, configPath);
    await client.prepare();
    await client.test();
};
main();
