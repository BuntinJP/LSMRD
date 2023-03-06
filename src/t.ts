import toml from 'toml';
import fs from 'fs';
import execSync from 'child_process';

const shell = (command: string): string => {
    return execSync.execSync(command).toString().trim();
};

console.log(shell('systemctl status nginx.service'));
