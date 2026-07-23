const fs = require('fs');

const filesToFix = [
  "frontend/src/components/admin-dashboard/EventsSection.jsx",
  "frontend/src/components/pages/SuperAdminDashboard.jsx",
  "frontend/src/components/pages/AdminDashboard.jsx",
  "frontend/src/components/pages/EventCalendarPage.jsx",
  "frontend/src/components/pages/AllEventsPage.jsx"
];

filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content
      .replace(/\[fairs,\s*setEvents\]/g, '[events, setEvents]')
      .replace(/\[fairs\]/g, '[events]')
      .replace(/\[fairs,/g, '[events,')
      .replace(/fairs\s*=\s*fairs/g, 'events = events') // just in case
      .replace(/\bfairs\b/g, 'events'); // Wait, if I replace ALL \bfairs\b with events, will I ruin the UI text?
      
    // Actually, UI text "fairs" is lower case "fairs", like "Search fairs...".
    // I should only replace the specific state variables.
    
    // Instead of replacing all 'fairs', let's be careful.
    content = original
      .replace(/\[fairs,\s*setEvents\]/g, '[events, setEvents]')
      .replace(/\[fairs\]/g, '[events]')
      .replace(/\[fairs,/g, '[events,')
      .replace(/fairs\s*=\s*fairs/g, 'events = events');

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed state vars in ${filePath}`);
    }
  }
});
