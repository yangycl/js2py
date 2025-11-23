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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var readline = require('readline');
var fs = require('fs');
var path = require('path');
var child_process = require("child_process");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// 將 rl.question 包裝成 Promise
function askQuestion(query) {
    return new Promise(function (resolve) {
        rl.question(query, function (answer) {
            resolve(answer);
        });
    });
}
function lookYAndN(ans, pyPath) {
    if (ans == "y") {
        try {
            var pyitPath = (0, child_process_1.execSync)("where pyinstaller", { encoding: "utf8" }).split("\n")[0];
            var exePath = pyPath.replace(/\.py$/, ".exe");
            child_process.execSync("".concat(pyitPath, " --onefile --clean --name ").concat(exePath.split("\\")[exePath.split("\\").length - 1], " ").concat(pyPath), { stdio: "inherit" });
            return "為你準備exe...";
        }
        catch (error) {
            return "Error! ".concat(error);
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
    return __awaiter(this, void 0, void 0, function () {
        var inputPath, filePath, js, jsArray, python, _i, jsArray_1, jsline, line, trimmedLine, indentMatch, indent, converted, converted, linearr, converted, converted, outputPath, cond, message, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, askQuestion("please input file path: ")];
                case 1:
                    inputPath = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, 7, 8]);
                    filePath = path.isAbsolute(inputPath) ? inputPath : path.join(process.cwd(), inputPath);
                    js = fs.readFileSync(filePath, 'utf8');
                    jsArray = js.split(/\r?\n/);
                    python = "";
                    for (_i = 0, jsArray_1 = jsArray; _i < jsArray_1.length; _i++) {
                        jsline = jsArray_1[_i];
                        line = jsline;
                        trimmedLine = line.trim();
                        // 空行
                        if (trimmedLine.length === 0) {
                            python += "\n";
                            continue;
                        }
                        // 跳過右大括號
                        if (trimmedLine === "}") {
                            continue;
                        }
                        indentMatch = line.match(/^\s*/);
                        indent = indentMatch ? indentMatch[0] : "";
                        // 處理變數宣告
                        if (trimmedLine.startsWith("const ") || trimmedLine.startsWith("var ") || trimmedLine.startsWith("let ")) {
                            converted = trimmedLine
                                .replace(/^(const|var|let)\s+/, "")
                                .replace(/;$/, "");
                            python += indent + converted + "\n";
                        }
                        // 處理 console.log
                        else if (trimmedLine.startsWith("console.log")) {
                            converted = trimmedLine
                                .replace("console.log", "print")
                                .replace(/;$/, "");
                            python += indent + converted + "\n";
                        }
                        //處理3元運算
                        else if (line.includes("?") && line.includes(":")) {
                            linearr = line.split(/\?|:/);
                            python += (indent + linearr[1] + " " + "if" + " " + linearr[0] + " " + "else" + " " + linearr[2]);
                        }
                        // 處理函式定義
                        else if (trimmedLine.startsWith("function ")) {
                            converted = trimmedLine
                                .replace("function", "def")
                                .replace(/{/g, ":")
                                .replace(/;$/, "");
                            python += indent + converted + "\n";
                        }
                        // 處理其他行
                        else {
                            converted = trimmedLine
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
                    outputPath = filePath.replace(/\.js$/, ".py");
                    fs.writeFileSync(outputPath, python, "utf8");
                    console.log("\n\u2713 \u5DF2\u5132\u5B58\u5230: ".concat(outputPath));
                    cond = true;
                    _a.label = 3;
                case 3:
                    if (!cond) return [3 /*break*/, 5];
                    return [4 /*yield*/, askQuestion("要用pyinstaller編譯成exe嗎 (y/n)")];
                case 4:
                    message = _a.sent();
                    result = lookYAndN(message, outputPath);
                    console.log(result);
                    if (result !== "請輸入y/n") {
                        cond = false;
                    }
                    return [3 /*break*/, 3];
                case 5: return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error) {
                        console.error("Error:", err_1.message);
                    }
                    return [3 /*break*/, 8];
                case 7:
                    rl.close();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// 執行主程式
main();
