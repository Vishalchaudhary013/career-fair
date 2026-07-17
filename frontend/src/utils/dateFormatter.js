export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (timeString) => {
  if (!timeString) return "";
  // Assuming time string is like "14:30"
  if (timeString.includes(':')) {
    const [hourStr, minuteStr] = timeString.split(':');
    const hour = parseInt(hourStr, 10);
    if (!isNaN(hour)) {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minuteStr} ${ampm}`;
    }
  }
  return timeString;
};
