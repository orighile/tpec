
export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
}

export const addToCalendar = (event: CalendarEvent) => {
  const { title, description, location, startDate, endDate } = event;
  
  // Format dates for different calendar systems
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  // Detect the user's platform
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isIOS = /ipad|iphone|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);

  if (isMobile) {
    if (isIOS) {
      // iOS Calendar
      const iosUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
      
      window.open(encodeURI(iosUrl));
    } else if (isAndroid) {
      // Android Calendar
      const androidUrl = `content://com.android.calendar/time/${startDate.getTime()}`;
      window.location.href = androidUrl;
      
      // Fallback to Google Calendar web
      setTimeout(() => {
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
        window.open(googleUrl, '_blank');
      }, 1000);
    }
  } else {
    // Desktop - Google Calendar (most universal)
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    window.open(googleUrl, '_blank');
  }
};

export const parseEventDateTime = (dateString: string, timeString: string): Date => {
  // Parse the date string (e.g., "Oct 15, 2023")
  const eventDate = new Date(dateString);
  
  // Parse the time string (e.g., "09:00 AM - 05:00 PM")
  const timeRange = timeString.split(' - ');
  const startTimeStr = timeRange[0];
  
  // Parse start time
  const timeParts = startTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (timeParts) {
    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const isPM = timeParts[3].toUpperCase() === 'PM';
    
    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }
    
    eventDate.setHours(hours, minutes, 0, 0);
  }
  
  return eventDate;
};

export const parseEndDateTime = (dateString: string, timeString: string): Date => {
  const eventDate = new Date(dateString);
  
  // Parse the time string (e.g., "09:00 AM - 05:00 PM")
  const timeRange = timeString.split(' - ');
  const endTimeStr = timeRange[1] || timeRange[0]; // Use start time if no end time
  
  // Parse end time
  const timeParts = endTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (timeParts) {
    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const isPM = timeParts[3].toUpperCase() === 'PM';
    
    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }
    
    eventDate.setHours(hours, minutes, 0, 0);
  }
  
  return eventDate;
};
