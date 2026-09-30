const fs = require('fs');
const path = 'src/content/home.ts';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/attribution: ".*Aashray Infotech Private Limited"/g, 'attribution: "- Aashray Infotech Private Limited"');
fs.writeFileSync(path, content, 'utf8');
