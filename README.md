# JS2Py - JavaScript to Python Converter

A simple command-line tool that converts JavaScript code to Python.

**Written in TypeScript and packaged with pkg for easy distribution.**

## Features

✅ Variable declarations (`const`, `let`, `var`)  
✅ `console.log` → `print`  
✅ Function definitions (`function` → `def`)  
✅ `true/false` → `True/False`  
✅ `++/--` operators → `+= 1` / `-= 1`  
✅ Preserves indentation (spaces and tabs)  
✅ Braces `{}` → colons `:`  

## Usage

### Using the executable (Windows)

Simply run:
```bash
js2py
```

Or with full path:
```bash
.\js2py
```

Enter the path to your JavaScript file when prompted.
## Example

**Input (test.js):**
```javascript
let test = 5;
console.log(test);
while(test < 9){
    test += 1;
}
console.log(test);
```

**Output (test.py):**
```python
test = 5
print(test)
while(test < 9):
    test += 1
print(test)
```

## Development

This project is written in **TypeScript** and compiled to JavaScript.

### Requirements

- Node.js
- TypeScript

### Building from source

1. Install dependencies:
```bash
npm install
```

2. Compile TypeScript:
```bash
tsc
```

3. Run:
```bash
node compile.js
```

### Packaging to executable

This project uses [pkg](https://github.com/vercel/pkg) to create standalone executables:
```bash
npm install -g pkg
pkg compile.js
```

This will generate `js2py.exe` (Windows), `js2py-linux`, and `js2py-macos`.

## Project Structure
```
js2py/
├── compile.ts       # TypeScript source code
├── compile.js       # Compiled JavaScript (git ignored)
├── js2py.exe        # Packaged executable (git ignored)
├── test.js          # Example JavaScript input
├── test.py          # Example Python output
├── package.json     # Node.js dependencies
└── tsconfig.json    # TypeScript configuration
```

## Author

Created by a 10-year-old developer! 🚀

## License

MIT