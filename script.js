const calendarEl = document.getElementById('booking-calendar');
const checkinEl = document.getElementById('checkin-date');
const checkoutEl = document.getElementById('checkout-date');
const totalNightsEl = document.getElementById('total-nights');
const totalPriceEl = document.getElementById('total-price');

let selectedStart = null;
let selectedEnd = null;

// This would come from backend later
let unavailableDates = [];
const DEFAULT_NIGHTLY_RATE = 150;

function generateCalendar(monthOffset = 0) {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const last = new Date(today.getFullYear(), today.getMonth() + monthOffset + 1, 0);

  const calendar = document.createElement('div');
  calendar.className = 'calendar-month';

  // Month heading
  const heading = document.createElement('h3');
  heading.textContent = first.toLocaleString('default', { month: 'long', year: 'numeric' });
  heading.style.gridColumn = 'span 7';
  heading.style.textAlign = 'center';
  heading.style.margin = '10px 0';
  calendar.appendChild(heading);

  // Weekday headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdays.forEach(weekday => {
    const wd = document.createElement('div');
    wd.textContent = weekday;
    wd.style.fontWeight = 'bold';
    wd.style.textAlign = 'center';
    calendar.appendChild(wd);
  });

  // Pad first day to correct weekday
  const padStart = first.getDay();
  for (let i = 0; i < padStart; i++) {
    const pad = document.createElement('div');
    calendar.appendChild(pad);
  }

  // Days of the month
  for (let day = 1; day <= last.getDate(); day++) {
    const date = new Date(first.getFullYear(), first.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];

    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    dayEl.textContent = day;
    dayEl.dataset.date = dateStr;

    if (unavailableDates.includes(dateStr)) {
      dayEl.classList.add('unavailable');
    } else {
      dayEl.classList.add('available');
      dayEl.addEventListener('click', () => handleDateClick(date));
    }

    // Always show default price
    const priceEl = document.createElement('div');
    priceEl.textContent = `$${DEFAULT_NIGHTLY_RATE}`;
    priceEl.style.fontSize = '0.7em';
    priceEl.style.marginTop = '4px';
    dayEl.appendChild(priceEl);

    calendar.appendChild(dayEl);
  }

  calendarEl.appendChild(calendar);
}

function handleDateClick(date) {
  if (!selectedStart || (selectedStart && selectedEnd)) {
    selectedStart = date;
    selectedEnd = null;
  } else if (date > selectedStart) {
    selectedEnd = date;
  } else {
    selectedStart = date;
    selectedEnd = null;
  }

  updateSelectionDisplay();
}

function updateSelectionDisplay() {
  checkinEl.textContent = selectedStart ? selectedStart.toDateString() : '–';
  checkoutEl.textContent = selectedEnd ? selectedEnd.toDateString() : '–';

  const allDays = document.querySelectorAll('.calendar-day');
  allDays.forEach(day => {
    day.classList.remove('selected-start', 'selected-end', 'in-range');
  });

  let totalPrice = 0;

  if (selectedStart) {
    const startStr = selectedStart.toISOString().split('T')[0];
    document.querySelectorAll(`.calendar-day`).forEach(day => {
      if (day.dataset.date === startStr) {
        day.classList.add('selected-start');
      }
    });
  }

  if (selectedStart && selectedEnd) {
    const startTime = selectedStart.getTime();
    const endTime = selectedEnd.getTime();
    const oneDay = 1000 * 60 * 60 * 24;

    allDays.forEach(day => {
      const dateStr = day.dataset.date;
      const date = new Date(dateStr);
      const time = date.getTime();

      if (time === startTime) day.classList.add('selected-start');
      else if (time === endTime) day.classList.add('selected-end');
      else if (time > startTime && time < endTime) day.classList.add('in-range');

      // Add default nightly rate for each selected night
      if (time >= startTime && time < endTime) {
        totalPrice += DEFAULT_NIGHTLY_RATE;
      }
    });

    const diff = (selectedEnd - selectedStart) / oneDay;
    totalNightsEl.textContent = diff;
    totalPriceEl.textContent = totalPrice.toFixed(2);
  } else {
    totalNightsEl.textContent = '0';
    totalPriceEl.textContent = '0';
  }
  // Show modal if valid range selected
if (selectedStart && selectedEnd) {
    modalCheckin.textContent = selectedStart.toDateString();
    modalCheckout.textContent = selectedEnd.toDateString();
    modalNights.textContent = totalNightsEl.textContent;
    modalRate.textContent = DEFAULT_NIGHTLY_RATE.toFixed(2);
    modalTotal.textContent = totalPriceEl.textContent;
    modal.classList.remove('hidden');
  }
  
}

// Render 12 months
calendarEl.innerHTML = '';
for (let i = 0; i < 12; i++) {
  generateCalendar(i);
}

// modal
const modal = document.getElementById('booking-summary-modal');
const modalCheckin = document.getElementById('modal-checkin');
const modalCheckout = document.getElementById('modal-checkout');
const modalNights = document.getElementById('modal-nights');
const modalRate = document.getElementById('modal-rate');
const modalTotal = document.getElementById('modal-total');
const closeModalBtn = document.getElementById('close-modal');
const confirmBtn = document.getElementById('confirm-booking');

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

confirmBtn.addEventListener('click', () => {
  alert('Booking submitted!');
  modal.classList.add('hidden');
});
