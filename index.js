"use strict";

const axios = require("axios");
const execSync = require("child_process").execSync;
let date = new Date();
const URL = "https://discord.com/api/webhooks/1026194723746091038/tfPze97s_1IzO7UDNklZWPcHE4xR-Z3YPn2Ht3X4lbjzNiVk-GQ9yCvuiy8ZDOSetqR0";

//ヘッダーなどの設定
const config = {
	headers: {
		Accept: "application/json",
		"Content-type": "application/json",
	},
};

//送信するデータ
function naiyou() {
	let nd = `${date.toLocaleString()}現在のグローバルIP`;
	let ip = execSync("curl inet-ip.info").toString();
	return {
		content: nd + ip
	}
}

const startNoticePost = {
	content: "IP通知システム起動！！毎日0,6,12,18時に通知します。",
};

const main = async (post) => {
	const res = await axios.post(URL, post, config);
	console.log(res);
};

main(startNoticePost);
const cron = require("node-cron");
cron.schedule("0 0 0,6,12,18 * * *", (date) =>{
	let nd = `${date.toLocaleString()}現在のグローバルIP`;
	let ip = execSync("curl inet-ip.info").toString();
	main({content: nd + ip});
});
