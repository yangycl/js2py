"use strict";
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
const child_process_1 = require("child_process");
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const child_process = require("child_process");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// 將 rl.question 包裝成 Promise
function askQuestion(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}
function lookYAndN(ans, pyPath) {
    if (ans == "y") {
        try {
            const pyitPath = (0, child_process_1.execSync)("where pyinstaller", { encoding: "utf8" }).split("\n")[0];
            const exePath = pyPath.replace(/\.py$/, ".exe");
            child_process.execSync(`${pyitPath} --onefile --clean --name ${exePath.split("\\")[exePath.split("\\").length - 1]} ${pyPath}`, { stdio: "inherit" });
            return "為你準備exe...";
        }
        catch (error) {
            return `Error! ${error}`;
        }
    }
    else if (ans == "n") {
        return "";
    }
    else {
        return "請輸入y/n";
    }
}
// 改成 async 函式
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputPath = yield askQuestion("please input file path: ");
        try {
            const filePath = path.isAbsolute(inputPath) ? inputPath : path.join(process.cwd(), inputPath);
            const js = fs.readFileSync(filePath, 'utf8');
            const jsArray = js.split(/\r?\n/);
            let python = "";
            for (const jsline of jsArray) {
                const line = jsline;
                const trimmedLine = line.trim();
                // 空行
                if (trimmedLine.length === 0) {
                    python += "\n";
                    continue;
                }
                // 跳過右大括號
                if (trimmedLine === "}") {
                    continue;
                }
                // 複製原始縮排
                const indentMatch = line.match(/^\s*/);
                const indent = indentMatch ? indentMatch[0] : "";
                // 處理變數宣告
                if (trimmedLine.startsWith("const ") || trimmedLine.startsWith("var ") || trimmedLine.startsWith("let ")) {
                    const converted = trimmedLine
                        .replace(/^(const|var|let)\s+/, "")
                        .replace(/;$/, "");
                    python += indent + converted + "\n";
                }
                // 處理 console.log
                else if (trimmedLine.startsWith("console.log")) {
                    const converted = trimmedLine
                        .replace("console.log", "print")
                        .replace(/;$/, "");
                    python += indent + converted + "\n";
                }
                // 處理函式定義
                else if (trimmedLine.startsWith("function ")) {
                    const converted = trimmedLine
                        .replace("function", "def")
                        .replace(/{/g, ":")
                        .replace(/;$/, "");
                    python += indent + converted + "\n";
                }
                // 處理其他行
                else {
                    let converted = trimmedLine
                        .replace(/\btrue\b/g, "True")
                        .replace(/\bfalse\b/g, "False")
                        .replace(/(\w+)\+\+/g, "$1 += 1")
                        .replace(/(\w+)--/g, "$1 -= 1")
                        .replace(/{/g, ":")
                        .replace(/}/g, "")
                        .replace(/;$/, "");
                    python += indent + converted + "\n";
                }
            }
            console.log(python);
            const outputPath = filePath.replace(/\.js$/, ".py");
            fs.writeFileSync(outputPath, python, "utf8");
            console.log(`\n✓ 已儲存到: ${outputPath}`);
            let cond = true;
            while (cond) {
                const message = yield askQuestion("要用pyinstaller編譯成exe嗎 (y/n)");
                const result = lookYAndN(message, outputPath);
                console.log(result);
                if (result !== "請輸入y/n") {
                    cond = false;
                }
            }
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Error:", err.message);
            }
        }
        finally {
            rl.close();
        }
    });
}
// 執行主程式
main();
