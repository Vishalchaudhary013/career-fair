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

  // Patterns that strictly identify JavaScript variables (not plain text)
  content = content
    .replace(/\bfairs\./g, 'events.')
    .replace(/\bfair\./g, 'event.')
    .replace(/\bfairs\?\./g, 'events?.')
    .replace(/\bfair\?\./g, 'event?.')
    .replace(/\bfair\s*===/g, 'event ===')
    .replace(/\bfair\s*!==/g, 'event !==')
    .replace(/\bfairs\s*===/g, 'events ===')
    .replace(/\bfairs\s*!==/g, 'events !==')
    .replace(/\(fair\)/g, '(event)')
    .replace(/\(fairs\)/g, '(events)')
    .replace(/\(fair,/g, '(event,')
    .replace(/\(fairs,/g, '(events,')
    .replace(/\bfair\s*=>/g, 'event =>')
    .replace(/\bfairs\s*=>/g, 'events =>')
    .replace(/!fair\b/g, '!event')
    .replace(/!fairs\b/g, '!events')
    .replace(/\[fairs,/g, '[events,')
    .replace(/,\s*fairs\]/g, ', events]')
    .replace(/\[fairs\]/g, '[events]')
    .replace(/\{fairs,/g, '{events,')
    .replace(/,\s*fairs\}/g, ', events}')
    .replace(/\{fairs\}/g, '{events}')
    .replace(/\{fair,/g, '{event,')
    .replace(/,\s*fair\}/g, ', event}')
    .replace(/\{fair\}/g, '{event}')
    .replace(/\s+fair\s*=\s*/g, ' event = ')
    .replace(/\s+fairs\s*=\s*/g, ' events = ')
    .replace(/setEvents\(\s*fairs\s*\)/g, 'setEvents(events)')
    .replace(/setFairs\(\s*fairs\s*\)/g, 'setEvents(events)') // just in case
    .replace(/fairs\.length/g, 'events.length')
    .replace(/fairs\.map/g, 'events.map')
    .replace(/fairs\.filter/g, 'events.filter')
    .replace(/\bfairs\b/g, (match, offset, string) => {
        // If it's a UI string like "Search fairs...", leave it alone.
        // If it's preceded by a bracket or space and followed by space, maybe it's a variable.
        return match; 
    });

    // Handle "if (!fair)" specifically
    content = content.replace(/if\s*\(\s*!fair\s*\)/g, 'if (!event)');

    // For EventFairsCard specifically, we know the parameter is "event" but the body uses "fair".
    // Wait, the easiest way is to let the regexes above catch fair.fairBanner, fair.venue, etc.

  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned up variables in ${filePath}`);
  }
}

walkDir('./frontend/src/components', replaceInFile);
