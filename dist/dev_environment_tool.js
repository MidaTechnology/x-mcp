"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const os = __importStar(require("os"));
function checkPython() {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)("python3 --version", (err, stdout, stderr) => {
            if (!err)
                return resolve(stdout || stderr);
            (0, child_process_1.exec)("python --version", (err2, stdout2, stderr2) => {
                if (!err2)
                    return resolve(stdout2 || stderr2);
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
        (0, child_process_1.exec)("brew install python3", (err, stdout, stderr) => {
            if (err)
                console.error("安装失败:", stderr);
            else
                console.log("安装完成:", stdout);
        });
    }
    else if (platform === "linux") {
        console.log("尝试使用 apt 或 yum 安装 Python...");
        (0, child_process_1.exec)("which apt-get", (err) => {
            if (!err) {
                (0, child_process_1.exec)("sudo apt-get update && sudo apt-get install -y python3 python3-pip");
            }
            else {
                (0, child_process_1.exec)("sudo yum install -y python3 python3-pip");
            }
        });
    }
    else if (platform === "win32") {
        console.log("Windows 检测到未安装 Python，请使用 winget 或手动安装:");
        console.log("winget install -e --id Python.Python.3");
    }
    else {
        console.log("暂不支持此平台，请手动安装 Python。");
    }
}
(async () => {
    try {
        const version = await checkPython();
        console.log("已检测到 Python 环境:", version.trim());
    }
    catch (e) {
        console.log("未检测到 Python，开始安装...");
        await installPython();
    }
})();
//# sourceMappingURL=dev_environment_tool.js.map