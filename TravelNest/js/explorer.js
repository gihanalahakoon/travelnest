// explorer.js — Destination Explorer page logic

function renderCards(list) {
  const grid = document.getElementById('destinationsGrid');
  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;">No destinations found. Try a different search.</p>';
    return;
  }
  grid.innerHTML = list.map(d => `
    <div class="dest-card" onclick="openModal(${d.id})" role="button" tabindex="0" aria-label="View details for ${d.name}">
      <img src="${d.img}" alt="${d.name}">
      <div class="dest-card-info">
        <span class="continent-tag">${d.continent}</span>
        <h3>${d.name}</h3>
        <p>${d.country}</p>
      </div>
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderCards(destinations);

  const search = document.getElementById('searchInput');
  const filter = document.getElementById('continentFilter');

  function applyFilters() {
    const q = search.value.toLowerCase().trim();
    const c = filter.value;
    const result = destinations.filter(d => {
      const matchName = d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
      const matchContinent = c === 'all' || d.continent === c;
      return matchName && matchContinent;
    });
    renderCards(result);
  }

  search.addEventListener('input', applyFilters);
  filter.addEventListener('change', applyFilters);
});
