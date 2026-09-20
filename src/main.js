const decks = [
  { title: 'Разминка', count: 161, age: '0+', icon: '☁️', tone: 'purple' },
  { title: 'Еда', count: 98, age: '0+', icon: '🍔', tone: 'orange' },
  { title: 'Путешествия', count: 97, age: '0+', icon: '✈️', tone: 'blue' },
  { title: 'Юмор', count: 112, age: '18+', icon: '😄', tone: 'pink' },
  { title: 'Музыка', count: 86, age: '0+', icon: '🎧', tone: 'mint' },
  { title: 'Пошлая вечеринка', count: 74, age: '18+', icon: '🔞', tone: 'berry' }
];

const games = [
  ['🎭', 'Весёлая компания', 'Разминка', '5/6'],
  ['🧔', 'Клуб анонимных', 'Еда', '4/6'],
  ['🧑‍🎤', 'Пятничная тусовка', 'Юмор', '6/6'],
  ['🛸', 'Друзья навсегда', 'Путешествия', '3/6'],
  ['🎧', 'Хаос и смех', 'Музыка', '4/6']
];

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="dashboard">
    <aside class="sidebar">
      <a href="#" class="logo"><span>Я</span> никогда не... <i>👾</i></a>
      <nav class="nav"><button class="active" data-view="Играть"><b>🎮</b>Играть</button><button data-view="Колоды"><b>🃏</b>Колоды</button><button data-view="Друзья"><b>♧</b>Друзья</button></nav>
      <nav class="nav bottom"><button data-view="Настройки"><b>⚙</b>Настройки</button><button data-view="Профиль"><b>♙</b>Профиль</button></nav>
    </aside>
    <main class="content">
      <header><label class="search">⌕ <input aria-label="Поиск" placeholder="Поиск колод, игроков, комнат..." /></label><div class="profile"><button class="bell" aria-label="Уведомления">♧</button><span class="portrait">👨🏻</span><b>Александр</b><span>⌄</span></div></header>
      <section class="mobile-title"><button class="menu" aria-label="Меню">☰</button><b>Я никогда не...</b><span class="portrait">👨🏻</span></section>
      <div class="layout">
        <section class="feed">
          <section class="hero"><div class="hero-copy"><span class="tag">Игра для компании</span><h1>Соберите компанию<br />и начните игру</h1><p>Выберите колоду, создайте комнату<br />или присоединитесь к уже существующей.</p><div class="hero-buttons"><button class="primary" id="create">Создать игру</button><button class="outline" id="join">Присоединиться по коду</button></div></div><div class="mascot"><span class="spark one">✦</span><span class="spark two">?</span><div class="cards">Я<br />никогда<br />не...</div><div class="blob">👾</div></div></section>
          <section class="section-heading"><h2>Продолжить игру</h2><a href="#">Все комнаты →</a></section>
          <article class="continue"><div class="stacked-faces"><span>🧑🏻</span><span>🧔🏻</span><span>👩🏼</span><em>+1</em></div><div><h3>Пятничная тусовка</h3><p>♧ 5 игроков　•　Разминка　•　32 карточки</p></div><button class="action" id="continue">Продолжить</button></article>
          <section class="section-heading"><h2>Популярные колоды</h2><a href="#">Все колоды →</a></section>
          <div class="deck-grid" id="decks"></div>
        </section>
        <aside class="rightbar"><section class="online"><div class="side-heading"><h2>Текущие онлайн-игры</h2><span>● 12 игр</span></div><div id="games"></div></section><section class="premium"><div class="crown">♛</div><h3>Premium</h3><p>Больше колод, эксклюзивные<br />подарки и уникальные возможности!</p><button>Узнать больше</button></section><section class="friend-card"><p>Хорошая компания<br />делает игру<br />ещё интереснее!</p><span>👾</span></section></aside>
      </div>
    </main>
    <div class="modal" id="modal" aria-hidden="true"><div class="dialog"><button class="close" aria-label="Закрыть">×</button><span class="tag">НОВАЯ КОМНАТА</span><h2 id="modal-title">Соберём компанию?</h2><p id="modal-text">Выберите колоду — мы создадим комнату и код для друзей.</p><div class="modal-decks" id="modal-decks"></div><button class="primary wide" id="modal-action">Создать комнату</button></div></div>
    <div class="toast" role="status"></div>
  </div>`;

const deckBox = document.querySelector('#decks');
deckBox.innerHTML = decks.map((deck, index) => `<article class="deck ${deck.tone}"><div class="deck-art">${deck.icon}<span>${index === 0 ? '✦ ?' : ''}</span></div><h3>${deck.title}</h3><p>${deck.count} карт　·　${deck.age}</p><button data-deck="${deck.title}">Выбрать</button></article>`).join('');
document.querySelector('#games').innerHTML = games.map(([icon, name, topic, players]) => `<article class="game-row"><span class="game-avatar">${icon}</span><div><b>${name}</b><small>${topic}　·　${players}</small></div><button>Играть</button></article>`).join('');

const modal = document.querySelector('#modal');
const toast = document.querySelector('.toast');
let chosenDeck = 'Разминка';
function showToast(text) { toast.textContent = text; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2400); }
function openModal(mode = 'create') {
  const join = mode === 'join';
  document.querySelector('#modal-title').textContent = join ? 'Введите код комнаты' : 'Соберём компанию?';
  document.querySelector('#modal-text').textContent = join ? 'Попросите друга отправить шестизначный код приглашения.' : 'Выберите колоду — мы создадим комнату и код для друзей.';
  document.querySelector('#modal-action').textContent = join ? 'Присоединиться' : 'Создать комнату';
  document.querySelector('#modal-decks').innerHTML = join ? '<input class="code-input" maxlength="6" placeholder="000 000" inputmode="numeric" />' : decks.slice(0, 4).map(deck => `<button class="mini-deck ${deck.tone} ${deck.title === chosenDeck ? 'picked' : ''}" data-choice="${deck.title}">${deck.icon}<span>${deck.title}</span></button>`).join('');
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
}
document.querySelector('#create').onclick = () => openModal();
document.querySelector('#join').onclick = () => openModal('join');
document.querySelector('.close').onclick = () => modal.classList.remove('open');
modal.addEventListener('click', event => { if (event.target === modal) modal.classList.remove('open'); const choice = event.target.closest('[data-choice]'); if (choice) { chosenDeck = choice.dataset.choice; openModal(); } });
document.querySelector('#modal-action').onclick = () => { modal.classList.remove('open'); showToast(`Комната для колоды «${chosenDeck}» готова! Код скопирован ✨`); };
document.querySelector('#continue').onclick = () => showToast('Возвращаемся в «Пятничную тусовку» 🎉');
document.querySelectorAll('[data-view]').forEach(button => button.onclick = () => { document.querySelectorAll('[data-view]').forEach(item => item.classList.remove('active')); button.classList.add('active'); showToast(`Раздел «${button.dataset.view}» скоро появится`); });
deckBox.addEventListener('click', event => { const deck = event.target.dataset.deck; if (deck) { chosenDeck = deck; openModal(); } });
document.querySelector('.menu').onclick = () => document.querySelector('.sidebar').classList.toggle('mobile-open');
