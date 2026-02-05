let searchIndex = null;

/* ===============================
   Load SMALL search index only
   =============================== */
async function loadIndex() {
  if (searchIndex) return searchIndex;

  const res = await fetch('data/search-index.json', {
    cache: 'force-cache'
  });

  searchIndex = await res.json();
  return searchIndex;
}

/* ===============================
   Utility: debounce
   =============================== */
function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

/* ===============================
   Render results
   =============================== */
function renderResults(results) {
  const container = document.getElementById("search-results");
  if (!container) return;

  container.innerHTML = "";

  if (!results.length) {
    container.classList.remove("visible");
    return;
  }

  results.forEach(r => {
    const a = document.createElement("a");
    a.href = r.url;
    a.className = "search-result";

    a.innerHTML = `
  <div class="search-result-text">
    <strong>${r.title}</strong>
    <small>${r.snippet}</small>
  </div>
`;


    container.appendChild(a);
  });

  container.classList.add("visible");
}

/* ===============================
   Run search
   =============================== */
async function runSearch(query) {
  const container = document.getElementById("search-results");
  if (!container) return;

  query = query.trim().toLowerCase();
  if (!query) {
    container.classList.remove("visible");
    return;
  }

  const index = await loadIndex();

  const results = index
    .filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.tags?.some(tag => tag.toLowerCase().includes(query))
    )
    .slice(0, 5); // HARD LIMIT = eco friendly

  renderResults(results);
}

/* ===============================
   Init
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search");
  if (!input) return;

  const handler = debounce(runSearch, 250);
  input.addEventListener("input", e => handler(e.target.value));
});

/* ===============================
   Close results when clicking away
   =============================== */
document.addEventListener("click", e => {
  const results = document.getElementById("search-results");
  if (!results) return;

  if (!e.target.closest(".search-form")) {
    results.classList.remove("visible");
  }
});
