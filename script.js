/* =========================================
   JustGym — script.js
   ========================================= */

// ---- NAV TOGGLE ----
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// ---- TABS (classes page) ----
const dayTabs = document.getElementById('dayTabs');
if (dayTabs) {
  dayTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      dayTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(btn.dataset.day);
      if (panel) panel.classList.add('active');
    });
  });
}

// ---- SIGNUP / LOGIN TABS ----
const tabSignup    = document.getElementById('tabSignup');
const tabLogin     = document.getElementById('tabLogin');
const signupPanel  = document.getElementById('signupPanel');
const loginPanel   = document.getElementById('loginPanel');
const switchToLogin   = document.getElementById('switchToLogin');
const switchToSignup  = document.getElementById('switchToSignup');

function showSignup() {
  if (!tabSignup) return;
  tabSignup.classList.add('active');
  tabLogin.classList.remove('active');
  signupPanel.style.display = 'block';
  loginPanel.style.display  = 'none';
}
function showLogin() {
  if (!tabLogin) return;
  tabLogin.classList.add('active');
  tabSignup.classList.remove('active');
  loginPanel.style.display  = 'block';
  signupPanel.style.display = 'none';
}
if (tabSignup)     tabSignup.addEventListener('click', showSignup);
if (tabLogin)      tabLogin.addEventListener('click',  showLogin);
if (switchToLogin)   switchToLogin.addEventListener('click',   e => { e.preventDefault(); showLogin(); });
if (switchToSignup)  switchToSignup.addEventListener('click',  e => { e.preventDefault(); showSignup(); });

// Handle ?plan= param on signup page
const params = new URLSearchParams(window.location.search);
const planParam = params.get('plan');
if (planParam) {
  document.querySelectorAll('.plan-pill').forEach(pill => {
    pill.classList.toggle('selected', pill.dataset.plan === planParam);
  });
}

// Plan pill selection
document.querySelectorAll('.plan-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.plan-pill').forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');
  });
});

// ---- SIGNUP FORM ----
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const pw  = document.getElementById('sPassword').value;
    const pw2 = document.getElementById('sPasswordConfirm').value;
    const err = document.getElementById('signupError');

    if (pw !== pw2) {
      err.textContent = 'Passwords do not match.';
      err.style.display = 'block';
      return;
    }
    if (pw.length < 8) {
      err.textContent = 'Password must be at least 8 characters.';
      err.style.display = 'block';
      return;
    }
    err.style.display = 'none';

    const member = {
      firstName: document.getElementById('sFirstName').value,
      lastName:  document.getElementById('sLastName').value,
      email:     document.getElementById('sEmail').value,
      plan:      document.querySelector('.plan-pill.selected')?.dataset.plan || 'starter',
      joinedAt:  new Date().toISOString(),
    };
    localStorage.setItem('jg_member', JSON.stringify(member));

    signupForm.style.display = 'none';
    document.getElementById('signupSuccess').style.display = 'block';
  });
}

// ---- LOGIN FORM ----
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('lEmail').value;
    const stored = JSON.parse(localStorage.getItem('jg_member') || '{}');
    const err = document.getElementById('loginError');

    if (stored.email && stored.email === email) {
      loginForm.style.display = 'none';
      document.getElementById('loginSuccess').style.display = 'block';
    } else {
      err.textContent = 'No account found. Please sign up first.';
      err.style.display = 'block';
    }
  });
}

// ---- CONTACT FORM ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    contactForm.style.display = 'none';
    document.getElementById('contactSuccess').style.display = 'block';
  });
}

// =========================================
// BOOKING FLOW
// =========================================
const classes = [
  { name: 'Morning HIIT Blast',    coach: 'Coach Sarah Mitchell', tag: 'HIIT',     times: ['06:00', '07:30'] },
  { name: 'Vinyasa Flow Yoga',     coach: 'Coach Priya Sharma',   tag: 'Yoga',     times: ['09:30', '18:00'] },
  { name: 'Power Strength Circuit',coach: 'Coach Dan Torres',     tag: 'Strength', times: ['12:00', '17:00'] },
  { name: 'Rhythm Spin',           coach: 'Coach James Park',     tag: 'Spin',     times: ['05:30', '07:00', '19:00'] },
  { name: 'Core & Pilates',        coach: 'Coach Leila Hassan',   tag: 'Pilates',  times: ['10:00', '19:00'] },
  { name: 'Cardio Kickboxing',     coach: 'Coach Marcus Webb',    tag: 'Cardio',   times: ['07:00', '18:30'] },
];

const tagClassMap = {
  HIIT: 'tag-hiit', Yoga: 'tag-yoga', Strength: 'tag-strength',
  Spin: 'tag-spin', Pilates: 'tag-pilates', Cardio: 'tag-cardio',
};

let bookingState = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  selectedDate: null,
  selectedClass: null,
  selectedTime: null,
};

// Calendar
function buildCalendar() {
  const grid = document.getElementById('calendarGrid');
  if (!grid) return;

  const headers = grid.querySelectorAll('.cal-header');
  grid.innerHTML = '';
  headers.forEach(h => grid.appendChild(h.cloneNode(true)));

  const { year, month } = bookingState;
  const label = document.getElementById('calMonthLabel');
  label.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Day-of-week for 1st (Monday-based)
  let firstDay = new Date(year, month, 1).getDay();
  firstDay = (firstDay + 6) % 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day cal-empty';
    grid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day';
    cell.textContent = d;

    const date = new Date(year, month, d);
    if (date < today) {
      cell.classList.add('cal-past');
    } else if (date.getTime() === today.getTime()) {
      cell.classList.add('cal-today');
    }

    if (
      bookingState.selectedDate &&
      bookingState.selectedDate.getDate()  === d &&
      bookingState.selectedDate.getMonth() === month &&
      bookingState.selectedDate.getFullYear() === year
    ) {
      cell.classList.add('cal-selected');
    }

    if (!cell.classList.contains('cal-past')) {
      cell.addEventListener('click', () => {
        bookingState.selectedDate = new Date(year, month, d);
        buildCalendar();
        document.getElementById('toStep2').disabled = false;
      });
    }

    grid.appendChild(cell);
  }
}

document.getElementById('prevMonth')?.addEventListener('click', () => {
  const now = new Date();
  if (bookingState.year === now.getFullYear() && bookingState.month === now.getMonth()) return;
  bookingState.month--;
  if (bookingState.month < 0) { bookingState.month = 11; bookingState.year--; }
  buildCalendar();
});

document.getElementById('nextMonth')?.addEventListener('click', () => {
  bookingState.month++;
  if (bookingState.month > 11) { bookingState.month = 0; bookingState.year++; }
  buildCalendar();
});

if (document.getElementById('calendarGrid')) buildCalendar();

// Step navigation helpers
function showPanel(step) {
  ['panelStep1','panelStep2','panelStep3','panelStep4'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.style.display = i + 1 === step ? 'block' : 'none';
  });
  for (let i = 1; i <= 4; i++) {
    const s = document.getElementById('step' + i);
    const l = document.getElementById('line' + i);
    if (!s) continue;
    s.classList.remove('active', 'done');
    if (i < step) s.classList.add('done');
    if (i === step) s.classList.add('active');
    if (l) l.classList.toggle('done', i < step);
  }
}

// Step 1 → 2
document.getElementById('toStep2')?.addEventListener('click', () => {
  const d = bookingState.selectedDate;
  document.getElementById('selectedDateLabel').textContent =
    d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const list = document.getElementById('classListBooking');
  list.innerHTML = '';
  const shuffled = [...classes].sort(() => Math.random() - 0.5).slice(0, 5);
  shuffled.forEach(cls => {
    cls.times.forEach(time => {
      const spots = Math.floor(Math.random() * 14) + 1;
      const div = document.createElement('div');
      div.className = 'class-card';
      div.style.cursor = 'pointer';
      div.innerHTML = `
        <div class="class-time">${time}<small>${parseInt(time) < 12 ? 'AM' : 'PM'}</small></div>
        <div class="class-info">
          <div class="class-name">${cls.name}</div>
          <div class="class-trainer">${cls.coach}</div>
        </div>
        <span class="class-tag ${tagClassMap[cls.tag]}">${cls.tag}</span>
        <div class="class-spots"><div class="spots-num">${spots}</div><div class="spots-label">spots</div></div>
      `;
      div.addEventListener('click', () => {
        list.querySelectorAll('.class-card').forEach(c => c.style.borderColor = '');
        div.style.borderColor = 'var(--gold)';
        bookingState.selectedClass = cls;
        bookingState.selectedTime  = time;
        document.getElementById('toStep3').disabled = false;
      });
      list.appendChild(div);
    });
  });

  bookingState.selectedClass = null;
  bookingState.selectedTime  = null;
  document.getElementById('toStep3').disabled = true;
  showPanel(2);
});

document.getElementById('backToStep1')?.addEventListener('click', () => showPanel(1));

// Step 2 → 3
document.getElementById('toStep3')?.addEventListener('click', () => showPanel(3));
document.getElementById('backToStep2')?.addEventListener('click', () => showPanel(2));

// Step 3 → 4
document.getElementById('toStep4')?.addEventListener('click', () => {
  const fn = document.getElementById('bFirstName').value.trim();
  const ln = document.getElementById('bLastName').value.trim();
  const em = document.getElementById('bEmail').value.trim();
  if (!fn || !ln || !em) { alert('Please fill in all required fields.'); return; }

  const d = bookingState.selectedDate;
  document.getElementById('confirmDate').textContent  =
    d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  document.getElementById('confirmClass').textContent = bookingState.selectedClass.name;
  document.getElementById('confirmTime').textContent  = bookingState.selectedTime;
  document.getElementById('confirmCoach').textContent = bookingState.selectedClass.coach;
  document.getElementById('confirmName').textContent  = `${fn} ${ln}`;
  document.getElementById('confirmEmail').textContent = em;

  showPanel(4);
});

document.getElementById('backToStep3')?.addEventListener('click', () => showPanel(3));

// Confirm booking
document.getElementById('confirmBooking')?.addEventListener('click', () => {
  const terms = document.getElementById('confirmTerms');
  if (!terms.checked) { alert('Please confirm the terms to complete your booking.'); return; }

  const booking = {
    date:    bookingState.selectedDate.toISOString(),
    class:   bookingState.selectedClass.name,
    time:    bookingState.selectedTime,
    coach:   bookingState.selectedClass.coach,
    name:    document.getElementById('confirmName').textContent,
    email:   document.getElementById('confirmEmail').textContent,
    bookedAt: new Date().toISOString(),
  };

  const existing = JSON.parse(localStorage.getItem('jg_bookings') || '[]');
  existing.push(booking);
  localStorage.setItem('jg_bookings', JSON.stringify(existing));

  document.getElementById('panelStep4').style.display = 'none';
  const success = document.getElementById('bookingSuccess');
  success.style.display = 'block';
  success.scrollIntoView({ behavior: 'smooth' });

  // Reset steps to done
  for (let i = 1; i <= 4; i++) {
    const s = document.getElementById('step' + i);
    if (s) { s.classList.remove('active'); s.classList.add('done'); }
    const l = document.getElementById('line' + i);
    if (l) l.classList.add('done');
  }
});
