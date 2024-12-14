document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: async function(info, successCallback, failureCallback) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/events', {
                    headers: token ? {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } : {}
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }

                const events = await response.json();
                const calendarEvents = events.map(event => ({
                    id: event._id,
                    title: event.name,
                    start: `${event.date}T${event.time}`,
                    description: event.description,
                    location: event.location,
                    extendedProps: {
                        availableSeats: event.availableSeats
                    }
                }));

                successCallback(calendarEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                failureCallback(error);
            }
        },
        eventClick: function(info) {
            showEventDetails(info.event.id);
        },
        eventDidMount: function(info) {
            info.el.title = `
                ${info.event.title}
                Location: ${info.event.extendedProps.location}
                Available Seats: ${info.event.extendedProps.availableSeats}
            `;
        }
    });

    calendar.render();
});
  