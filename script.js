const analyticsForm = document.querySelector('#analyticsForm');

if (analyticsForm) {
  analyticsForm.addEventListener('submit', event => {
    event.preventDefault();

    const hours = Number(document.querySelector('#hoursInput').value) || 0;
    const spend = Number(document.querySelector('#spendInput').value) || 0;
    const games = Number(document.querySelector('#gamesInput').value) || 0;
    const genre =
      document.querySelector('#genreInput').value.trim() || 'смешанный жанр';
    const averageSpend = games > 0 ? Math.round(spend / games) : 0;
    const activityLevel =
      hours >= 250
        ? 'очень активный игрок'
        : hours >= 100
          ? 'стабильный игрок'
          : 'спокойный игрок';
    const result = document.querySelector('#analyticsResult');

    result.innerHTML = `
      <strong>Твой результат: ${activityLevel}</strong>
      <p>Ты провёл ${hours} ч, потратил ${spend} RUB и купил ${games} игр.</p>
      <p>Средний чек: ${averageSpend} RUB. Главный жанр: ${genre}.</p>
    `;
  });
}

const communityStorageKey = 'steam2Communities';

function loadCommunities() {
  try {
    return JSON.parse(localStorage.getItem(communityStorageKey)) || [];
  } catch {
    return [];
  }
}

function saveCommunities(communities) {
  localStorage.setItem(communityStorageKey, JSON.stringify(communities));
}

function makeCommunityId(name) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-zа-яё0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 34);

  return `${slug || 'community'}-${Date.now().toString(36)}`;
}

function getCommunityById(id) {
  return loadCommunities().find(community => community.id === id);
}

function updateCommunity(updatedCommunity) {
  const communities = loadCommunities().map(community =>
    community.id === updatedCommunity.id ? updatedCommunity : community,
  );

  saveCommunities(communities);
}

function createEmptyState(text) {
  const element = document.createElement('div');
  element.className = 'community-empty';
  element.textContent = text;
  return element;
}

function createCommunityCard(community) {
  const link = document.createElement('a');
  link.className = 'community-card';
  link.href = `community.html?id=${encodeURIComponent(community.id)}`;

  const avatar = document.createElement('span');
  avatar.className = 'community-avatar';
  avatar.textContent = community.name.slice(0, 2).toUpperCase();

  const content = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = community.name;
  const description = document.createElement('p');
  description.textContent =
    community.description || 'Отдельная страница с чатом и прогрессом.';
  const meta = document.createElement('small');
  meta.textContent = `${community.genre || 'Без жанра'} * ${
    community.messages.length
  } сообщений`;

  const status = document.createElement('b');
  status.textContent = `${community.members} участник`;

  content.append(title, description, meta);
  link.append(avatar, content, status);
  return link;
}

function renderCommunityHub() {
  const list = document.querySelector('#communityList');
  const activity = document.querySelector('#communityActivity');
  const totalCount = document.querySelector('#communityTotalCount');
  const searchInput = document.querySelector('#communitySearchInput');

  if (!list || !activity) return;

  const communities = loadCommunities();
  const query = searchInput?.value.trim().toLowerCase() || '';
  const filteredCommunities = communities.filter(community =>
    `${community.name} ${community.genre} ${community.description}`
      .toLowerCase()
      .includes(query),
  );

  list.replaceChildren();
  activity.replaceChildren();

  if (totalCount) {
    totalCount.textContent = communities.length;
  }

  if (filteredCommunities.length === 0) {
    list.append(
      createEmptyState(
        communities.length === 0
          ? 'Пока нет созданных сообществ. Создай первое в форме справа.'
          : 'По этому поиску ничего не найдено.',
      ),
    );
  } else {
    filteredCommunities.forEach(community => {
      list.append(createCommunityCard(community));
    });
  }

  const recentItems = communities
    .flatMap(community =>
      community.messages.map(message => ({
        community,
        message,
      })),
    )
    .sort((a, b) => b.message.createdAt - a.message.createdAt)
    .slice(0, 8);

  if (recentItems.length === 0) {
    activity.append(
      createEmptyState(
        'Лента пустая. Напиши первое сообщение внутри любого сообщества.',
      ),
    );
  } else {
    recentItems.forEach(({ community, message }) => {
      const item = document.createElement('a');
      item.className = 'activity-card';
      item.href = `community.html?id=${encodeURIComponent(community.id)}`;

      const title = document.createElement('strong');
      title.textContent = community.name;
      const text = document.createElement('p');
      text.textContent = message.text;
      const time = document.createElement('small');
      time.textContent = message.time;

      item.append(title, text, time);
      activity.append(item);
    });
  }
}

const communityCreateForm = document.querySelector('#communityCreateForm');

if (communityCreateForm) {
  communityCreateForm.addEventListener('submit', event => {
    event.preventDefault();

    const nameInput = document.querySelector('#communityNameInput');
    const genreInput = document.querySelector('#communityGenreInput');
    const descriptionInput = document.querySelector('#communityDescriptionInput');
    const name = nameInput.value.trim();

    if (!name) return;

    const community = {
      id: makeCommunityId(name),
      name,
      genre: genreInput.value.trim() || 'Сообщество',
      description: descriptionInput.value.trim(),
      members: 1,
      createdAt: Date.now(),
      progress: {
        wishlist: false,
        vote: false,
        firstSession: false,
      },
      messages: [
        {
          author: 'Система',
          text: `Сообщество “${name}” создано. Можно начинать обсуждение.`,
          time: new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          createdAt: Date.now(),
        },
      ],
    };

    const communities = loadCommunities();
    communities.unshift(community);
    saveCommunities(communities);
    window.location.href = `community.html?id=${encodeURIComponent(
      community.id,
    )}`;
  });

  document
    .querySelector('#communitySearchInput')
    ?.addEventListener('input', renderCommunityHub);
  renderCommunityHub();
}

function appendChatMessage(container, message) {
  const item = document.createElement('div');
  const heading = document.createElement('strong');
  const text = document.createElement('p');
  const time = document.createElement('small');

  heading.textContent = message.author;
  text.textContent = message.text;
  time.textContent = message.time;

  item.append(heading, text, time);
  container.append(item);
}

function renderCommunityRoom() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const chatMessages = document.querySelector('#chatMessages');
  const communityName = document.querySelector('#communityName');

  if (!chatMessages || !communityName) return;

  const community = getCommunityById(id);

  if (!community) {
    communityName.textContent = 'Сообщество не найдено';
    document.querySelector('#communityDescription').textContent =
      'Вернись в активность и создай новое сообщество.';
    chatMessages.append(
      createEmptyState('Для этой ссылки нет сохранённого сообщества.'),
    );
    return;
  }

  document.title = `${community.name} | Steam 2.0`;
  document.querySelector('#communityName').textContent = community.name;
  document.querySelector('#communityGenre').textContent =
    community.genre || 'Сообщество';
  document.querySelector('#communityDescription').textContent =
    community.description ||
    'Отдельная страница сообщества с сохранённым чатом и прогрессом.';
  document.querySelector('#memberCount').textContent = community.members;

  document.querySelectorAll('[data-progress]').forEach(input => {
    input.checked = Boolean(community.progress[input.dataset.progress]);
    input.addEventListener('change', () => {
      const latestCommunity = getCommunityById(community.id);
      latestCommunity.progress[input.dataset.progress] = input.checked;
      updateCommunity(latestCommunity);
    });
  });

  chatMessages.replaceChildren();
  community.messages.forEach(message => appendChatMessage(chatMessages, message));
  chatMessages.scrollTop = chatMessages.scrollHeight;

  document.querySelector('#addMemberButton')?.addEventListener('click', () => {
    const latestCommunity = getCommunityById(community.id);
    latestCommunity.members += 1;
    updateCommunity(latestCommunity);
    document.querySelector('#memberCount').textContent = latestCommunity.members;
  });

  document.querySelector('#chatForm')?.addEventListener('submit', event => {
    event.preventDefault();

    const input = document.querySelector('#chatInput');
    const text = input.value.trim();

    if (!text) return;

    const latestCommunity = getCommunityById(community.id);
    const message = {
      author: 'Ты',
      text,
      time: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      createdAt: Date.now(),
    };

    latestCommunity.messages.push(message);
    updateCommunity(latestCommunity);
    appendChatMessage(chatMessages, message);
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

renderCommunityRoom();

const cartStorageKey = 'steam2Cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(cartStorageKey)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function formatRub(value) {
  return `${Number(value).toLocaleString('ru-RU')} RUB`;
}

function updateCartCounters() {
  const cartCount = loadCart().length;
  document.querySelectorAll('[data-cart-count]').forEach(counter => {
    counter.textContent = cartCount;
    counter.classList.toggle('is-filled', cartCount > 0);
  });
}

function getGameFromRow(row) {
  return {
    id: row.dataset.gameId,
    title: row.dataset.title,
    price: Number(row.dataset.price),
    image: row.dataset.image,
    categories: row.dataset.categories,
  };
}

function animateCartAdd(button, game) {
  const pop = document.createElement('div');
  const image = document.createElement('img');
  const title = document.createElement('span');
  const rect = button.getBoundingClientRect();

  pop.className = 'cart-flyout';
  pop.style.left = `${rect.left + rect.width / 2}px`;
  pop.style.top = `${rect.top + window.scrollY}px`;
  image.src = game.image;
  image.alt = game.title;
  title.textContent = 'Добавлено';

  pop.append(image, title);
  document.body.append(pop);

  window.setTimeout(() => pop.remove(), 820);
}

function initStoreFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const rows = document.querySelectorAll('.store-row[data-categories]');
  const status = document.querySelector('#storeFilterStatus');

  if (filterButtons.length === 0 || rows.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      let visibleCount = 0;

      filterButtons.forEach(item => item.classList.remove('active'));
      button.classList.add('active');

      rows.forEach(row => {
        const categories = row.dataset.categories.split(' ');
        const isVisible = filter === 'all' || categories.includes(filter);

        row.classList.toggle('is-hidden', !isVisible);
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (status) {
        status.textContent =
          filter === 'all'
            ? 'Показаны все игры'
            : `Найдено игр: ${visibleCount}`;
      }
    });
  });
}

function initStoreCartButtons() {
  const buttons = document.querySelectorAll('[data-add-cart]');

  if (buttons.length === 0) return;

  const currentCart = loadCart();
  buttons.forEach(button => {
    const row = button.closest('.store-row');
    const game = getGameFromRow(row);

    if (currentCart.some(item => item.id === game.id)) {
      button.classList.add('is-added');
      button.innerHTML = '<span>✓</span> В корзине';
    }

    button.addEventListener('click', () => {
      const cart = loadCart();
      const exists = cart.some(item => item.id === game.id);

      if (!exists) {
        cart.push(game);
        saveCart(cart);
      }

      button.classList.add('is-added', 'is-pulsing');
      button.innerHTML = '<span>✓</span> В корзине';
      animateCartAdd(button, game);
      updateCartCounters();

      window.setTimeout(() => {
        window.location.href = 'cart.html';
      }, 520);
    });
  });
}

function createCartItem(item) {
  const card = document.createElement('article');
  const image = document.createElement('img');
  const body = document.createElement('div');
  const title = document.createElement('h2');
  const meta = document.createElement('p');
  const price = document.createElement('strong');
  const removeButton = document.createElement('button');

  card.className = 'cart-item';
  card.dataset.cartItem = item.id;
  image.src = item.image;
  image.alt = item.title;
  title.textContent = item.title;
  meta.textContent = 'Для моего аккаунта';
  price.textContent = formatRub(item.price);
  removeButton.type = 'button';
  removeButton.className = 'cart-remove-button';
  removeButton.textContent = 'Удалить';
  removeButton.addEventListener('click', () => {
    const nextCart = loadCart().filter(game => game.id !== item.id);
    saveCart(nextCart);
    card.classList.add('is-removing');
    window.setTimeout(renderCartPage, 220);
  });

  body.append(title, meta);
  card.append(image, body, price, removeButton);
  return card;
}

function renderCartPage() {
  const list = document.querySelector('#cartItems');
  const total = document.querySelector('#cartTotal');
  const bonusText = document.querySelector('#cartBonusText');
  const progressBar = document.querySelector('#cartProgressBar');
  const progressText = document.querySelector('#cartProgressText');
  const clearButton = document.querySelector('#clearCartButton');

  if (!list || !total) return;

  const cart = loadCart();
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const cardsCount = Math.min(8, cart.length * 2);

  list.replaceChildren();

  if (cart.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'cart-empty';
    empty.innerHTML = `
      <strong>Корзина пока пустая</strong>
      <p>Вернись в магазин, выбери игру и нажми “В корзину”.</p>
      <a class="primary-link" href="shop.html">Открыть магазин</a>
    `;
    list.append(empty);
  } else {
    cart.forEach(item => list.append(createCartItem(item)));
  }

  total.textContent = formatRub(totalPrice);

  if (bonusText) {
    bonusText.textContent =
      cart.length > 0
        ? `Количество карточек за эту покупку: ${cardsCount}`
        : 'Добавь игру в корзину, чтобы увидеть прогресс бонусов.';
  }

  if (progressBar) {
    progressBar.style.width = `${(cardsCount / 8) * 100}%`;
  }

  if (progressText) {
    progressText.textContent = `${cardsCount} из 8 карточек`;
  }

  if (clearButton) {
    clearButton.disabled = cart.length === 0;
    clearButton.onclick = () => {
      saveCart([]);
      renderCartPage();
      updateCartCounters();
    };
  }

  const checkoutButton = document.querySelector('#checkoutButton');

  if (checkoutButton) {
    checkoutButton.onclick = () => {
      checkoutButton.textContent =
      cart.length === 0 ? 'Корзина пустая' : 'Покупка готова к оплате';
      checkoutButton.classList.add('is-pulsing');
    };
  }

  updateCartCounters();
}

initStoreFilters();
initStoreCartButtons();
renderCartPage();
updateCartCounters();

const libraryStorageKey = 'steam2LibraryState';

function loadLibraryState() {
  try {
    return JSON.parse(localStorage.getItem(libraryStorageKey)) || {};
  } catch {
    return {};
  }
}

function saveLibraryState(state) {
  localStorage.setItem(libraryStorageKey, JSON.stringify(state));
}

function getLibraryGameState(gameId) {
  const state = loadLibraryState();

  return {
    favorite: false,
    note: '',
    launches: 0,
    extraHours: 0,
    ...(state[gameId] || {}),
  };
}

function updateLibraryGameState(gameId, nextGameState) {
  const state = loadLibraryState();
  state[gameId] = {
    ...getLibraryGameState(gameId),
    ...nextGameState,
  };
  saveLibraryState(state);
}

function getLibraryGameData(button) {
  return {
    id: button.dataset.id,
    title: button.dataset.title,
    hero: button.dataset.hero,
    image: button.dataset.image,
    hours: Number(button.dataset.hours) || 0,
    last: button.dataset.last,
    tags: button.dataset.tags.split(',').map(tag => tag.trim()),
    description: button.dataset.description,
  };
}

function renderLibraryActivity(game, gameState) {
  const feed = document.querySelector('#libraryActivityFeed');

  if (!feed) return;

  feed.replaceChildren();

  const events = [
    `Ты добавил ${game.title} в библиотеку Steam 2.0.`,
    `Последний запуск: ${game.last}.`,
    gameState.launches > 0
      ? `Запусков через эту страницу: ${gameState.launches}.`
      : 'Нажми “Играть”, чтобы создать новую запись активности.',
  ];

  events.forEach(eventText => {
    const item = document.createElement('div');
    item.className = 'library-activity-item';
    item.innerHTML = `<strong>Steam 2.0</strong><p>${eventText}</p>`;
    feed.append(item);
  });
}

function renderLibraryGame(button) {
  const game = getLibraryGameData(button);
  const gameState = getLibraryGameState(game.id);
  const totalHours = game.hours + gameState.extraHours;
  const heroImage = document.querySelector('#libraryHeroImage');
  const title = document.querySelector('#libraryTitle');
  const description = document.querySelector('#libraryDescription');
  const tags = document.querySelector('#libraryTags');
  const lastPlayed = document.querySelector('#libraryLastPlayed');
  const hours = document.querySelector('#libraryHours');
  const noteInput = document.querySelector('#libraryNoteInput');
  const favoriteButton = document.querySelector('#libraryFavoriteButton');
  const playButton = document.querySelector('#libraryPlayButton');
  const friendStatus = document.querySelector('#libraryFriendStatus');

  document.querySelectorAll('[data-library-game]').forEach(item => {
    item.classList.toggle('active', item === button);
  });

  if (heroImage) {
    heroImage.src = game.hero;
    heroImage.alt = game.title;
  }

  if (title) title.textContent = game.title;
  if (description) description.textContent = game.description;
  if (lastPlayed) lastPlayed.textContent = game.last;
  if (hours) hours.textContent = `${totalHours} ч.`;
  if (noteInput) noteInput.value = gameState.note;
  if (favoriteButton) {
    favoriteButton.textContent = gameState.favorite ? '♥' : '♡';
    favoriteButton.classList.toggle('is-favorite', gameState.favorite);
  }
  if (playButton) {
    playButton.textContent = gameState.launches > 0 ? '▶ Играть снова' : '▶ Играть';
  }
  if (friendStatus) {
    friendStatus.textContent =
      gameState.favorite
        ? 'Игра закреплена в избранном. Она будет заметнее в списке.'
        : 'Можно добавить игру в избранное или оставить личную заметку.';
  }

  if (tags) {
    tags.replaceChildren();
    game.tags.forEach(tag => {
      const item = document.createElement('span');
      item.textContent = tag;
      tags.append(item);
    });
  }

  renderLibraryActivity(game, gameState);
}

function initLibraryPage() {
  const libraryButtons = document.querySelectorAll('[data-library-game]');
  const searchInput = document.querySelector('#librarySearchInput');
  const count = document.querySelector('#libraryCount');
  const playButton = document.querySelector('#libraryPlayButton');
  const favoriteButton = document.querySelector('#libraryFavoriteButton');
  const saveNoteButton = document.querySelector('#librarySaveNoteButton');
  const noteInput = document.querySelector('#libraryNoteInput');
  const noteStatus = document.querySelector('#libraryNoteStatus');

  if (libraryButtons.length === 0) return;

  if (count) {
    count.textContent = `${libraryButtons.length} игр`;
  }

  libraryButtons.forEach(button => {
    button.addEventListener('click', () => renderLibraryGame(button));
  });

  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    libraryButtons.forEach(button => {
      const game = getLibraryGameData(button);
      const isVisible = game.title.toLowerCase().includes(query);
      button.classList.toggle('is-hidden', !isVisible);
      if (isVisible) visibleCount += 1;
    });

    if (count) {
      count.textContent = `${visibleCount} игр`;
    }
  });

  playButton?.addEventListener('click', () => {
    const activeButton = document.querySelector('[data-library-game].active');
    const game = getLibraryGameData(activeButton);
    const gameState = getLibraryGameState(game.id);

    updateLibraryGameState(game.id, {
      launches: gameState.launches + 1,
      extraHours: gameState.extraHours + 1,
    });
    playButton.classList.add('is-pulsing');
    renderLibraryGame(activeButton);
  });

  favoriteButton?.addEventListener('click', () => {
    const activeButton = document.querySelector('[data-library-game].active');
    const game = getLibraryGameData(activeButton);
    const gameState = getLibraryGameState(game.id);

    updateLibraryGameState(game.id, {
      favorite: !gameState.favorite,
    });
    renderLibraryGame(activeButton);
  });

  saveNoteButton?.addEventListener('click', () => {
    const activeButton = document.querySelector('[data-library-game].active');
    const game = getLibraryGameData(activeButton);

    updateLibraryGameState(game.id, {
      note: noteInput.value.trim(),
    });

    if (noteStatus) {
      noteStatus.textContent = 'Заметка сохранена.';
    }
  });

  renderLibraryGame(document.querySelector('[data-library-game].active') || libraryButtons[0]);
}

initLibraryPage();
