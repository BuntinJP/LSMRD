"use strict";

const cron = require("node-cron");
cron.schedule("* * * * *", () => console.log("毎秒実行"));
