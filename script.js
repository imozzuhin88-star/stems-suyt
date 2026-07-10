const themeStorageKey = 'steam2Theme';
const motionStorageKey = 'steam2Motion';
const sceneStorageKey = 'steam2Scene';
const backgroundImageStorageKey = 'steam2BackgroundImage';

const sceneOptions = [
  { id: 'waves', label: 'Волны' },
  { id: 'winter', label: 'Елки' },
  { id: 'halloween', label: 'Тыквы' },
  { id: 'easter', label: 'Пасха' },
  { id: 'arcade', label: 'Аркада' },
];

const backgroundImageOptions = [
  { id: 'none', label: 'Без картинки' },
  { id: 'desert', label: 'Пустыня' },
  { id: 'winter', label: 'Зима' },
  { id: 'halloween', label: 'Хэллоуин' },
];

function applyTheme(theme) {
  const nextTheme = theme || 'steam';
  document.body.dataset.theme = nextTheme;
  document.querySelectorAll('[data-theme-option]').forEach(button => {
    button.classList.toggle('active', button.dataset.themeOption === nextTheme);
  });
}

applyTheme(localStorage.getItem(themeStorageKey) || 'steam');

function renderBackgroundImageControls() {
  document.querySelectorAll('.theme-popover').forEach(popover => {
    if (popover.querySelector('.background-image-picker')) {
      return;
    }

    const imagePicker = document.createElement('div');
    imagePicker.className = 'background-image-picker';
    imagePicker.setAttribute('aria-label', 'Выбор картинки заднего фона');
    imagePicker.innerHTML = `
      <span>Картинка фона</span>
      <div class="background-image-options">
        ${backgroundImageOptions
          .map(
            option => `
              <button class="background-image-option ${option.id}" type="button" data-bg-image-option="${option.id}">
                <i></i>
                <span>${option.label}</span>
              </button>
            `,
          )
          .join('')}
      </div>
    `;

    popover.insertBefore(imagePicker, popover.querySelector('.theme-motion-toggle'));
  });
}

function applyBackgroundImage(backgroundImage) {
  const option =
    backgroundImageOptions.find(item => item.id === backgroundImage) ||
    backgroundImageOptions[0];

  document.body.dataset.bgImage = option.id;

  document.querySelectorAll('[data-bg-image-option]').forEach(button => {
    button.classList.toggle('active', button.dataset.bgImageOption === option.id);
  });
}

function renderSceneControls() {
  document.querySelectorAll('.theme-popover').forEach(popover => {
    if (popover.querySelector('.scene-picker')) {
      return;
    }

    const scenePicker = document.createElement('div');
    scenePicker.className = 'scene-picker';
    scenePicker.setAttribute('aria-label', 'Выбор стиля фоновой анимации');
    scenePicker.innerHTML = `
      <span>Стиль анимации</span>
      <div class="scene-options">
        ${sceneOptions
          .map(
            scene =>
              `<button class="scene-option" type="button" data-scene-option="${scene.id}">${scene.label}</button>`,
          )
          .join('')}
      </div>
    `;

    popover.insertBefore(scenePicker, popover.querySelector('.theme-motion-toggle'));
  });
}

function applyScene(scene) {
  const nextScene = sceneOptions.some(option => option.id === scene) ? scene : 'waves';
  document.body.dataset.scene = nextScene;
  document.querySelectorAll('[data-scene-option]').forEach(button => {
    button.classList.toggle('active', button.dataset.sceneOption === nextScene);
  });
}

renderBackgroundImageControls();
applyBackgroundImage(localStorage.getItem(backgroundImageStorageKey) || 'none');
renderSceneControls();
applyScene(localStorage.getItem(sceneStorageKey) || 'waves');

function applyMotionPreference(value) {
  const motionEnabled = value !== 'off';
  document.body.classList.toggle('motion-off', !motionEnabled);
  document.querySelectorAll('[data-motion-toggle]').forEach(toggle => {
    toggle.checked = motionEnabled;
  });
}

applyMotionPreference(localStorage.getItem(motionStorageKey) || 'on');

document.querySelectorAll('[data-theme-option]').forEach(button => {
  button.addEventListener('click', () => {
    localStorage.setItem(themeStorageKey, button.dataset.themeOption);
    applyTheme(button.dataset.themeOption);
  });
});

document.querySelectorAll('[data-bg-image-option]').forEach(button => {
  button.addEventListener('click', () => {
    localStorage.setItem(backgroundImageStorageKey, button.dataset.bgImageOption);
    applyBackgroundImage(button.dataset.bgImageOption);
  });
});

document.querySelectorAll('[data-scene-option]').forEach(button => {
  button.addEventListener('click', () => {
    localStorage.setItem(sceneStorageKey, button.dataset.sceneOption);
    applyScene(button.dataset.sceneOption);
  });
});

document.querySelectorAll('[data-motion-toggle]').forEach(toggle => {
  toggle.addEventListener('change', () => {
    const nextValue = toggle.checked ? 'on' : 'off';
    localStorage.setItem(motionStorageKey, nextValue);
    applyMotionPreference(nextValue);
  });
});

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
    totalCount.textContent = String(communities.length);
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
    counter.textContent = String(cartCount);
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

const profileStorageKey = 'steam2ProfileState';
const defaultProfileState = {
  xp: 1240,
  coins: 320,
  frame: 'steam',
  claimedChestDate: '',
  challenges: {},
  votes: {},
};

function loadProfileState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(profileStorageKey)) || {};

    return {
      ...defaultProfileState,
      ...savedState,
      challenges: {
        ...defaultProfileState.challenges,
        ...(savedState.challenges || {}),
      },
      votes: {
        ...defaultProfileState.votes,
        ...(savedState.votes || {}),
      },
    };
  } catch {
    return { ...defaultProfileState };
  }
}

function saveProfileState(state) {
  localStorage.setItem(profileStorageKey, JSON.stringify(state));
}

function getProfileLevel(xp) {
  return Math.max(1, Math.floor(xp / 120) + 1);
}

function renderProfileState() {
  const page = document.querySelector('.profile-page');

  if (!page) return;

  const state = loadProfileState();
  const level = getProfileLevel(state.xp);
  const currentLevelXp = (level - 1) * 120;
  const nextLevelXp = level * 120;
  const progress = Math.min(
    100,
    ((state.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100,
  );

  document.querySelector('#profileLevel').textContent = String(level);
  document.querySelector('#profileXpText').textContent =
    `${state.xp} / ${nextLevelXp} XP до следующего уровня`;
  document.querySelector('#profileXpBar').style.width = `${progress}%`;
  document.querySelector('#profileCoins').textContent = state.coins;

  const avatar = document.querySelector('.profile-avatar');
  const frameStatus = document.querySelector('#profileFrameStatus');

  if (avatar) {
    avatar.dataset.frame = state.frame;
  }

  document.querySelectorAll('[data-frame-option]').forEach(button => {
    const isActive = button.dataset.frameOption === state.frame;
    button.classList.toggle('active', isActive);
  });

  if (frameStatus) {
    frameStatus.textContent = `Активна рамка ${state.frame}.`;
  }

  document.querySelectorAll('[data-challenge]').forEach(input => {
    input.checked = Boolean(state.challenges[input.dataset.challenge]);
  });

  document.querySelectorAll('[data-wishlist-vote]').forEach(button => {
    const game = button.dataset.wishlistVote;
    const counter = button.querySelector('[data-vote-count]');
    const baseVotes = Number(counter?.dataset.baseVotes || counter?.textContent) || 0;
    if (counter && !counter.dataset.baseVotes) {
      counter.dataset.baseVotes = String(baseVotes);
    }
    if (counter) {
      counter.textContent = baseVotes + (state.votes[game] || 0);
    }
  });
}

function addProfileReward({ xp = 0, coins = 0 }) {
  const state = loadProfileState();
  state.xp += xp;
  state.coins += coins;
  saveProfileState(state);
  renderProfileState();
}

function initProfilePage() {
  if (!document.querySelector('.profile-page:not(.buyer-profile-page)')) return;

  renderProfileState();

  document.querySelectorAll('[data-achievement-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.achievementFilter;

      document
        .querySelectorAll('[data-achievement-filter]')
        .forEach(item => item.classList.remove('active'));
      button.classList.add('active');

      document.querySelectorAll('[data-rarity]').forEach(item => {
        item.classList.toggle(
          'is-hidden',
          filter !== 'all' && item.dataset.rarity !== filter,
        );
      });
    });
  });

  document.querySelectorAll('[data-frame-option]').forEach(button => {
    button.addEventListener('click', () => {
      const state = loadProfileState();
      state.frame = button.dataset.frameOption;
      saveProfileState(state);
      renderProfileState();
    });
  });

  document.querySelectorAll('[data-challenge]').forEach(input => {
    input.addEventListener('change', () => {
      const state = loadProfileState();
      const wasDone = Boolean(state.challenges[input.dataset.challenge]);
      state.challenges[input.dataset.challenge] = input.checked;

      if (input.checked && !wasDone) {
        state.xp += 80;
        state.coins += 25;
      }

      saveProfileState(state);
      renderProfileState();
    });
  });

  document.querySelectorAll('[data-wishlist-vote]').forEach(button => {
    button.addEventListener('click', () => {
      const state = loadProfileState();
      const game = button.dataset.wishlistVote;
      state.votes[game] = (state.votes[game] || 0) + 1;
      state.xp += 10;
      saveProfileState(state);
      renderProfileState();
    });
  });

  document.querySelector('#dailyChestButton')?.addEventListener('click', () => {
    const state = loadProfileState();
    const today = new Date().toLocaleDateString('ru-RU');
    const status = document.querySelector('#dailyChestStatus');

    if (state.claimedChestDate === today) {
      if (status) {
        status.textContent = 'Сегодняшний сундук уже открыт. Возвращайся завтра.';
      }
      return;
    }

    state.claimedChestDate = today;
    state.coins += 50;
    state.xp += 35;
    saveProfileState(state);
    renderProfileState();

    if (status) {
      status.textContent = '+50 FlatCoins и +35 XP за вход сегодня.';
    }
  });

  document.querySelector('#profileAiForm')?.addEventListener('submit', event => {
    event.preventDefault();

    const mood = document.querySelector('#profileMoodInput').value;
    const time = Number(document.querySelector('#profileTimeInput').value);
    const result = document.querySelector('#profileAiResult');
    const recommendations = {
      story: time >= 180 ? 'Red Dead Redemption 2' : 'Cyberpunk 2077',
      coop: time >= 90 ? 'Sea of Thieves' : 'Phasmophobia',
      short: time >= 90 ? 'Hades II' : 'Portal 2',
    };

    result.innerHTML = `
      <strong>${recommendations[mood]}</strong>
      <p>Подборка учитывает настроение, доступное время и игры, которые уже есть в Steam 2.0.</p>
    `;

    addProfileReward({ xp: 15, coins: 5 });
  });
}

initProfilePage();

const virtualModeStorageKey = 'steam2VirtualMode';
const virtualSaleGames = [
  ['cyberpunk-2077', 'Cyberpunk 2077', 2999, 599, 80, 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/capsule_231x87.jpg'],
  ['baldurs-gate-3', "Baldur's Gate 3", 2499, 1249, 50, 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/capsule_231x87.jpg'],
  ['elden-ring', 'ELDEN RING', 2999, 899, 70, 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/capsule_231x87.jpg'],
  ['portal-2', 'Portal 2', 259, 26, 90, 'https://cdn.akamai.steamstatic.com/steam/apps/620/capsule_231x87.jpg'],
  ['stardew-valley', 'Stardew Valley', 399, 159, 60, 'https://cdn.akamai.steamstatic.com/steam/apps/413150/capsule_231x87.jpg'],
  ['sea-of-thieves', 'Sea of Thieves', 1499, 449, 70, 'https://cdn.akamai.steamstatic.com/steam/apps/1172620/capsule_231x87.jpg'],
  ['phasmophobia', 'Phasmophobia', 599, 239, 60, 'https://cdn.akamai.steamstatic.com/steam/apps/739630/capsule_231x87.jpg'],
  ['fallout-new-vegas', 'Fallout: New Vegas', 399, 79, 80, 'https://cdn.akamai.steamstatic.com/steam/apps/22380/capsule_231x87.jpg'],
].map(([id, title, price, salePrice, discount, image]) => ({
  id,
  title,
  price,
  salePrice,
  discount,
  image,
}));

const buyerAchievements = [
  ['forgot', 'Забыл, что купил', 'Купить игру, которая уже лежит в виртуальной библиотеке.', 'Rare', 1, 300, state => state.duplicateBuys],
  ['dust', 'Коллекционер пыли', 'Собрать 10 игр без единого запуска.', 'Epic', 10, 700, state => state.library.filter(game => !game.launched).length],
  ['sale-victim', 'Жертва распродажи', 'Купить 5 игр за один день скидок.', 'Epic', 5, 500, state => state.purchasesToday],
  ['spender', 'Транжира', 'Потратить весь баланс одной оплатой.', 'Legendary', 1, 1000, state => state.spentAllClicks],
  ['loyal', 'Верный клиент Гейба', 'Заходить на сайт 7 дней подряд.', 'Legendary', 7, 777, state => state.loginStreak],
].map(([id, title, description, rarity, goal, reward, progress]) => ({
  id,
  title,
  description,
  rarity,
  goal,
  reward,
  progress,
}));

const defaultMarketLots = [
  {
    id: 'bot-hades-2',
    title: 'Hades II',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/1145350/capsule_231x87.jpg',
    price: 640,
    history: [980, 820, 760, 690, 640],
  },
  {
    id: 'bot-doom-eternal',
    title: 'DOOM Eternal',
    image: 'https://cdn.akamai.steamstatic.com/steam/apps/782330/capsule_231x87.jpg',
    price: 520,
    history: [700, 620, 590, 540, 520],
  },
];

const defaultVirtualModeState = {
  balance: 10000,
  cart: [],
  library: [],
  history: [],
  gifts: [],
  marketListings: [],
  achievements: {},
  purchaseDay: '',
  purchasesToday: 0,
  totalSpent: 0,
  duplicateBuys: 0,
  spentAllClicks: 0,
  loginStreak: 0,
  lastVisitDate: '',
  lastGiftDate: '',
  lastBonusDate: '',
  coupon: 0,
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadVirtualModeState() {
  try {
    const savedState =
      JSON.parse(localStorage.getItem(virtualModeStorageKey)) || {};
    return {
      ...defaultVirtualModeState,
      ...savedState,
      cart: savedState.cart || [],
      library: savedState.library || [],
      history: savedState.history || [],
      gifts: savedState.gifts || [],
      marketListings: savedState.marketListings || [],
      achievements: savedState.achievements || {},
    };
  } catch {
    return { ...defaultVirtualModeState };
  }
}

function saveVirtualModeState(state) {
  localStorage.setItem(virtualModeStorageKey, JSON.stringify(state));
}

function formatVirtualMoney(value) {
  return `${Number(value).toLocaleString('ru-RU')} VC`;
}

function virtualGame(id) {
  return virtualSaleGames.find(game => game.id === id);
}

function isPreviousDay(previous, current) {
  if (!previous) return false;
  const date = new Date(`${previous}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10) === current;
}

function prepareVirtualState() {
  const state = loadVirtualModeState();
  const today = todayKey();

  if (state.lastVisitDate !== today) {
    state.loginStreak = isPreviousDay(state.lastVisitDate, today)
      ? state.loginStreak + 1
      : 1;
    state.lastVisitDate = today;
  }

  if (state.purchaseDay !== today) {
    state.purchaseDay = today;
    state.purchasesToday = 0;
  }

  unlockBuyerAchievements(state);
  saveVirtualModeState(state);
  return state;
}

function virtualCartTotal(state) {
  const subtotal = state.cart.reduce((sum, id) => {
    const game = virtualGame(id);
    return sum + (game?.salePrice || 0);
  }, 0);

  return state.coupon > 0
    ? Math.round(subtotal * ((100 - state.coupon) / 100))
    : subtotal;
}

function addVirtualHistory(state, text, type = 'purchase') {
  state.history.unshift({
    id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    text,
    date: new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  });
  state.history = state.history.slice(0, 16);
}

function addVirtualLibraryGame(state, game, source = 'purchase') {
  state.library.unshift({
    instanceId: `${game.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    id: game.id,
    title: game.title,
    image: game.image,
    source,
    launched: false,
    boughtAt: Date.now(),
  });
}

function unlockBuyerAchievements(state) {
  buyerAchievements.forEach(achievement => {
    const progress = achievement.progress(state);
    if (progress < achievement.goal || state.achievements[achievement.id]) {
      return;
    }

    state.achievements[achievement.id] = {
      unlockedAt: Date.now(),
      reward: achievement.reward,
    };
    state.balance += achievement.reward;
    addVirtualHistory(
      state,
      `Ачивка "${achievement.title}" открыта. Бонус: ${formatVirtualMoney(
        achievement.reward,
      )}.`,
      'achievement',
    );
  });
}

function renderBuyerAchievements(container, state) {
  if (!container) return;

  container.replaceChildren();

  buyerAchievements.forEach(achievement => {
    const progress = Math.min(achievement.goal, achievement.progress(state));
    const unlocked = Boolean(state.achievements[achievement.id]);
    const item = document.createElement('article');
    item.className = `achievement-item ${unlocked ? 'is-unlocked' : ''}`;
    item.innerHTML = `
      <span>${achievement.rarity}</span>
      <strong>${achievement.title}</strong>
      <p>${achievement.description}</p>
      <div><i style="width: ${(progress / achievement.goal) * 100}%"></i></div>
      <small>${
        unlocked
          ? `Открыто, бонус ${formatVirtualMoney(achievement.reward)}`
          : `${progress} / ${achievement.goal}`
      }</small>
    `;
    container.append(item);
  });
}

function renderVirtualCatalog(state) {
  const catalog = document.querySelector('#virtualSaleCatalog');
  if (!catalog) return;

  catalog.replaceChildren();
  virtualSaleGames.forEach(game => {
    const row = document.createElement('article');
    row.className = 'virtual-sale-row';
    row.innerHTML = `
      <img src="${game.image}" alt="${game.title}">
      <div>
        <h3>${game.title}</h3>
        <p>Было ${formatVirtualMoney(game.price)}. Купи сейчас и, возможно, никогда не запусти.</p>
      </div>
      <div class="virtual-price-stack">
        <span class="virtual-discount">-${game.discount}%</span>
        <span class="virtual-old-price">${formatVirtualMoney(game.price)}</span>
        <strong class="virtual-current-price">${formatVirtualMoney(game.salePrice)}</strong>
        <button type="button" data-virtual-add="${game.id}">${
          state.cart.includes(game.id) ? 'Еще копию' : 'В виртуальную корзину'
        }</button>
      </div>
    `;
    catalog.append(row);
  });
}

function renderVirtualCart(state) {
  const list = document.querySelector('#virtualCartItems');
  const total = document.querySelector('#virtualCartTotal');
  const summary = document.querySelector('#virtualCartSummary');
  if (!list || !total) return;

  list.replaceChildren();

  if (state.cart.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'virtual-empty';
    empty.textContent = 'Корзина пустая. Гейб слегка разочарован.';
    list.append(empty);
  } else {
    state.cart.forEach((id, index) => {
      const game = virtualGame(id);
      const item = document.createElement('div');
      item.className = 'virtual-cart-item';
      item.innerHTML = `
        <span>${game?.title || 'Неизвестная игра'}</span>
        <strong>${formatVirtualMoney(game?.salePrice || 0)}</strong>
        <button type="button" data-virtual-remove="${index}">x</button>
      `;
      list.append(item);
    });
  }

  total.textContent = formatVirtualMoney(virtualCartTotal(state));
  if (summary) {
    summary.textContent = `${state.cart.length} товаров`;
    if (state.coupon > 0) summary.textContent += `, купон -${state.coupon}%`;
  }
}

function renderMarketListings(state) {
  const list = document.querySelector('#marketListings');
  const select = document.querySelector('#marketGameSelect');
  if (!list || !select) return;

  list.replaceChildren();
  select.replaceChildren();

  const listed = new Set(state.marketListings.map(lot => lot.instanceId));
  const sellable = state.library.filter(game => !listed.has(game.instanceId));

  if (sellable.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Нет лишних игр для продажи';
    select.append(option);
  } else {
    sellable.forEach(game => {
      const option = document.createElement('option');
      option.value = game.instanceId;
      option.textContent = game.title;
      select.append(option);
    });
  }

  [...state.marketListings, ...defaultMarketLots].forEach(lot => {
    const card = document.createElement('article');
    card.className = 'market-card';
    card.innerHTML = `
      <img src="${lot.image}" alt="${lot.title}">
      <div>
        <strong>${lot.title}</strong>
        <span>${formatVirtualMoney(lot.price)}</span>
        <div class="market-history">
          ${lot.history
            .map(
              value =>
                `<i style="height: ${Math.max(18, Math.min(100, value / 12))}%"></i>`,
            )
            .join('')}
        </div>
      </div>
      <button type="button" data-market-lot="${lot.id}">${
        lot.owner === 'you' ? 'Продать боту' : 'Купить лот'
      }</button>
    `;
    list.append(card);
  });
}

function renderGabenMode() {
  if (!document.querySelector('.gaben-page')) return;

  const state = prepareVirtualState();
  const balance = document.querySelector('#virtualBalance');
  const status = document.querySelector('#virtualCheckoutStatus');

  if (balance) balance.textContent = formatVirtualMoney(state.balance);
  if (status && state.balance <= 0) {
    status.textContent = 'Баланс закончился. Забери ежедневный бонус или подарок Гейба.';
  }

  renderVirtualCatalog(state);
  renderVirtualCart(state);
  renderMarketListings(state);
  renderBuyerAchievements(document.querySelector('#gabenAchievements'), state);
}

function renderBuyerProfile() {
  if (!document.querySelector('.buyer-profile-page')) return;

  const state = prepareVirtualState();
  const unlockedCount = Object.keys(state.achievements).length;
  const dustCount = state.library.filter(game => !game.launched).length;
  const setText = (selector, text) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  };

  setText('#profileVirtualBalance', formatVirtualMoney(state.balance));
  setText('#profileVirtualLibraryCount', state.library.length);
  setText('#profileDustCount', dustCount);
  setText('#profileLoginStreak', state.loginStreak);
  setText('#profileTotalSpent', formatVirtualMoney(state.totalSpent));
  setText('#profileGiftCount', state.gifts.length);
  setText(
    '#profileBuyerTitle',
    unlockedCount >= 3 ? 'Гейб доволен' : 'Охота только начинается',
  );
  setText(
    '#profileBuyerStory',
    state.library.length === 0
      ? 'Купи первую виртуальную игру, чтобы профиль начал считать твой путь.'
      : `В библиотеке ${state.library.length} игр, из них ${dustCount} еще ни разу не запускались.`,
  );

  const progress = document.querySelector('#profileBuyerProgress');
  if (progress) {
    progress.style.width = `${(unlockedCount / buyerAchievements.length) * 100}%`;
  }

  renderBuyerAchievements(
    document.querySelector('#profileBuyerAchievements'),
    state,
  );
  renderBuyerHistory('#profileRecentPurchases', state.history, [
    'purchase',
    'market',
  ]);
  renderBuyerHistory('#profileGabenHistory', state.gifts);
}

function renderBuyerHistory(selector, items, types) {
  const container = document.querySelector(selector);
  if (!container) return;

  const visibleItems = (types
    ? items.filter(item => types.includes(item.type))
    : items
  ).slice(0, 6);

  container.replaceChildren();

  if (visibleItems.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Пока пусто.';
    container.append(empty);
    return;
  }

  visibleItems.forEach(item => {
    const row = document.createElement('article');
    row.innerHTML = `<strong>${item.text}</strong><span>${item.date}</span>`;
    container.append(row);
  });
}

function refreshVirtualViews() {
  renderGabenMode();
  renderBuyerProfile();
}

function buyVirtualCart() {
  const state = prepareVirtualState();
  const status = document.querySelector('#virtualCheckoutStatus');
  const total = virtualCartTotal(state);

  if (state.cart.length === 0) {
    if (status) status.textContent = 'Сначала добавь игру в корзину.';
    return;
  }

  if (total > state.balance) {
    if (status) {
      status.textContent =
        'Не хватает виртуальных денег. Попробуй ежедневный бонус или подарок Гейба.';
    }
    return;
  }

  const duplicateBought = state.cart.some(id =>
    state.library.some(game => game.id === id),
  );
  const titles = [];

  if (duplicateBought) state.duplicateBuys += 1;
  if (state.balance - total === 0) state.spentAllClicks += 1;

  state.balance -= total;
  state.totalSpent += total;
  state.purchasesToday += state.cart.length;

  state.cart.forEach(id => {
    const game = virtualGame(id);
    if (!game) return;
    titles.push(game.title);
    addVirtualLibraryGame(state, game);
  });

  state.cart = [];
  state.coupon = 0;
  addVirtualHistory(
    state,
    `Куплено: ${titles.join(', ')} за ${formatVirtualMoney(total)}.`,
  );
  unlockBuyerAchievements(state);
  saveVirtualModeState(state);
  if (status) {
    status.textContent = 'Покупка прошла. Игры уже пылятся в виртуальной библиотеке.';
  }
  refreshVirtualViews();
}

function openGabenGift() {
  const state = prepareVirtualState();
  const today = todayKey();
  const status = document.querySelector('#gabenGiftStatus');
  const box = document.querySelector('#gabenGiftBox');

  if (state.lastGiftDate === today) {
    if (status) status.textContent = 'Гейб уже благословлял тебя сегодня.';
    return;
  }

  const gifts = [
    { type: 'money', amount: 1200 },
    { type: 'coupon', amount: 40 },
    { type: 'game', game: virtualSaleGames[3] },
    { type: 'game', game: virtualSaleGames[7] },
  ];
  const gift = gifts[Math.floor(Math.random() * gifts.length)];
  let text = '';

  state.lastGiftDate = today;

  if (gift.type === 'money') {
    state.balance += gift.amount;
    text = `Гейб благословил тебя: ${formatVirtualMoney(gift.amount)}.`;
  }

  if (gift.type === 'coupon') {
    state.coupon = Math.max(state.coupon, gift.amount);
    text = `Гейб выдал купон -${gift.amount}% на следующую корзину.`;
  }

  if (gift.type === 'game') {
    addVirtualLibraryGame(state, gift.game, 'gift');
    text = `Гейб благословил тебя игрой ${gift.game.title}.`;
  }

  state.gifts.unshift({
    id: `gift-${Date.now()}`,
    text,
    date: new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  });
  state.gifts = state.gifts.slice(0, 12);
  addVirtualHistory(state, text, 'gift');
  unlockBuyerAchievements(state);
  saveVirtualModeState(state);

  if (box) {
    box.classList.remove('is-opening');
    window.requestAnimationFrame(() => box.classList.add('is-opening'));
  }
  if (status) status.textContent = text;
  refreshVirtualViews();
}

function claimDailyBonus() {
  const state = prepareVirtualState();
  const today = todayKey();
  const status = document.querySelector('#virtualCheckoutStatus');

  if (state.lastBonusDate === today) {
    if (status) status.textContent = 'Ежедневный бонус уже забран.';
    return;
  }

  state.lastBonusDate = today;
  state.balance += 1000;
  addVirtualHistory(state, 'Ежедневный бонус: +1000 VC.', 'bonus');
  saveVirtualModeState(state);
  if (status) status.textContent = 'Ежедневный бонус начислен: +1000 VC.';
  refreshVirtualViews();
}

function listMarketGame(event) {
  event.preventDefault();

  const state = prepareVirtualState();
  const select = document.querySelector('#marketGameSelect');
  const price = Number(document.querySelector('#marketPriceInput').value) || 1;
  const game = state.library.find(item => item.instanceId === select.value);

  if (!game) return;

  state.marketListings.unshift({
    id: `user-lot-${Date.now()}`,
    owner: 'you',
    instanceId: game.instanceId,
    title: game.title,
    image: game.image,
    price,
    history: [Math.round(price * 1.25), Math.round(price * 1.1), price],
  });
  addVirtualHistory(
    state,
    `${game.title} выставлена на маркет за ${formatVirtualMoney(price)}.`,
    'market',
  );
  saveVirtualModeState(state);
  refreshVirtualViews();
}

function buyMarketLot(lotId) {
  const state = prepareVirtualState();
  const status = document.querySelector('#virtualCheckoutStatus');
  const ownLot = state.marketListings.find(lot => lot.id === lotId);
  const botLot = defaultMarketLots.find(lot => lot.id === lotId);
  const lot = ownLot || botLot;

  if (!lot) return;

  if (ownLot) {
    state.library = state.library.filter(
      game => game.instanceId !== ownLot.instanceId,
    );
    state.marketListings = state.marketListings.filter(
      item => item.id !== ownLot.id,
    );
    state.balance += ownLot.price;
    addVirtualHistory(state, `Продано на маркете: ${ownLot.title}.`, 'market');
    saveVirtualModeState(state);
    refreshVirtualViews();
    return;
  }

  if (lot.price > state.balance) {
    if (status) status.textContent = 'На этот лот не хватает виртуальных денег.';
    return;
  }

  state.balance -= lot.price;
  state.totalSpent += lot.price;
  addVirtualLibraryGame(state, lot, 'market');
  addVirtualHistory(state, `Куплен маркет-лот: ${lot.title}.`, 'market');
  unlockBuyerAchievements(state);
  saveVirtualModeState(state);
  refreshVirtualViews();
}

function initGabenMode() {
  if (!document.querySelector('.gaben-page')) return;

  renderGabenMode();

  document.querySelector('#virtualSaleCatalog')?.addEventListener('click', event => {
    const button = event.target.closest('[data-virtual-add]');
    if (!button) return;
    const state = prepareVirtualState();
    state.cart.push(button.dataset.virtualAdd);
    saveVirtualModeState(state);
    renderGabenMode();
  });

  document.querySelector('#virtualCartItems')?.addEventListener('click', event => {
    const button = event.target.closest('[data-virtual-remove]');
    if (!button) return;
    const state = prepareVirtualState();
    state.cart.splice(Number(button.dataset.virtualRemove), 1);
    saveVirtualModeState(state);
    renderGabenMode();
  });

  document
    .querySelector('#virtualBuyButton')
    ?.addEventListener('click', buyVirtualCart);
  document
    .querySelector('#gabenGiftButton')
    ?.addEventListener('click', openGabenGift);
  document
    .querySelector('#dailyBonusButton')
    ?.addEventListener('click', claimDailyBonus);
  document
    .querySelector('#marketSellForm')
    ?.addEventListener('submit', listMarketGame);
  document.querySelector('#marketListings')?.addEventListener('click', event => {
    const button = event.target.closest('[data-market-lot]');
    if (button) buyMarketLot(button.dataset.marketLot);
  });

  window.setInterval(() => {
    const countdown = document.querySelector('#saleCountdown');
    if (!countdown) return;
    const secondsLeft = 7200 - Math.floor((Date.now() / 1000) % 7200);
    const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
    const seconds = String(Math.floor(secondsLeft % 60)).padStart(2, '0');
    countdown.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);
}

function initBuyerProfilePage() {
  if (!document.querySelector('.buyer-profile-page')) return;
  renderBuyerProfile();
}

initGabenMode();
initBuyerProfilePage();
