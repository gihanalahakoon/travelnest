// support.js — Feedback form validation

document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('feedbackForm');
  const status = document.getElementById('fb-status');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('fb-name').value.trim();
    const email   = document.getElementById('fb-email').value.trim();
    const message = document.getElementById('fb-message').value.trim();

    // Validation
    if (!name) {
      status.textContent = 'Please enter your full name.';
      status.className = 'status-error';
      document.getElementById('fb-name').focus();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'status-error';
      document.getElementById('fb-email').focus();
      return;
    }
    if (message.length < 10) {
      status.textContent = 'Message must be at least 10 characters.';
      status.className = 'status-error';
      document.getElementById('fb-message').focus();
      return;
    }

    // Save to localStorage
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push({ name, email, message, date: new Date().toLocaleString() });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

    status.textContent = 'Thank you, ' + name + '! Your feedback has been received.';
    status.className = 'status-success';
    form.reset();
  });
});
