// ================= 全局状态 =================
let currentComic = null;
let currentPageIndex = 0;
let currentZoom = 1;

// ================= DOM =================
const comicList = document.getElementById("comicList");
const homePage = document.getElementById("homePage");
const reader = document.getElementById("reader");
const pageContainer = document.getElementById("pageContainer");
const readerTitle = document.getElementById("readerTitle");
const pageIndicator = document.getElementById("pageIndicator");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const rankResults = document.getElementById("rankResults");
const categoryTags = document.getElementById("categoryTags");
const statusTags = document.getElementById("statusTags");
const categoryResults = document.getElementById("categoryResults");
const collectionContainer = document.getElementById("collectionContainer");
const freeList = document.getElementById("freeList");

const navLinks = document.querySelectorAll(".nav-bar a");

// ================= 通用渲染函数 =================
function renderComics(list, container, showIndex = false) {
  container.innerHTML = "";
  if (!list || list.length === 0) {
    container.innerHTML = "<li>暂无内容</li>";
    return;
  }
  list.forEach((c, idx) => {
    const li = document.createElement("li");
    li.className = "comic-item";
    li.innerHTML = `
      ${showIndex ? `<div class="book-index">${idx+1}</div>` : ""}
      <div class="cover-box">
        <img src="${c.cover}" alt="${c.title}">
        <span class="badge ${c.isFree ? 'free' : 'paid'}">${c.isFree ? '免费' : '付费'}</span>
      </div>
      <div class="comic-title">${c.title}</div>
      <div class="comic-author">${c.author}</div>
    `;
    li.addEventListener("click", () => openComic(c));
    container.appendChild(li);
  });
}

// ================= 漫画阅读器 =================
function openComic(comic) {
  currentComic = comic;
  currentPageIndex = 0;
  currentZoom = 1;
  showReader();
}

function showReader() {
  hideAllPages();
  reader.style.display = "block";
  readerTitle.textContent = `${currentComic.title} · ${currentComic.author}`;
  renderPage();
}

function renderPage() {
  pageContainer.innerHTML = "";
  const img = document.createElement("img");
  img.src = currentComic.pages[currentPageIndex];
  img.alt = `${currentComic.title} - 页 ${currentPageIndex+1}`;
  img.style.transform = `scale(${currentZoom})`;
  pageContainer.appendChild(img);
  pageIndicator.textContent = `${currentPageIndex+1} / ${currentComic.pages.length}`;
}

// 翻页
document.getElementById("prevPage").addEventListener("click", () => {
  if (!currentComic) return;
  if (currentPageIndex > 0) {
    currentPageIndex--;
    renderPage();
  }
});
document.getElementById("nextPage").addEventListener("click", () => {
  if (!currentComic) return;
  if (currentPageIndex < currentComic.pages.length - 1) {
    currentPageIndex++;
    renderPage();
  }
});

// 缩放
document.getElementById("zoomIn").addEventListener("click", () => {
  currentZoom = Math.min(2.5, currentZoom + 0.25);
  renderPage();
});
document.getElementById("zoomOut").addEventListener("click", () => {
  currentZoom = Math.max(0.5, currentZoom - 0.25);
  renderPage();
});
document.getElementById("zoomReset").addEventListener("click", () => {
  currentZoom = 1;
  renderPage();
});

// 返回首页
document.getElementById("backHome").addEventListener("click", () => {
  hideAllPages();
  homePage.style.display = "block";
  navLinks.forEach(a => a.classList.remove("active"));
  document.querySelector('.nav-bar a[data-page="homePage"]').classList.add("active");
});

// ================= 搜索功能 =================
searchBtn.addEventListener("click", () => {
  const kw = searchInput.value.trim().toLowerCase();
  if (!kw) {
    alert("请输入关键词！");
    return;
  }

  const results = comics.filter(c => 
    (c.title && c.title.toLowerCase().includes(kw)) ||
    (c.author && c.author.toLowerCase().includes(kw)) ||
    (c.tags && c.tags.join(" ").toLowerCase().includes(kw))
  );

  showSearchResults(results, kw);
});

function showSearchResults(results, kw) {
  hideAllPages();
  const searchPage = document.getElementById("searchPage");
  searchPage.style.display = "block";

  const searchTitle = document.getElementById("searchTitle");
  searchTitle.textContent = `搜索结果：${kw}`;

  const ul = document.getElementById("searchResults");
  renderComics(results, ul);
}

// ================= 分类 =================
let selectedTag = null;
let selectedStatus = "全部";

function renderTagButtons() {
  const allTags = Array.from(new Set(comics.flatMap(c => c.tags || [])));
  categoryTags.innerHTML = allTags.map(t => `<button data-tag="${t}" class="${selectedTag===t?'active':''}">${t}</button>`).join(" ");
  categoryTags.querySelectorAll("button").forEach(btn=>{
    btn.onclick = () => {
      const t = btn.dataset.tag;
      selectedTag = (selectedTag === t) ? null : t;
      renderTagButtons();
      renderStatusButtons();
      renderCategoryResults();
    }
  });
}

function renderStatusButtons() {
  const statuses = ["全部","免费","付费"];
  statusTags.innerHTML = statuses.map(s => `<button data-status="${s}" class="${selectedStatus===s?'active':''}">${s}</button>`).join(" ");
  statusTags.querySelectorAll("button").forEach(btn=>{
    btn.onclick = () => {
      const s = btn.dataset.status;
      selectedStatus = (selectedStatus === s) ? "全部" : s;
      renderStatusButtons();
      renderCategoryResults();
    }
  });
}

function renderCategoryResults() {
  let list = comics.slice();
  if (selectedTag) list = list.filter(c => c.tags && c.tags.includes(selectedTag));
  if (selectedStatus === "免费") list = list.filter(c => c.isFree);
  if (selectedStatus === "付费") list = list.filter(c => !c.isFree);
  renderComics(list, categoryResults);
}

// ================= 排行 =================
document.querySelectorAll(".rank-tab").forEach(tab=>{
  tab.addEventListener("click", ()=>{
    document.querySelectorAll(".rank-tab").forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    loadRankList(tab.dataset.rank);
  });
});
function loadRankList(type) {
  let list = [];
  if (type === "hot") {
    list = comics.slice(0, 6);
  } else {
    list = comics.slice(-6);
  }
  renderComics(list, rankResults, true);
}

// ================= 书单 =================
function loadCollections() {
  collectionContainer.innerHTML = "";
  collections.forEach(col=>{
    const box = document.createElement("div");
    box.className = "booklist-item";
    box.innerHTML = `<div class="booklist-title">${col.title}</div>`;
    const ul = document.createElement("ul");
    ul.className = "comic-list-container";
    const listComics = col.comics.map(id => comics.find(c => c.id === id)).filter(Boolean);
    renderComics(listComics, ul);
    box.appendChild(ul);
    collectionContainer.appendChild(box);
  });
}

// ================= 免费 =================
function loadFreeList() {
  const free = comics.filter(c => c.isFree);
  renderComics(free, freeList);
}

// ================= 页面切换 =================
navLinks.forEach(link => {
  link.addEventListener("click", e=>{
    e.preventDefault();
    navLinks.forEach(a => a.classList.remove("active"));
    link.classList.add("active");
    hideAllPages();
    const pageId = link.dataset.page;
    const page = document.getElementById(pageId);
    if (!page) return;
    page.style.display = "block";
    if (pageId === "categoryPage") {
      renderTagButtons(); renderStatusButtons(); renderCategoryResults();
    } else if (pageId === "rankPage") {
      loadRankList("hot");
    } else if (pageId === "collectionPage") {
      loadCollections();
    } else if (pageId === "freePage") {
      loadFreeList();
    }
  });
});

function hideAllPages() {
  document.querySelectorAll("main").forEach(m => m.style.display = "none");
}

// ================= 首页推荐 =================
function loadHomeRecommendations() {
  const recs = comics.slice(0, 8);
  renderComics(recs, comicList);
}

// ================= 键盘翻页 =================
document.addEventListener("keydown", (e)=>{
  if (reader.style.display === "block") {
    if (e.key === "ArrowLeft") document.getElementById("prevPage").click();
    if (e.key === "ArrowRight") document.getElementById("nextPage").click();
    if (e.key === "+" || e.key === "=") document.getElementById("zoomIn").click();
    if (e.key === "-") document.getElementById("zoomOut").click();
  }
});

// ================= 初始化 =================
function init() {
  hideAllPages();
  homePage.style.display = "block";
  navLinks.forEach(a => a.classList.remove("active"));
  document.querySelector('.nav-bar a[data-page="homePage"]').classList.add("active");

  loadHomeRecommendations();
}

document.addEventListener("DOMContentLoaded", init);
