const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("please input file path: ", function(inputPath: string) {
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
            else if (trimmedLine.startsWith("function ")) {  // ✅ 改這裡
                const converted = trimmedLine
                    .replace("function", "def")
                    .replace(/{/g, ":")  // 也要處理大括號
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
        
    } catch (err: any) {
        if (err instanceof Error) {
            console.error("Error:", err.message);
        }
    } finally {
        rl.close();
    }
});