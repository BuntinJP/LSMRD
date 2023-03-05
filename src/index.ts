//import {} from '';
import * as cron from 'node-cron';
import { RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';
import { client, sleep } from './discordUtils';
const plan: string = '0 0 0,6,12,18 * * *';
const plan2: string = '* * * * * *';
const testData: RESTPostAPIChannelMessageJSONBody = {
    content: 'Hello World',
};
const testData2: RESTPostAPIChannelMessageJSONBody = {
    content: 'Hello World2',
};
const channelID: string = '1035306965850656840';
const botToken: string =
    'OTE1MzEwMTk1MTc1OTg1MjE0.Gu4q0i.QXQFyjwCInEeCiGwLqWeVlhGDXVatRVJD_krV0';
const main = () => {
    console.log('Hello World');
};

const option: cron.ScheduleOptions = {
    name: 'Linux-Server-Manager-for-Discord',
    timezone: 'Asia/Tokyo',
    scheduled: true,
    recoverMissedExecutions: false,
};

//cron.schedule(plan2, main, option);
