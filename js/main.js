'use strict';

const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const TIME_VALUES = [`12:00`, `13:00`, `14:00`];
const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const TYPES = [`palace`, `flat`, `house`, `bungalow`];
const TYPES_IN_RUSSIAN = {
  flat: `Квартира`,
  house: `Дом`,
  bungalow: `Бунгало`,
  palace: `Дворец`
};
const PINS_QUANTITY = 8;
const TITLE_MIN_LENGTH = 30;
const TITLE_MAX_LENGTH = 100;
const TYPE_MIN_PRICE = {
  bungalow: `0`,
  flat: `1000`,
  house: `5000`,
  palace: `10000`
};
const ROOM_CAPACITY = {
  oneRoom: `1`,
  twoRooms: `2`,
  treeRooms: `3`,
  manyRooms: `0`
};
const MAX_PRICE = 1000000;
const elements = [];
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.popup`);
const pinsContainer = document.querySelector(`.map__pins`);
const map = document.querySelector(`.map`);
const filtersContainer = map.querySelector(`.map__filters-container`);
const fragmentPins = document.createDocumentFragment();
const mainPin = document.querySelector(`.map__pin--main`);
const adForm = document.querySelector(`.ad-form`);
const adFormHeader = document.querySelector(`.ad-form-header`);
const adFormElements = document.querySelectorAll(`.ad-form__element`);
const mapFilters = document.querySelectorAll(`.map__filter`);
const formTitle = adForm.querySelector(`#title`);
const typeApartment = adForm.querySelector(`#type`);
const priceApartment = adForm.querySelector(`#price`);
const timeIn = adForm.querySelector(`#timein`);
const timeOut = adForm.querySelector(`#timeout`);
const rooms = adForm.querySelector(`#room_number`);
const capacity = adForm.querySelector(`#capacity`);
const capacityOptions = capacity.querySelectorAll(`option`);
const addressField = adForm.querySelector(`#address`);

// неактивный режим

const removeActiveMode = () => {
  adFormHeader.setAttribute(`disabled`, `disabled`);
  adFormElements.forEach((element) => {
    element.setAttribute(`disabled`, `disabled`);
  });
  mapFilters.forEach((element) => {
    element.setAttribute(`disabled`, `disabled`);
  });
};

removeActiveMode();

// активный режим

const setActiveMode = () => {
  map.classList.remove(`map--faded`);
  adForm.classList.remove(`ad-form--disabled`);
  adFormHeader.removeAttribute(`disabled`, `disabled`);
  adFormElements.forEach((element) => {
    element.removeAttribute(`disabled`, `disabled`);
  });
  mapFilters.forEach((element) => {
    element.removeAttribute(`disabled`, `disabled`);
  });
  mainPin.removeEventListener(`mousedown`, mainPinMousedownHandler);
  mainPin.removeEventListener(`keydown`, mainPinKeydownHandler);
  renderPins(pinsContainer, fragmentPins);
};

const mainPinMousedownHandler = (evt) => {
  if (evt.which === 1) {
    setActiveMode();
  }
};

const mainPinKeydownHandler = (evt) => {
  if (evt.key === `Enter`) {
    setActiveMode();
  }
  mainPin.removeEventListener(`mousedown`, mainPinMousedownHandler);
  mainPin.removeEventListener(`keydown`, mainPinKeydownHandler);
};

mainPin.addEventListener(`mousedown`, mainPinMousedownHandler);
mainPin.addEventListener(`keydown`, mainPinKeydownHandler);

// валидация заголовка

formTitle.addEventListener(`input`, () => {
  const valueLength = formTitle.value.length;
  if (valueLength < TITLE_MIN_LENGTH) {
    formTitle.setCustomValidity(`Необходимо ввести еще ${TITLE_MIN_LENGTH - valueLength} символов`);
  } else if (valueLength > TITLE_MAX_LENGTH) {
    formTitle.setCustomValidity(`Удалите лишние ${TITLE_MAX_LENGTH - valueLength} символов`);
  } else {
    formTitle.setCustomValidity(``);
  }

  formTitle.reportValidity();
});

// валидация минимальной цены

const setApartmentMinPrice = () => {
  priceApartment.min = TYPE_MIN_PRICE[typeApartment.value];
  priceApartment.placeholder = TYPE_MIN_PRICE[typeApartment.value];
};
setApartmentMinPrice();

typeApartment.addEventListener(`change`, () => {
  setApartmentMinPrice();
});

priceApartment.addEventListener(`input`, () => {
  const priceValue = Number(priceApartment.value);
  priceApartment.setCustomValidity(`${(priceValue > MAX_PRICE) ? `Цена за сутки не может превышать ${MAX_PRICE}` : ``}`);

  priceApartment.reportValidity();
});

// валидация времени

const setTimeOut = () => {
  timeOut.value = timeIn.value;
};

const setTimeIn = () => {
  timeIn.value = timeOut.value;
};

timeIn.addEventListener(`change`, () => {
  setTimeOut();
});

timeOut.addEventListener(`change`, () => {
  setTimeIn();
});

// валидация комнат

const setRoomCapacity = () => {
  if (rooms.value === `1`) {
    capacity.value = rooms.value;
    capacityOptions.forEach((option) => {
      option.disabled = (option.value !== rooms.value);
    });
  }
  if (rooms.value === `2`) {
    capacity.value = rooms.value;
    capacityOptions.forEach((option) => {
      option.disabled = (option.value !== rooms.value && option.value !== ROOM_CAPACITY.oneRoom);
    });
  }
  if (rooms.value === `3`) {
    capacity.value = rooms.value;
    capacityOptions.forEach((option) => {
      option.disabled = (option.value !== rooms.value && option.value !== ROOM_CAPACITY.oneRoom && option.value !== ROOM_CAPACITY.twoRooms);
    });
  }
  if (rooms.value === `100`) {
    capacity.value = ROOM_CAPACITY.manyRooms;
    capacityOptions.forEach((option) => {
      option.disabled = (option.value !== ROOM_CAPACITY.manyRooms);
    });
  }
};
setRoomCapacity();

rooms.addEventListener(`change`, () => {
  setRoomCapacity();
});

// валидация поля адреса

const getPinLocatoin = (pinElement) => {
  return `${Math.round(pinElement.getBoundingClientRect().left + pinElement.getBoundingClientRect().width / 2)}, ${Math.round((pinElement.getBoundingClientRect().top + pageYOffset) + pinElement.getBoundingClientRect().height / `${(map.classList.contains(`map--faded`)) ? 2 : 1 }`)}`;
};

const setAddress = () => {
  addressField.readOnly = true;
  addressField.value = getPinLocatoin(mainPin);
};

setAddress();

// get data

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
    element.offer.photos = PHOTOS;
    element.location = {};
    element.location.x = getRandomNumber(0, pinsContainer.offsetWidth);
    element.location.y = getRandomNumber(130, 630);
    element.offer.address = `${element.location.x},${element.location.y}`;

    elements.push(element);
  }
};

getDataElements(PINS_QUANTITY);

// render pin

const renderPin = (element) => {
  const pin = pinTemplate.cloneNode(true);

  pin.style.left = `${element.location.x + pinTemplate.offsetWidth / 2}px`;
  pin.style.top = `${element.location.y + pinTemplate.offsetHeight}px`;
  pin.querySelector(`img`).src = element.author.avatar;
  pin.querySelector(`img`).alt = element.offer.title;

  return pin;
};

// close card

const keydownHandler = (evt) => {
  if (evt.key === `Escape`) {
    closeCard();
  }
};

const closeCard = () => {
  const openedCard = map.querySelector(`.popup`);
  map.querySelector(`.map__pin--active`).classList.remove(`map__pin--active`);
  openedCard.remove();
  window.removeEventListener(`keydown`, keydownHandler);
};

// render card

const renderCard = (element) => {
  const card = cardTemplate.cloneNode(true);

  const cardFeatures = card.querySelector(`.popup__features`);
  const feature = card.querySelector(`.popup__feature`);
  const cardPhotos = card.querySelector(`.popup__photos`);
  const photo = card.querySelector(`.popup__photo`);
  const buttonClose = card.querySelector(`.popup__close`);
  const buttonCloseClickHandler = (evt) => {
    if (evt.target === buttonClose) {
      closeCard();
    }
  };

  buttonClose.addEventListener(`click`, buttonCloseClickHandler);
  window.addEventListener(`keydown`, keydownHandler);

  card.querySelector(`.popup__title`).textContent = element.offer.title;
  card.querySelector(`.popup__text--address`).textContent = element.offer.address;
  card.querySelector(`.popup__text--price`).textContent = `${element.offer.price}₽/ночь`;
  card.querySelector(`.popup__type`).textContent = TYPES_IN_RUSSIAN[element.offer.type];
  card.querySelector(`.popup__text--capacity`).textContent = `${element.offer.rooms} комнаты для ${element.offer.guests} гостей.`;
  card.querySelector(`.popup__text--time`).textContent = `Заезд после ${element.offer.checkin}, выезд до ${element.offer.checkout}.`;
  card.querySelector(`.popup__description`).textContent = element.offer.description;
  card.querySelector(`.popup__avatar`).src = element.author.avatar;

  //  features

  const removeExtraItems = (items) => {
    while (items.firstChild) {
      items.removeChild(items.firstChild);
    }
  };

  const hideEmptyBlock = (items, block) => {
    if (items.length === 0) {
      block.style.display = `none`;
    }
  };

  for (let i = 0; i < element.offer.features.length; i++) {
    const featureElement = feature.cloneNode(true);
    featureElement.className = `popup__feature popup__feature--${element.offer.features[i]}`;
    cardFeatures.appendChild(featureElement);
  }

  removeExtraItems(cardFeatures);
  hideEmptyBlock(element.offer.features, cardFeatures);

  //  photos

  removeExtraItems(cardPhotos);

  for (let i = 0; i < element.offer.photos.length; i++) {
    const photoElement = photo.cloneNode(true);
    photoElement.src = element.offer.photos[i];
    cardPhotos.appendChild(photoElement);
  }
  hideEmptyBlock(element.offer.photos, cardPhotos);

  return card;
};

// render pin

const getPinClickHandler = (pin) => (evt) => {
  const currentPin = evt.target.closest(`.map__pin`);
  const oldCard = document.querySelector(`.popup`);
  if (oldCard) {
    closeCard();
  }
  const card = renderCard(pin);
  currentPin.classList.add(`map__pin--active`);
  map.insertBefore(card, filtersContainer);
};

const renderFragmentPins = (items) => {
  for (let i = 0; i < items.length; i++) {
    const pinClickHandler = getPinClickHandler(items[i]);

    const userPin = renderPin(items[i]);
    fragmentPins.appendChild(userPin);
    userPin.addEventListener(`click`, pinClickHandler);
  }
};
renderFragmentPins(elements);

const renderPins = (container, dataFragment) => {
  container.appendChild(dataFragment);
};
