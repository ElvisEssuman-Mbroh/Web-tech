document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) {
        console.error('Calendar element not found');
        return;
    }

    window.calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [], // Will be populated by fetchEvents
        eventClick: function(info) {
            showEventDetails(info.event.id);
        },
        eventDidMount: function(info) {
            // Add tooltips to events
            info.el.title = `
                ${info.event.title}
                Location: ${info.event.extendedProps.location}
                Available Seats: ${info.event.extendedProps.availableSeats}
            `;
        },
        displayEventTime: true,
        displayEventEnd: false,
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: true
        }
    });

    window.calendar.render();
    console.log('Calendar initialized');
});
  