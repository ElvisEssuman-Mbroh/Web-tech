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
        }
    });

    window.calendar.render();
    console.log('Calendar initialized');
});
  