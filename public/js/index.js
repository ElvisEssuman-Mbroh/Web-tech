document.addEventListener('DOMContentLoaded', async () => {
    const eventsDiv = document.getElementById('events');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const forYouBtn = document.getElementById('forYouBtn');
    const allEventsBtn = document.getElementById('allEventsBtn');
    const myEventsBtn = document.getElementById('myEventsBtn');
  
    let currentTab = 'for-you'; // Track the current tab
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = './login.html';
      return;
    }
  
    // Fetch user profile to get RSVP'ed events and display welcome message
    let rsvpedEvents = [];
    try {
      const res = await fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.ok) {
        const user = await res.json();
        rsvpedEvents = user.rsvpedEvents; // Array of event IDs the user has RSVPed to
        welcomeMessage.textContent = `Welcome, ${user.name}`;
        welcomeMessage.classList.remove('hidden');
      } else {
        localStorage.removeItem('token');
        window.location.href = './login.html';
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
      window.location.href = './login.html';
    }
  
    // Fetch and display events
    async function fetchEvents(type = 'all') {
      currentTab = type; // Update current tab
      try {
        let endpoint;
        if (type === 'for-you') endpoint = '/api/events/for-you';
        else if (type === 'my-events') endpoint = '/api/events/my-events';
        else endpoint = '/api/events';
  
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const events = await res.json();
        if (res.ok) {
          renderEvents(events, rsvpedEvents, type);
        } else {
          eventsDiv.innerHTML = `<p class="text-red-500">Failed to fetch events. Please try again.</p>`;
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        eventsDiv.innerHTML = `<p class="text-red-500">An error occurred while fetching events. Please try again.</p>`;
      }
    }
  
    // Render event cards
    function renderEvents(events, rsvpedEvents = [], type = 'all') {
      eventsDiv.innerHTML = ''; // Clear previous events
  
      if (events.length === 0) {
        eventsDiv.innerHTML = '<p class="text-gray-500">No events available.</p>';
        return;
      }
  
      events.forEach((event) => {
        const isRSVPed = rsvpedEvents.includes(event._id);
        const card = document.createElement('div');
        card.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'mb-4');
  
        card.innerHTML = `
          <h2 class="text-lg font-bold ${isRSVPed ? 'text-gray-500' : ''}">${event.name}</h2>
          <p>${event.description}</p>
          <p class="text-sm text-gray-500">${new Date(event.date).toLocaleDateString()} | ${event.time}</p>
          <p class="text-sm">Location: ${event.location}</p>
          <p class="text-sm">Available Seats: ${event.availableSeats}</p>
          <button 
            class="mt-2 px-4 py-2 ${
              type === 'my-events'
                ? 'bg-red-500 text-white rounded-lg hover:bg-red-600'
                : isRSVPed
                ? 'bg-red-500 text-white rounded-lg hover:bg-red-600'
                : event.availableSeats <= 0
                ? 'bg-gray-400 text-white rounded-lg cursor-not-allowed'
                : 'bg-blue-500 text-white rounded-lg hover:bg-blue-600'
            }" 
            ${
              type === 'my-events' || isRSVPed
                ? `onclick="removeRsvp('${event._id}')"`
                : event.availableSeats <= 0
                ? 'disabled'
                : `onclick="rsvp('${event._id}')"`
            }>
            ${type === 'my-events' || isRSVPed ? 'Remove RSVP' : event.availableSeats <= 0 ? 'Full' : 'RSVP'}
          </button>
        `;
        eventsDiv.appendChild(card);
      });
    }
  
    // RSVP to an event
    window.rsvp = async function (eventId) {
      try {
        const res = await fetch(`/api/events/rsvp/${eventId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (res.ok) {
          // Fetch updated RSVP'ed events and refresh the current tab
          const userRes = await fetch('/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.ok) {
            const user = await userRes.json();
            rsvpedEvents = user.rsvpedEvents; // Update RSVP'ed events list
          }
          fetchEvents(currentTab); // Refresh the current tab's events
        } else {
          const data = await res.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Error during RSVP:', error);
        alert('An error occurred while RSVPing. Please try again.');
      }
    };
  
    // Remove RSVP from an event
    window.removeRsvp = async function (eventId) {
      try {
        const res = await fetch(`/api/events/remove-rsvp/${eventId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (res.ok) {
          // Fetch updated RSVP'ed events and refresh the current tab
          const userRes = await fetch('/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.ok) {
            const user = await userRes.json();
            rsvpedEvents = user.rsvpedEvents; // Update RSVP'ed events list
          }
          fetchEvents(currentTab); // Refresh the current tab's events
        } else {
          const data = await res.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Error removing RSVP:', error);
        alert('An error occurred while removing RSVP. Please try again.');
      }
    };
  
    // Handle tab switching
    function handleTabSwitch(activeTab, inactiveTabs) {
      activeTab.classList.add('bg-blue-500', 'text-white');
      activeTab.classList.remove('bg-gray-200', 'text-black');
      inactiveTabs.forEach((tab) => {
        tab.classList.add('bg-gray-200', 'text-black');
        tab.classList.remove('bg-blue-500', 'text-white');
      });
    }
  
    forYouBtn.addEventListener('click', () => {
      fetchEvents('for-you');
      handleTabSwitch(forYouBtn, [allEventsBtn, myEventsBtn]);
    });
  
    allEventsBtn.addEventListener('click', () => {
      fetchEvents('all');
      handleTabSwitch(allEventsBtn, [forYouBtn, myEventsBtn]);
    });
  
    myEventsBtn.addEventListener('click', () => {
      fetchEvents('my-events');
      handleTabSwitch(myEventsBtn, [forYouBtn, allEventsBtn]);
    });
  
    // Default: Fetch "For You" events
    fetchEvents('for-you');
  });
  