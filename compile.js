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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
const child_process_1 = require("child_process");
// 建立讀取介面
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Promise 化 question 函數
function question(query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}
function convertVariableDeclaration(line) {
    // 移除 const, let, var 並處理賦值
    return line.replace(/\b(const|let|var)\s+/g, '');
}
function convertConsoleLog(line) {
    // 將 console.log 轉換為 print
    return line.replace(/console\.log\((.*)\)/g, 'print($1)');
}
function convertBoolean(line) {
    // 轉換布林值
    return line.replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False');
}
function lookYAndN(ans, pyPath) {
    if (ans === "y" || ans === "Y") {
        return pyPath;
    }
    else if (ans === "n" || ans === "N") {
        return "取消覆寫";
    }
    else {
        return "請輸入y/n";
    }
}
// PyInstaller 功能
function runPyInstaller(pyPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let cond = true;
        while (cond) {
            const message = yield question("要用 pyinstaller 編譯成 exe 嗎 (y/n): ");
            if (message === "y" || message === "Y") {
                try {
                    const pyitPath = (0, child_process_1.execSync)("where pyinstaller", { encoding: "utf8" }).split("\n")[0];
                    const exePath = pyPath.replace(/\.py$/, ".exe");
                    const exeName = exePath.split("\\")[exePath.split("\\").length - 1];
                    console.log("為你準備 exe...");
                    (0, child_process_1.execSync)(`${pyitPath} --onefile --clean --name ${exeName} ${pyPath}`, { stdio: "inherit" });
                    console.log("✅ 編譯完成！");
                    cond = false;
                }
                catch (error) {
                    console.error(`Error! ${error}`);
                    cond = false;
                }
            }
            else if (message === "n" || message === "N") {
                console.log("取消編譯");
                cond = false;
            }
            else {
                console.log("請輸入 y/n");
            }
        }
    });
}
// 三元運算子函數（已修正）
function _3(indent, code) {
    let linearr = code.split(/\?|:/);
    return indent + linearr[1].trim() + " if " + linearr[0].trim() + " else " + linearr[2].trim();
}
// 改成 async 函式
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const args = process.argv.slice(2);
        if (args.length === 0) {
            console.log("使用方法: node compile.js <input.js> [output.py]");
            rl.close();
            return;
        }
        const inputFile = args[0];
        const outputFile = args[1] || inputFile.replace(/\.js$/, '.py');
        if (!fs.existsSync(inputFile)) {
            console.error(`錯誤: 找不到檔案 ${inputFile}`);
            rl.close();
            return;
        }
        // 如果輸出檔案已存在，詢問是否覆寫
        if (fs.existsSync(outputFile)) {
            const ans = yield question(`${outputFile} 已存在，是否覆寫？(y/n): `);
            const result = lookYAndN(ans, outputFile);
            if (result === "取消覆寫") {
                console.log("取消覆寫");
                rl.close();
                return;
            }
            else if (result === "請輸入y/n") {
                console.log("請輸入y/n");
                rl.close();
                return;
            }
        }
        const jsCode = fs.readFileSync(inputFile, 'utf-8');
        const lines = jsCode.split('\n');
        let python = '';
        let indentLevel = 0;
        for (let line of lines) {
            const trimmedLine = line.trim();
            // 跳過空行和註解
            if (!trimmedLine || trimmedLine.startsWith('//')) {
                if (trimmedLine.startsWith('//')) {
                    python += line.replace('//', '#') + '\n';
                }
                else {
                    python += '\n';
                }
                continue;
            }
            // 處理縮排
            const indent = '    '.repeat(indentLevel);
            // 處理右大括號（減少縮排）
            if (trimmedLine === '}') {
                indentLevel = Math.max(0, indentLevel - 1);
                continue;
            }
            // 處理變數宣告
            if (trimmedLine.match(/^(const|let|var)\s+/)) {
                let converted = convertVariableDeclaration(line);
                converted = convertConsoleLog(converted);
                converted = convertBoolean(converted);
                // 移除分號
                converted = converted.replace(/;$/, '');
                python += indent + converted.trim() + "\n";
            }
            // 處理三元運算 (已修正)
            else if (/\w+\s*\?\s*\w+\s*:\s*\w+/.test(line)) {
                python += _3(indent, trimmedLine) + "\n";
            }
            // 處理空值合併運算子 (已修正)
            else if (/\?\?/.test(line)) {
                let parts = line.split("??");
                let variable = parts[0].trim();
                let defaultValue = parts[1].trim();
                let line_3 = defaultValue + " if " + variable + " is None else " + variable;
                python += indent + line_3 + "\n";
            }
            // 處理函式定義
            else if (trimmedLine.startsWith("function ")) {
                const match = trimmedLine.match(/function\s+(\w+)\s*\((.*?)\)\s*\{?/);
                if (match) {
                    const funcName = match[1];
                    const params = match[2];
                    python += indent + `def ${funcName}(${params}):\n`;
                    indentLevel++;
                }
            }
            // 處理 return
            else if (trimmedLine.startsWith("return ")) {
                let converted = trimmedLine.replace(/return\s+/, 'return ');
                converted = converted.replace(/;$/, '');
                python += indent + converted + "\n";
            }
            // 處理 console.log
            else if (trimmedLine.includes("console.log")) {
                let converted = convertConsoleLog(trimmedLine);
                converted = convertBoolean(converted);
                converted = converted.replace(/;$/, '');
                python += indent + converted + "\n";
            }
            // 處理左大括號（增加縮排）
            else if (trimmedLine === '{') {
                indentLevel++;
            }
            // 其他行
            else {
                let converted = line.replace(/;$/, '');
                converted = convertBoolean(converted);
                python += indent + converted.trim() + "\n";
            }
        }
        fs.writeFileSync(outputFile, python);
        console.log(`✅ 轉換完成: ${inputFile} -> ${outputFile}`);
        // PyInstaller 功能（保留你的原始功能）
        yield runPyInstaller(outputFile);
        rl.close();
    });
}
main();
