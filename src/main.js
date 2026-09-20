import './style.css';

const questions = [
  { text: 'Я никогда не притворялся, что понимаю сюжет фильма.', category: 'Лёгкое', icon: '🍿' },
  { text: 'Я никогда не отправлял сообщение не тому человеку.', category: 'Смешное', icon: '💬' },
  { text: 'Я никогда не путешествовал в одиночку.', category: 'Приключения', icon: '✈️' },
  { text: 'Я никогда не пел в душе так, будто это концерт.', category: 'Лёгкое', icon: '🎤' },
  { text: 'Я никогда не засыпал на важной встрече.', category: 'Смешное', icon: '😴' },
  { text: 'Я никогда не пробовал блюдо, название которого не мог произнести.', category: 'Еда', icon: '🍜' },
  { text: 'Я никогда не менял планы в последний момент ради приключения.', category: 'Приключения', icon: '🗺️' },
  { text: 'Я никогда не делал вид, что знаю текст песни.', category: 'Музыка', icon: '🎧' }
];

let current = 0;
let played = 0;

const app = document.querySelector('#app');
app.innerHTML = `
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="Я никогда не — главная"><span class="brand-mark">Я</span><span>никогда не</span></a>
      <div class="room"><span class="room-dot"></span><span>Вечеринка дома</span><button class="more" aria-label="Настройки комнаты">•••</button></div>
    </header>

    <section class="game" aria-labelledby="game-title">
      <div class="eyebrow"><span class="pulse"></span> РАУНД ${String(current + 1).padStart(2, '0')}</div>
      <p class="lead">Признайся, если это было с тобой.</p>
      <div class="prompt-card">
        <div class="glow glow-one"></div><div class="glow glow-two"></div>
        <div class="prompt-icon" id="promptIcon">🍿</div>
        <h1 id="game-title">Я никогда не...</h1>
        <p class="question" id="question"></p>
        <span class="category" id="category"></span>
      </div>
      <div class="actions">
        <button class="answer answer-yes" id="yes"><span class="answer-face">🙋</span><span><b>Было</b><small>есть история</small></span><kbd>A</kbd></button>
        <button class="answer answer-no" id="no"><span class="answer-face">✨</span><span><b>Не было</b><small>чистая совесть</small></span><kbd>L</kbd></button>
      </div>
      <button class="next" id="next">Следующее утверждение <span>→</span></button>
      <p class="hint">Нажми <strong>пробел</strong>, чтобы продолжить</p>
    </section>

    <aside class="people" aria-label="Участники игры">
      <div class="people-header"><span>В игре <b>4</b></span><button id="invite">+ Пригласить</button></div>
      <div class="avatars">
        <div class="avatar avocado" title="Лера">🥑</div><div class="avatar fox" title="Макс">🦊</div><div class="avatar bear" title="Дима">🐻</div><div class="avatar flower" title="Аня">🌼</div>
      </div>
      <p><span class="online-dot"></span> Все на связи</p>
    </aside>
    <div class="toast" role="status" aria-live="polite"></div>
  </main>`;

const questionEl = document.querySelector('#question');
const categoryEl = document.querySelector('#category');
const promptIcon = document.querySelector('#promptIcon');
const toast = document.querySelector('.toast');

function render() {
  const item = questions[current];
  questionEl.textContent = item.text;
  categoryEl.textContent = item.category;
  promptIcon.textContent = item.icon;
  document.querySelector('.eyebrow').innerHTML = `<span class="pulse"></span> РАУНД ${String(current + 1).padStart(2, '0')}`;
  document.querySelector('.prompt-card').animate([{ opacity: .45, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 280, easing: 'ease-out' });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('visible'), 1700);
}

function choose(answer) {
  played += 1;
  document.querySelectorAll('.answer').forEach(button => button.classList.remove('selected'));
  document.querySelector(answer === 'Было' ? '#yes' : '#no').classList.add('selected');
  showToast(answer === 'Было' ? 'Ого! История засчитана 🙌' : 'Принято — без компромата ✨');
}

function next() {
  current = (current + 1) % questions.length;
  render();
  document.querySelectorAll('.answer').forEach(button => button.classList.remove('selected'));
}

document.querySelector('#yes').addEventListener('click', () => choose('Было'));
document.querySelector('#no').addEventListener('click', () => choose('Не было'));
document.querySelector('#next').addEventListener('click', next);
document.querySelector('#invite').addEventListener('click', () => showToast('Ссылка для друзей скопирована! 🔗'));
document.addEventListener('keydown', event => {
  if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); next(); }
  if (event.key.toLowerCase() === 'a') choose('Было');
  if (event.key.toLowerCase() === 'l') choose('Не было');
});
render();
