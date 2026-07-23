const fs = require('fs');

const filesToFix = [
  "frontend/src/components/section/InternshipEvent.jsx",
  "frontend/src/components/section/ApprenticeshipEvent.jsx",
  "frontend/src/components/section/JobEvents.jsx",
  "frontend/src/components/section/UpcomingEvents.jsx",
  "frontend/src/components/admin-dashboard/EventsSection.jsx",
  "frontend/src/components/admin-dashboard/OverviewSection.jsx",
  "frontend/src/components/pages/SuperAdminDashboard.jsx",
  "frontend/src/components/pages/AdminDashboard.jsx",
  "frontend/src/components/pages/EventCalendarPage.jsx",
  "frontend/src/components/pages/Home.jsx"
];

filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // We replace specific patterns in JS code
    content = content
      .replace(/\bfairs\.length\b/g, 'events.length')
      .replace(/\bfairs\.map\b/g, 'events.map')
      .replace(/\bfairs\.filter\b/g, 'events.filter')
      .replace(/\bfairs\.forEach\b/g, 'events.forEach')
      .replace(/\bfairs\.includes\b/g, 'events.includes')
      .replace(/\bselectedDay\.fairs\b/g, 'selectedDay.events')
      .replace(/\(fair\s*=>/g, '(event =>')
      .replace(/\(fair,/g, '(event,')
      .replace(/\bfair\._id\b/g, 'event._id')
      .replace(/\bfair\.fairName\b/g, 'event.fairName')
      .replace(/\bfair\.category\b/g, 'event.category')
      .replace(/\bfair\.fairType\b/g, 'event.fairType')
      .replace(/\bfair\.startDate\b/g, 'event.startDate')
      .replace(/\bfair\.endDate\b/g, 'event.endDate')
      .replace(/\bfair\.basicInfo\b/g, 'event.basicInfo')
      .replace(/\bfair\.venue\b/g, 'event.venue')
      .replace(/setEvents\(fairs/g, 'setEvents(events')
      .replace(/setError\("Failed to load fairs\."\)/g, 'setError("Failed to load events.")')
      .replace(/events\.length === fairs\.length/g, 'events.length === events.length');

    // SuperAdminDashboard / EventsSection specific
    content = content
      .replace(/setEvents\(fairs\.filter/g, 'setEvents(events.filter')
      .replace(/setSelectedSuperEvents\(fairs\.map/g, 'setSelectedSuperEvents(events.map');

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed variables in ${filePath}`);
    }
  }
});
