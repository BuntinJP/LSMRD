"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discordUtils_1 = require("./discordUtils");
const plan = '0 0 0,6,12,18 * * *';
const plan2 = '* * * * * *';
const testData = {
    content: 'Hello World',
};
const testData2 = {
    content: 'Hello World2',
};
const channelID = '1035306965850656840';
const botToken = 'OTE1MzEwMTk1MTc1OTg1MjE0.G_Yy6L.BbAGRtI1mw8X17MTfUmip6CWJESVqAiDGF8h5o';
const main = () => {
    console.log('Hello World');
};
const option = {
    name: 'Linux-Server-Manager-for-Discord',
    timezone: 'Asia/Tokyo',
    scheduled: true,
    recoverMissedExecutions: false,
};
//cron.schedule(plan2, main, option);
(async () => {
    const c = new discordUtils_1.client(botToken, channelID);
    console.log(await c.postMessage(testData));
    // wait 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(await c.updateMessage(testData2));
})();
