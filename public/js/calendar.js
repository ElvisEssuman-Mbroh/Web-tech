document.addEventListener('DOMContentLoaded', function() {
    // Debug logging
    console.log('DOM Content Loaded');
    console.log('FullCalendar available:', typeof FullCalendar !== 'undefined');
    
    const calendarEl = document.getElementById('calendar');
    console.log('Calendar element found:', calendarEl);
    
    if (!FullCalendar) {
        console.error('FullCalendar is not loaded!');
        return;
    }

    try {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth'
            },
            height: 800,
            events: async function(info, successCallback, failureCallback) {
                try {
                    const token = localStorage.getItem('token');
                    console.log('Fetching events with token:', !!token);
                    
                    const response = await fetch('http://localhost:5001/api/events', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    const events = await response.json();
                    console.log('Events fetched:', events);
                    
                    const calendarEvents = events.map(event => ({
                        id: event._id,
                        title: event.name,
                        start: event.date,
                        allDay: true
                    }));
                    
                    successCallback(calendarEvents);
                } catch (error) {
                    console.error('Error fetching events:', error);
                    failureCallback(error);
                }
            }
        });

        console.log('Calendar initialized');
        calendar.render();
        console.log('Calendar rendered');
    } catch (error) {
        console.error('Error creating calendar:', error);
    }
});
  