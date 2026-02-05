let page = 0;
const perPage = 3;

async function loadNews() {
  const res = await fetch('data/news.json');
  const news = await res.json();

  const slice = news.slice(page * perPage, (page + 1) * perPage);
  const container = document.getElementById('news');

  slice.forEach(item => {
    const div = document.createElement('div');
    div.className = 'news-item';
    div.innerHTML = `
      <h3>${item.title}</h3>
      <small>${item.date}</small>
      <p>${item.text}</p>
      ${item.image ? `<img src="${item.image}" loading="lazy">` : ''}
    `;
    container.appendChild(div);
  });

  page++;
}

document.getElementById('load-more').onclick = loadNews;
loadNews();