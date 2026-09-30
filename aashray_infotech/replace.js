const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}
let count = 0;
walk('src').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if(content.includes('max-w-[95%] 2xl:max-w-[1600px]')) {
    content = content.replace(/max-w-\[95%\] 2xl:max-w-\[1600px\]/g, 'w-full max-w-[1920px]');
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
});
console.log(`Replaced in ${count} files.`);
