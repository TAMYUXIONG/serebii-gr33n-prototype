async function loadLayoutData() {
  const res = await fetch('../data/index.json', { cache: 'no-cache' });
  return res.json();
}

async function loadNewsData() {
  const res = await fetch('../data/news.json', { cache: 'no-cache' });
  return res.json();
}

/* LEFT SIDEBAR */
function renderSidebar(data) {
  const sidebar = document.getElementById('sidebar');

  sidebar.innerHTML = '';

  data.navigation.sidebar.forEach(section => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'sidebar-section';

    const title = document.createElement('h3');
    title.textContent = section.category;

    const list = document.createElement('ul');

    section.items.forEach(item => {
      const li = document.createElement('li');
      const link = document.createElement('a');

      /* Route Masters EX correctly */
      if (item === "Pokémon Masters EX") {
        link.href = "../masters-ex.html";
      } else {
        link.href = "#";
      }

      link.textContent = item;
      li.appendChild(link);
      list.appendChild(li);
    });

    sectionDiv.appendChild(title);
    sectionDiv.appendChild(list);
    sidebar.appendChild(sectionDiv);
  });
}


/* RIGHT SIDEBAR */
function renderRightbar(data) {
  const rightbar = document.getElementById('rightbar');
  if (!rightbar || !data.rightSidebar) return;

  rightbar.innerHTML = "";
  const rs = data.rightSidebar;

  const section = title => {
    const h = document.createElement('h3');
    h.textContent = title;
    rightbar.appendChild(h);
  };

  const imageBlock = (src, alt) => {
    if (!src) return;
    const img = document.createElement('img');
    // Prepend ../ to image paths for subdirectory pages
    img.src = src.startsWith('../') ? src : '../' + src;
    img.alt = alt || "";
    img.loading = "lazy";
    rightbar.appendChild(img);
  };

  /* Pokémon of the Week */
  if (rs.pokemonOfTheWeek) {
    section(rs.pokemonOfTheWeek.title);
    imageBlock(rs.pokemonOfTheWeek.image, "Pokémon of the Week");
  }

  /* Next in Japan */
  if (rs.nextInJapan) {
    section(rs.nextInJapan.title);
    rs.nextInJapan.items?.forEach(item => {
      imageBlock(item.image, item.title);
      rightbar.appendChild(document.createTextNode(item.title));
    });
  }

  /* Recently in USA */
  if (rs.recentlyUSA) {
    section(rs.recentlyUSA.title);
    rs.recentlyUSA.items?.forEach(item => {
      imageBlock(item.image, item.title);
      rightbar.appendChild(document.createTextNode(item.title));
    });
  }

  /* Next in USA (optional) */
  if (rs.nextUSA) {
    section(rs.nextUSA.title);
    rs.nextUSA.items?.forEach(item => {
      imageBlock(item.image, item.title);
      rightbar.appendChild(document.createTextNode(item.title));
    });
  }

  /* Social Media */
  if (rs.socialMedia?.length) {
    section("Social Media");
    const social = document.createElement('div');
    social.className = "social-icons";

    rs.socialMedia.forEach(icon => {
      const a = document.createElement('a');
      a.href = icon.link || "#";

      const img = document.createElement('img');
      img.src = icon.icon.startsWith('../') ? icon.icon : '../' + icon.icon;
      img.alt = icon.name;
      img.loading = "lazy";

      a.appendChild(img);
      social.appendChild(a);
    });

    rightbar.appendChild(social);
  }

  /* Support Us */
  if (rs.supportUs) {
    section(rs.supportUs.title);
    imageBlock(rs.supportUs.image, "Support Us");
  }

  /* In Association With */
  if (rs.association) {
    section(rs.association.title);
    imageBlock(rs.association.image, "In Association With");
  }
}

/* NEWS FEED */
function renderNews(data) {
  const feed = document.getElementById('news-feed');
  if (!feed || !Array.isArray(data.articles)) return;

  feed.innerHTML = "";

  data.articles.forEach(article => {
    const div = document.createElement('div');
    div.className = "article";

    div.innerHTML = `
      <span class="category">${article.category ?? ""}</span>
      <h2>${article.title ?? ""}</h2>
      <p>${Array.isArray(article.content)
        ? article.content.join("</p><p>")
        : ""}</p>
    `;

    if (article.media?.type === "image" && article.media.src) {
      const img = document.createElement('img');
      img.src = article.media.src.startsWith('../') ? article.media.src : '../' + article.media.src;
      img.alt = article.media.alt || "";
      img.loading = "lazy";
      div.appendChild(img);
    }

    feed.appendChild(div);
  });
}


document.addEventListener("DOMContentLoaded", async () => {

  /* Layout + Sidebars */
  if (document.getElementById("sidebar") || document.getElementById("rightbar")) {
    const layoutData = await loadLayoutData();

    if (document.getElementById("sidebar")) {
      renderSidebar(layoutData);
    }

    if (document.getElementById("rightbar")) {
      renderRightbar(layoutData);
    }
  }

  /* News */
  if (document.getElementById("news-feed")) {
    const newsData = await loadNewsData();
    renderNews(newsData);
  }

});



const toggleBtn = document.getElementById("theme-toggle");

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    toggleBtn.textContent = next === "light" ? "🌞" : "🌙";
    localStorage.setItem("theme", next);
  });

  const saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
    toggleBtn.textContent = saved === "light" ? "🌞" : "🌙";
  }
}
