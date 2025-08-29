import { exec } from "child_process";
import * as os from "os";

function checkPython(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec("python3 --version", (err, stdout, stderr) => {
      if (!err) return resolve(stdout || stderr);

      exec("python --version", (err2, stdout2, stderr2) => {
        if (!err2) return resolve(stdout2 || stderr2);
        reject("Python not found");
      });
    });
  });
}

async function installPython() {
  const platform = os.platform();
  console.log(`当前系统: ${platform}`);

  if (platform === "darwin") {
    console.log("尝试使用 Homebrew 安装 Python...");
    exec("brew install python3", (err, stdout, stderr) => {
      if (err) console.error("安装失败:", stderr);
      else console.log("安装完成:", stdout);
    });
  } else if (platform === "linux") {
    console.log("尝试使用 apt 或 yum 安装 Python...");
    exec("which apt-get", (err) => {
      if (!err) {
        exec(
          "sudo apt-get update && sudo apt-get install -y python3 python3-pip"
        );
      } else {
        exec("sudo yum install -y python3 python3-pip");
      }
    });
  } else if (platform === "win32") {
    console.log("Windows 检测到未安装 Python，请使用 winget 或手动安装:");
    console.log("winget install -e --id Python.Python.3");
  } else {
    console.log("暂不支持此平台，请手动安装 Python。");
  }
}

(async () => {
  try {
    const version = await checkPython();
    console.log("已检测到 Python 环境:", version.trim());
  } catch (e) {
    console.log("未检测到 Python，开始安装...");
    await installPython();
  }
})();
