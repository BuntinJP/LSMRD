//import {} from '';
import * as cron from 'node-cron';
import { RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v10';
import { client } from './discordUtils';
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
    'OTE1MzEwMTk1MTc1OTg1MjE0.G_Yy6L.BbAGRtI1mw8X17MTfUmip6CWJESVqAiDGF8h5o';
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
(async () => {
    const c = new client(botToken, channelID);
    console.log(await c.postMessage(testData));
    // wait 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(await c.updateMessage(testData2));
})();
