import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const decks = [
  { name: 'Разминка', count: 161, age: '0+', emoji: '👾', color: 'violet', text: 'Для начала игры и комфортного знакомства' },
  { name: 'Еда', count: 98, age: '0+', emoji: '🍔', color: 'orange', text: 'Вопросы о еде, ресторанах и кулинарии' },
  { name: 'Путешествия', count: 97, age: '0+', emoji: '✈️', color: 'blue', text: 'Истории поездок, курортов и приключений' },
  { name: 'Юмор', count: 112, age: '18+', emoji: '😄', color: 'pink', text: 'Смешные ситуации, анекдоты и фейлы' },
  { name: 'Музыка', count: 86, age: '0+', emoji: '🎧', color: 'teal', text: 'Любимые треки, артисты и музыкальные истории' },
  { name: 'Пошлая вечеринка', count: 74, age: '18+', emoji: '🔞', color: 'wine', text: 'Для тех, кто не боится откровенностей' },
];

function Icon({ children }) { return <span className="nav-icon">{children}</span>; }

function Sidebar({ active, setActive }) {
  const items = [['home', '♧', 'Играть'], ['decks', '▤', 'Колоды'], ['friends', '♧', 'Друзья'], ['gifts', '♔', 'Подарки']];
  return <aside className="sidebar"><div className="side-brand"><b>Я</b><span>никогда не...</span></div><nav>{items.map(([id, icon, label]) => <button key={id} onClick={() => setActive(id)} className={active === id ? 'active' : ''}><Icon>{icon}</Icon>{label}</button>)}</nav><div className="side-bottom"><button><Icon>⚙</Icon>Настройки</button><button><Icon>♙</Icon>Профиль</button></div></aside>;
}

function DeckCard({ deck, onPick, compact = false }) {
  return <article className={`deck-card ${deck.color} ${compact ? 'compact' : ''}`}>
    <div className="deck-art"><span>{deck.emoji}</span></div>
    <h3>{deck.name}</h3><p className="deck-count">{deck.count} карт · {deck.age}</p>{!compact && <p className="deck-copy">{deck.text}</p>}
    <button onClick={() => onPick(deck)}>Выбрать</button>
  </article>;
}

function Home({ onCreate, onPick }) {
  return <main className="content home-content"><div className="top-row"><div className="crumb">Главная <span>/</span> Лаунчер</div><div className="user">🔍 <span className="mini-avatar">👨🏻</span> Александр⌄</div></div>
    <section className="hero"><div><h1>Соберите компанию<br/>и начните игру</h1><p>Выбирайте колоду, создавайте комнату<br/>и открывайте друг друга с новой стороны!</p><div className="hero-actions"><button className="primary" onClick={onCreate}>Создать игру</button><button className="ghost" onClick={onCreate}>Присоединиться по коду</button></div></div><div className="mascot">👾<span className="mascot-card one">Я<br/>НИКОГДА<br/>НЕ...</span><span className="mascot-card two">Я<br/>НИКОГДА<br/>НЕ...</span></div></section>
    <section className="section-title"><h2>Продолжить игру</h2><button>Все комнаты →</button></section><section className="continue"><div className="face-stack"><i>👩🏻</i><i>👨🏽</i><i>👩🏾</i><i>👨🏻</i></div><div><b>Пятничная тусовка</b><p>5 игроков · Разминка · 32 карточки</p></div><button className="continue-btn">Продолжить</button></section>
    <section className="section-title decks-heading"><h2>Популярные колоды</h2><button onClick={() => document.querySelector('.decks-page')?.scrollIntoView({behavior:'smooth'})}>Смотреть все →</button></section><div className="popular-grid">{decks.map(deck => <DeckCard deck={deck} compact onPick={onPick} key={deck.name}/>)}</div>
  </main>;
}

function Decks({ onPick }) { const [filter, setFilter] = useState('Все'); return <main className="content decks-page"><div className="decks-top"><div><h1>Колоды</h1><div className="filters">{['Все', '0+', '18+'].map(x => <button className={filter === x ? 'active' : ''} onClick={() => setFilter(x)} key={x}>{x}</button>)}</div></div><label className="search">⌕ <input placeholder="Поиск колод..."/></label></div><div className="deck-grid">{decks.filter(x => filter === 'Все' || x.age === filter).map(deck => <DeckCard deck={deck} onPick={onPick} key={deck.name}/>)}</div></main>; }

function RoomModal({ deck, close }) { const [started, setStarted] = useState(false); return <div className="modal-backdrop"><section className="modal"><button className="modal-close" onClick={close}>×</button>{started ? <div className="started"><span>🎉</span><h2>Комната создана!</h2><p>Пригласите друзей и начинайте веселиться.</p><button className="primary" onClick={close}>Готово</button></div> : <><p className="modal-kicker">СОЗДАНИЕ КОМНАТЫ</p><h2>Пятничная тусовка</h2><label>Название комнаты<input defaultValue="Пятничная тусовка"/></label><label>Колода<select defaultValue={deck?.name || 'Разминка'}>{decks.map(d => <option key={d.name}>{d.name}</option>)}</select></label><div className="privacy"><span>🔒 Приватная комната</span><small>Только по приглашению</small></div><button className="primary start" onClick={() => setStarted(true)}>Начать игру →</button></>}</section></div>; }

function App() { const [active, setActive] = useState('home'); const [modal, setModal] = useState(null); const onPick = (deck) => setModal(deck); return <div className="app-shell"><Sidebar active={active} setActive={setActive}/><div className="workspace">{active === 'decks' ? <Decks onPick={onPick}/> : <Home onCreate={() => setModal(decks[0])} onPick={onPick}/>}</div>{modal && <RoomModal deck={modal} close={() => setModal(null)}/>}</div>; }

createRoot(document.getElementById('app')).render(<App />);
