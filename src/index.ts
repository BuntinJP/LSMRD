//setting the toml file Types
export interface Config {
    channelID: string;
    token: string;
    versionImageURL?: string;
}
import { Client, sleep, loadTomlSettings, shell } from './discordUtils';
const plan: string = '0 0 0,6,12,18 * * *';

const config: Config = loadTomlSettings('settings.toml');
const client = new Client(plan);
const main = async () => {
    await client.pripare();
    client.start();
};
main();
