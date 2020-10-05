'use strict';

const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const TIME_VALUES = [`12:00`, `13:00`, `14:00`];
const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const TYPES = [`palace`, `flat`, `house`, `bungalow`];
const PINS_QUANTITY = 8;
let elements = [];
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const pinsContainer = document.querySelector(`.map__pins`);
const fragment = document.createDocumentFragment();

const getRandomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getRandomIndex = (items) => getRandomNumber(0, items.length - 1);

const getDataElements = (elementsQuantity) => {
  for (let i = 0; i < elementsQuantity; i++) {
    let element = {};
    element.author = {};
    element.author.avatar = `img/avatars/user0${i + 1}.png`;
    element.offer = {};
    element.offer.title = `строка, заголовок предложения`;
    element.offer.price = `число, стоимость`;
    element.offer.type = TYPES[getRandomIndex(TYPES)];
    element.offer.rooms = `число, количество комнат`;
    element.offer.guests = `число, количество гостей`;
    element.offer.checkin = TIME_VALUES[getRandomIndex(TIME_VALUES)];
    element.offer.checkout = TIME_VALUES[getRandomIndex(TIME_VALUES)];

    // не понимаю почему в консоль ок выводится массив , а в обьекте пустой
    element.offer.features = FEATURES.splice(getRandomIndex(FEATURES), getRandomIndex(FEATURES) + 1);
    element.offer.description = `строка с описанием`;
    element.offer.photos = PHOTOS.splice(getRandomIndex(PHOTOS), getRandomIndex(PHOTOS) + 1);
    element.location = {};
    element.location.x = getRandomNumber(0, pinsContainer.offsetWidth);
    element.location.y = getRandomNumber(130, 630);
    element.offer.address = `${element.location.x},${element.location.y}`;

    elements.push(element);
  }
  return elements;
};

getDataElements(PINS_QUANTITY);

const renderPin = (element) => {
  let pin = pinTemplate.cloneNode(true);

  pin.style = `left: ${element.location.x + pinTemplate.offsetWidth}px; top:${element.location.y + pinTemplate.offsetHeight}px;`;
  pin.querySelector(`img`).src = element.author.avatar;
  pin.querySelector(`img`).alt = element.offer.title;

  return pin;
};

const renderFragment = (items) => {
  for (let i = 0; i < items.length; i++) {
    fragment.appendChild(renderPin(items[i]));
  }
};

renderFragment(elements);

pinsContainer.appendChild(fragment);

document.querySelector(`.map`).classList.remove(`map--faded`);
