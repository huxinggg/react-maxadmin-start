// insert-version.js
const fs = require('fs');
const { execSync } = require('child_process');
const env = process.argv[2]

require('dotenv').config({ path: env });

let origin = "test"
if (env.includes("production")) {
  origin = "main"
}

function incrementVersion(version) {
  const versionParts = version.split('.').map(part => parseInt(part, 10));
  // 递增版本号
  if (versionParts[2] < 9) {
    versionParts[2] += 1;
  } else if (versionParts[1] < 9) {
    versionParts[1] += 1;
    versionParts[2] = 0;
  } else {
    versionParts[0] += 1;
    versionParts[1] = 0;
    versionParts[2] = 0;
  }

  // 新版本号
  const newVersion = `v${versionParts[0]}.${versionParts[1]}.${versionParts[2]}`;
  return newVersion;
}

process.env.REACT_APP_VERSION = incrementVersion(process.env.REACT_APP_VERSION.split("v")[1])

let configString = ''
for (let key in process.env) {
  if (key.includes("REACT_APP")) {
    configString += `${key}=${process.env[key]} \n`
  }
}
fs.writeFileSync(env, configString);

try {
  // 执行 git 命令
  execSync(`git add . && git commit -am "${process.env.REACT_APP_VERSION}" && git push origin ${origin} -f`);
  console.log('Git 操作执行成功！');
} catch (error) {
  console.error('Git 操作执行失败:', error.message);
}



