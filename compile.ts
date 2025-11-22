import { execSync } from "child_process";

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const child_process = require("child_process");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 將 rl.question 包裝成 Promise
function askQuestion(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, (answer: string) => {
            resolve(answer);
        });
    });
}

function lookYAndN(ans:string, pyPath:string):string{
    if(ans == "y"){
        try {
            const pyitPath = execSync("where pyinstaller",{ encoding : "utf8"}).split("\n")[0];
            const exePath = pyPath.replace(/\.py$/, ".exe");
            child_process.execSync(`${pyitPath} --onefile --clean --name ${exePath.split("\\")[exePath.split("\\").length - 1]} ${pyPath}`, { stdio: "inherit" });
            return "為你準備exe...";
        } catch (error) {
            return `Error! ${error}`
        }
    }else if(ans == "n"){
        return "";
    }else{
        return "請輸入y/n";
    }
}

// 改成 async 函式
async function main() {
    const inputPath = await askQuestion("please input file path: ");
    
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
        
        let cond:boolean = true;
        while(cond){    
            const message = await askQuestion("要用pyinstaller編譯成exe嗎 (y/n)");
            const result = lookYAndN(message, outputPath);
            console.log(result);
            if(result !== "請輸入y/n"){
                cond = false;
            }
        }
    } catch (err: any) {
        if (err instanceof Error) {
            console.error("Error:", err.message);
        }
    } finally {
        rl.close();
    }
}

// 執行主程式
main();