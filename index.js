"use strict";

const axios = require("axios");
const execSync = require("child_process").execSync;
let date = new Date();
const URL = ``;

//ヘッダーなどの設定
const config = {
	headers: {
		Accept: "application/json",
		"Content-type": "application/json",
	},
};

//送信するデータ
const postData = {
	username: "OracleLinuxManager",
	content:
		date.toLocaleString() +
		"現在のグローバルIP  ：" +
		execSync("curl inet-ip.info").toString(),
};
const startNoticePost = {
	
	content: "IP通知システム起動！！毎日0,6,12,18時に通知します。",
};

const main = async (post) => {
	const res = await axios.post(URL, post, config);
	console.log(res);
};
main(startNoticePost);
const cron = require("node-cron");
const { start } = require("repl");
cron.schedule("0 0 0,6,12,18 * * *", () => main(postData));
