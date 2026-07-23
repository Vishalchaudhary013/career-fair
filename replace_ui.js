const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceInFile(filePath) {
  if (!filePath.endsWith('.jsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // We want to replace Event -> Fair and Events -> Fairs ONLY in user-facing text.
  // User-facing text in JSX is typically between > and < or inside quotes for placeholders/labels.
  // We can use a regex that matches text between > and <
  content = content.replace(/>([^<]*?)</g, (match, p1) => {
    let replaced = p1
      .replace(/\bEvents\b/g, 'Fairs')
      .replace(/\bevents\b/g, 'fairs')
      .replace(/\bEvent\b/g, 'Fair')
      .replace(/\bevent\b/g, 'fair');
    return '>' + replaced + '<';
  });

  // Also replace in placeholder="Search events..." etc.
  content = content.replace(/placeholder="([^"]*?)"/g, (match, p1) => {
    let replaced = p1
      .replace(/\bEvents\b/g, 'Fairs')
      .replace(/\bevents\b/g, 'fairs')
      .replace(/\bEvent\b/g, 'Fair')
      .replace(/\bevent\b/g, 'fair');
    return 'placeholder="' + replaced + '"';
  });
  
  // Also replace in title="View Event..."
  content = content.replace(/title="([^"]*?)"/g, (match, p1) => {
    let replaced = p1
      .replace(/\bEvents\b/g, 'Fairs')
      .replace(/\bevents\b/g, 'fairs')
      .replace(/\bEvent\b/g, 'Fair')
      .replace(/\bevent\b/g, 'fair');
    return 'title="' + replaced + '"';
  });

  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated UI text in ${filePath}`);
  }
}

walkDir('./frontend/src/components', replaceInFile);
