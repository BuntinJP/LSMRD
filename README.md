# Linux-Server-Manager
node bot with node-cron that notice server grobal ip by discord or any webhooks

## Linux Server Manager foR Discord

## How to use

1. install node.js and npm

1. run `npm install`

1. setup a discord bot and get token

1. setup a discord channel and get channelID

1. setup config.toml
config.toml.sample is sample config.toml
```toml
channelID = "xxx" # discord channel id
token = "xxx" # discord bot token
versionImageURL = "https://xxx.png" # version image url(optional)
services = ['nginx', 'mysqld', 'user-api', 'bbs', 'user-jupyter'] # service name what you want to notice
domain = ["user.xyz", "user.tech"] # server domains (optional. it will be used for url generate for cockpit)
```

6. run in repo directory `tsc`

1. (optional) setup systemd service
```sh:lsmrd.service
[Unit]
Description=LinuxServerManager for Discord.repo="https://github.com/BuntinJP/LSMRD"
After=syslog.target network.target

[Service]
Type=simple
Restart=always
KillMode=process
WorkingDirectory=/home/user/LSMRD/
ExecStart=/home/user/.config/nvm/versions/node/v19.8.1/bin/node /home/user/LSMRD/build/index.js
User=user
Group=user
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=lsmrd

[Install]
WantedBy=multi-user.target
```

8. run `node build/index.js` or `systemctl start lsmrd`