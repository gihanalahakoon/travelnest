// main.js — TravelNest shared utilities and destination data

// ===== DESTINATION DATA =====
const destinations = [
  {
    id: 1, name: "Dubrovnik", country: "Croatia", continent: "Europe",
    type: "cultural", budgetLevel: "medium",
    img: "assets/images/dubrovnik.jpg",
    desc: "Known as the Pearl of the Adriatic, Dubrovnik is famous for its medieval stone walls, terracotta rooftops, and crystal-clear waters.",
    attractions: ["City Walls Walk", "Old Town (Stari Grad)", "Lokrum Island", "Rector's Palace", "Fort Lovrijenac"],
    cost: "€120/day"
  },
  {
    id: 2, name: "Santorini", country: "Greece", continent: "Europe",
    type: "relaxation", budgetLevel: "high",
    img: "assets/images/santorini.jpg",
    desc: "Santorini is celebrated for its iconic blue-domed churches, whitewashed buildings, and dramatic caldera views over the Aegean Sea.",
    attractions: ["Oia Sunset Viewpoint", "Fira Caldera Walk", "Red Beach", "Akrotiri Archaeological Site", "Perissa Beach"],
    cost: "€180/day"
  },
  {
    id: 3, name: "Tokyo", country: "Japan", continent: "Asia",
    type: "cultural", budgetLevel: "medium",
    img: "assets/images/tokyo.jpg",
    desc: "Tokyo blends the ultra-modern and the traditional, with neon-lit districts sitting alongside ancient Shinto shrines and world-class food culture.",
    attractions: ["Shibuya Crossing", "Senso-ji Temple", "Shinjuku Gyoen", "Tsukiji Outer Market", "Akihabara"],
    cost: "€150/day"
  },
  {
    id: 4, name: "Cape Town", country: "South Africa", continent: "Africa",
    type: "adventure", budgetLevel: "low",
    img: "assets/images/capetown.jpg",
    desc: "Cape Town offers a stunning mix of dramatic landscapes, vibrant culture, and wildlife, framed by the iconic flat-topped Table Mountain.",
    attractions: ["Table Mountain", "Boulders Beach Penguins", "Cape Point", "V&A Waterfront", "Bo-Kaap Neighbourhood"],
    cost: "€90/day"
  },
  {
    id: 5, name: "Banff", country: "Canada", continent: "Americas",
    type: "nature", budgetLevel: "medium",
    img: "assets/images/banff.jpg",
    desc: "Banff National Park is home to emerald-coloured glacial lakes, towering Rocky Mountain peaks, and abundant wildlife in the heart of Canada.",
    attractions: ["Lake Louise", "Moraine Lake", "Icefields Parkway", "Johnston Canyon", "Sulphur Mountain Gondola"],
    cost: "€140/day"
  }
];

// ===== SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ===== SCROLL REVEAL =====
function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 60) {
      el.classList.add('active');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
document.addEventListener('DOMContentLoaded', revealOnScroll);

// ===== REUSABLE: Open Destination Modal =====
function openModal(id) {
  const d = destinations.find(x => x.id === id);
  if (!d) return;
  document.getElementById('modalBody').innerHTML = `
    <span class="badge">${d.continent}</span>
    <h2>${d.name}, ${d.country}</h2>
    <img src="${d.img}" alt="${d.name}">
    <p>${d.desc}</p>
    <h4>Popular Attractions</h4>
    <ul>${d.attractions.map(a => `<li>${a}</li>`).join('')}</ul>
    <h4>Travel Cost Estimate</h4>
    <table>
      <thead><tr><th>Category</th><th>Estimate</th></tr></thead>
      <tbody>
        <tr><td>Daily Budget</td><td>${d.cost}</td></tr>
        <tr><td>Budget Level</td><td style="text-transform:capitalize;">${d.budgetLevel}</td></tr>
      </tbody>
    </table>`;
  const modal = document.getElementById('destModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const m = document.getElementById('destModal');
  if (m) { m.classList.remove('show'); }
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  const m = document.getElementById('destModal');
  if (m && e.target === m) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== REUSABLE: Save to Wishlist =====
function saveToWishlist(id, btn) {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  if (!wishlist.includes(id)) {
    wishlist.push(id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    if (btn) {
      btn.textContent = '✓ Saved to Wishlist';
      btn.style.background = '#16a34a';
    }
  }
}

// ===== REUSABLE: Load Saved Budgets =====
function loadSavedBudgets() {
  const container = document.getElementById('savedPlansContainer');
  if (!container) return;
  const saved = JSON.parse(localStorage.getItem('savedBudgets') || '[]');
  if (saved.length === 0) {
    container.innerHTML = '<p style="color:var(--muted);font-size:.9rem;">No saved budgets yet. Calculate a trip above to save one.</p>';
    return;
  }
  container.innerHTML = saved.map((b, i) => `
    <div class="saved-item">
      <div>
        <strong>${b.dest}</strong> — ${b.days} days @ €${b.daily}/day =
        <span style="color:var(--blue);font-weight:700;">€${b.total.toLocaleString()}</span>
        <span style="color:var(--muted);font-size:.8rem;margin-left:10px;">${b.date}</span>
      </div>
      <button class="btn-delete" onclick="deleteBudget(${i})">Remove</button>
    </div>`).join('');
}

function deleteBudget(index) {
  const saved = JSON.parse(localStorage.getItem('savedBudgets') || '[]');
  saved.splice(index, 1);
  localStorage.setItem('savedBudgets', JSON.stringify(saved));
  loadSavedBudgets();
}

// ===== PAGE LOGIC =====
window.addEventListener('DOMContentLoaded', () => {

  // ---- HOME: Hero background rotation ----
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    const imgs = destinations.map(d => d.img);
    let idx = 0;
    heroBg.style.backgroundImage = `url('${imgs[idx]}')`;
    setInterval(() => {
      idx = (idx + 1) % imgs.length;
      heroBg.style.opacity = '0';
      setTimeout(() => {
        heroBg.style.backgroundImage = `url('${imgs[idx]}')`;
        heroBg.style.opacity = '0.35';
      }, 500);
    }, 6000);
  }

  // ---- HOME: Quote rotation ----
  const qElem = document.getElementById('hero-quote');
  if (qElem) {
    const quotes = [
      '"The world is a book and those who do not travel read only one page."',
      '"To travel is to live." — Hans Christian Andersen',
      '"Adventure is worthwhile in itself." — Amelia Earhart',
      '"Not all those who wander are lost." — J.R.R. Tolkien'
    ];
    let qi = 0;
    setInterval(() => {
      qElem.style.opacity = '0';
      setTimeout(() => {
        qi = (qi + 1) % quotes.length;
        qElem.textContent = quotes[qi];
        qElem.style.opacity = '1';
      }, 400);
    }, 4000);
  }

  // ---- HOME: Destination of the Day ----
  const dailyContainer = document.getElementById('daily-card-container');
  if (dailyContainer) {
    const d = destinations[new Date().getDate() % destinations.length];
    dailyContainer.innerHTML = `
      <div class="daily-card reveal">
        <img src="${d.img}" alt="${d.name}">
        <div class="daily-card-body">
          <span class="badge">${d.continent}</span>
          <h2>${d.name}, ${d.country}</h2>
          <p>${d.desc}</p>
          <a href="explorer.html" class="btn">Browse All Destinations</a>
        </div>
      </div>`;
    revealOnScroll();
  }

  // ---- PLANNER ----
  const bForm = document.getElementById('budgetForm');
  if (bForm) {
    loadSavedBudgets();
    bForm.addEventListener('submit', e => {
      e.preventDefault();
      const dest  = document.getElementById('plan-dest').value.trim();
      const days  = parseInt(document.getElementById('plan-days').value);
      const daily = parseFloat(document.getElementById('plan-daily').value);
      if (!dest || !days || !daily) return;
      const total = days * daily;

      const resultCard = document.getElementById('resultCard');
      resultCard.style.display = 'block';
      document.getElementById('result-total').textContent = '€' + total.toLocaleString();
      setTimeout(() => {
        document.getElementById('budgetBar').style.width = Math.min((total / 3000) * 100, 100) + '%';
      }, 50);

      const s = document.getElementById('budgetStatus');
      if (total < 500)       { s.textContent = 'Low Budget';  s.className = 'budget-status status-low'; }
      else if (total < 1500) { s.textContent = 'Moderate';    s.className = 'budget-status status-mod'; }
      else                   { s.textContent = 'Luxury';      s.className = 'budget-status status-luxury'; }

      const saveBtn = document.getElementById('saveBudgetBtn');
      if (saveBtn) {
        saveBtn.onclick = () => {
          const saved = JSON.parse(localStorage.getItem('savedBudgets') || '[]');
          saved.push({ dest, days, daily, total, date: new Date().toLocaleDateString() });
          localStorage.setItem('savedBudgets', JSON.stringify(saved));
          loadSavedBudgets();
          saveBtn.textContent = '✓ Saved!';
          setTimeout(() => { saveBtn.textContent = 'Save This Budget'; }, 2000);
        };
      }
    });
  }

  // ---- GENERATOR ----
  const sBtn = document.getElementById('surpriseBtn');
  if (sBtn) {
    sBtn.addEventListener('click', () => {
      sBtn.classList.remove('surprise-animate');
      void sBtn.offsetWidth;
      sBtn.classList.add('surprise-animate');

      const type   = document.getElementById('gen-type').value;
      const budget = document.getElementById('gen-budget').value;
      const matches = destinations.filter(d => d.type === type && d.budgetLevel === budget);
      const res = document.getElementById('generatorResult');

      if (matches.length > 0) {
        const d = matches[Math.floor(Math.random() * matches.length)];
        const inList = JSON.parse(localStorage.getItem('wishlist') || '[]').includes(d.id);
        res.innerHTML = `
          <div class="dest-card surprise-animate" style="max-width:440px;margin:0 auto;">
            <img src="${d.img}" alt="${d.name}">
            <div class="dest-card-info">
              <span class="continent-tag">${d.continent}</span>
              <h3>${d.name}, ${d.country}</h3>
              <p>${d.desc}</p>
              <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;">
                <button class="btn" onclick="openModal(${d.id})">View Details</button>
                <button class="btn ${inList ? '' : 'btn-orange'}" onclick="saveToWishlist(${d.id}, this)"
                  style="${inList ? 'background:#16a34a;' : ''}">
                  ${inList ? '✓ In Wishlist' : 'Save to Wishlist'}
                </button>
              </div>
            </div>
          </div>`;
        // Re-attach modal HTML if not present
        if (!document.getElementById('destModal')) {
          const modalHtml = `
            <div id="destModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
              <div class="modal-content">
                <button class="close-modal" onclick="closeModal()" aria-label="Close">&times;</button>
                <div id="modalBody"></div>
              </div>
            </div>`;
          document.body.insertAdjacentHTML('beforeend', modalHtml);
        }
      } else {
        res.innerHTML = `<div class="placeholder-box"><p>No destinations match that combination. Try a different type or budget.</p></div>`;
      }
    });
  }

  // ---- AMBIENT SOUNDS ----
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const audio = document.getElementById(btn.dataset.sound + '-audio');
      if (!audio) return;
      if (audio.paused) {
        document.querySelectorAll('audio').forEach(a => a.pause());
        document.querySelectorAll('.play-btn').forEach(b => {
          b.textContent = '▶ Play Sound';
          b.classList.remove('active');
        });
        audio.play();
        btn.textContent = '⏹ Stop';
        btn.classList.add('active');
      } else {
        audio.pause();
        btn.textContent = '▶ Play Sound';
        btn.classList.remove('active');
      }
    });
  });

  // ---- ACCORDION ----
  document.querySelectorAll('.accordion-header').forEach(h => {
    h.addEventListener('click', () => {
      const item = h.parentElement;
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });

});
