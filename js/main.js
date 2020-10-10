'use strict';

const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const TIME_VALUES = [`12:00`, `13:00`, `14:00`];
const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const TYPES = [`palace`, `flat`, `house`, `bungalow`];
const PINS_QUANTITY = 8;
const elements = [];
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.popup`);
const pinsContainer = document.querySelector(`.map__pins`);
const map = document.querySelector(`.map`);
const fragmentPins = document.createDocumentFragment();
const fragmentCards = document.createDocumentFragment();

const getRandomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getRandomIndex = (items) => getRandomNumber(0, items.length - 1);

const getDataElements = (elementsQuantity) => {
  for (let i = 0; i < elementsQuantity; i++) {
    const element = {};
    element.author = {};
    element.author.avatar = `img/avatars/user0${i + 1}.png`;
    element.offer = {};
    element.offer.title = `строка, заголовок предложения`;
    element.offer.price = getRandomNumber(1000, 1e6);
    element.offer.type = TYPES[getRandomIndex(TYPES)];
    element.offer.rooms = `число`;
    element.offer.guests = `число`;
    element.offer.checkin = TIME_VALUES[getRandomIndex(TIME_VALUES)];
    element.offer.checkout = TIME_VALUES[getRandomIndex(TIME_VALUES)];
    element.offer.features = FEATURES.slice(getRandomIndex(FEATURES));
    element.offer.description = `строка с описанием`;
    element.offer.photos = `http://o0.github.io/assets/images/tokyo/hotel${getRandomIndex(PHOTOS) + 1}.jpg`;
    element.location = {};
    element.location.x = getRandomNumber(0, pinsContainer.offsetWidth);
    element.location.y = getRandomNumber(130, 630);
    element.offer.address = `${element.location.x},${element.location.y}`;

    elements.push(element);
  }
};

getDataElements(PINS_QUANTITY);

const renderPin = (element) => {
  const pin = pinTemplate.cloneNode(true);

  pin.style.left = `${element.location.x + pinTemplate.offsetWidth / 2}px`;
  pin.style.top = `${element.location.y + pinTemplate.offsetHeight}px`;
  pin.querySelector(`img`).src = element.author.avatar;
  pin.querySelector(`img`).alt = element.offer.title;

  return pin;
};


const renderCard = (element) => {
  const card = cardTemplate.cloneNode(true);
  const getType = (value) => {
    if (value === 'flat') return 'Квартира';
    if (value === 'house') return 'Дом';
    if (value === 'bungalow') return 'Бунгало';
    if (value === 'palace') return 'Дворец';
  }

  card.querySelector('.popup__title').textContent = element.offer.title;
  card.querySelector('.popup__text--address').textContent = element.offer.address;
  card.querySelector('.popup__text--price').textContent = `${element.offer.price}₽/ночь`;
  card.querySelector('.popup__type').textContent = getType(element.offer.type);
  card.querySelector('.popup__text--capacity').textContent = `${element.offer.rooms} комнаты для ${element.offer.guests} гостей.`;
  card.querySelector('.popup__text--time').textContent = `Заезд после ${element.offer.checkin}, выезд до ${element.offer.checkout}.`;
  card.querySelector('.popup__features').textContent = element.offer.features;
  card.querySelector('.popup__description').textContent = element.offer.description;
  card.querySelector('.popup__photo').src = element.offer.photos;
  card.querySelector('.popup__avatar').src = element.author.avatar;

  return card;
}

const renderFragmentPins = (items) => {
  for (let i = 0; i < items.length; i++) {
    fragmentPins.appendChild(renderPin(items[i]));
  }
};
renderFragmentPins(elements);

const renderFragmentCards = (items) => {
  for (let i = 0; i < items.length; i++) {
    fragmentCards.appendChild(renderCard(items[i]));
  }
};
renderFragmentCards(elements);

const renderPins = (container, dataFragment) => {
  container.appendChild(dataFragment);
};

const renderCards = (container, dataFragment, elementBefore) => {
  container.insertBefore(dataFragment, elementBefore);
}

renderPins(pinsContainer, fragmentPins);
renderCards(map, fragmentCards, map.querySelector('.map__filters-container'));

map.classList.remove(`map--faded`);
