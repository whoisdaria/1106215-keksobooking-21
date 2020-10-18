'use strict';

const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const TIME_VALUES = [`12:00`, `13:00`, `14:00`];
const PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const TYPES = [`palace`, `flat`, `house`, `bungalow`];
// const TYPES_IN_RUSSIAN = {
//   flat: `Квартира`,
//   house: `Дом`,
//   bungalow: `Бунгало`,
//   palace: `Дворец`
// };
const PINS_QUANTITY = 8;
const TITLE_MIN_LENGTH = 30;
const TITLE_MAX_LENGTH = 100;
const elements = [];
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
// const cardTemplate = document.querySelector(`#card`).content.querySelector(`.popup`);
const pinsContainer = document.querySelector(`.map__pins`);
const map = document.querySelector(`.map`);
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

const offActiveMode = () => {
  adFormHeader.setAttribute(`disabled`, `disabled`);
  adFormElements.forEach((element) => {
    element.setAttribute(`disabled`, `disabled`);
  });
  mapFilters.forEach((element) => {
    element.setAttribute(`disabled`, `disabled`);
  });
};

offActiveMode();

// активный режим

const onActiveMode = () => {
  map.classList.remove(`map--faded`);
  adForm.classList.remove(`ad-form--disabled`);
  adFormHeader.removeAttribute(`disabled`, `disabled`);
  adFormElements.forEach((element) => {
    element.removeAttribute(`disabled`, `disabled`);
  });
  mapFilters.forEach((element) => {
    element.removeAttribute(`disabled`, `disabled`);
  });
  renderPins(pinsContainer, fragmentPins);
};

mainPin.addEventListener(`mousedown`, (evt) => {
  if (evt.which === 1) {
    onActiveMode();
  }
});

mainPin.addEventListener(`keydown`, (evt) => {
  if (evt.key === `Enter`) {
    onActiveMode();
  }
});

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
  if (typeApartment.value === `bungalow`) {
    priceApartment.min = `0`;
    priceApartment.placeholder = `0`;
  } else if (typeApartment.value === `flat`) {
    priceApartment.min = `1000`;
    priceApartment.placeholder = `1000`;
  } else if (typeApartment.value === `house`) {
    priceApartment.min = `5000`;
    priceApartment.placeholder = `5000`;
  } else if (typeApartment.value === `palace`) {
    priceApartment.min = `10000`;
    priceApartment.placeholder = `10000`;
  }
};
setApartmentMinPrice();

typeApartment.addEventListener(`change`, () => {
  setApartmentMinPrice();
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
      if (option.value !== rooms.value) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    });
  }
  if (rooms.value === `2`) {
    capacity.value = rooms.value;
    capacityOptions.forEach((option) => {
      if (option.value !== rooms.value && option.value !== `1`) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    });
  }
  if (rooms.value === `3`) {
    capacity.value = rooms.value;
    capacityOptions.forEach((option) => {
      if (option.value !== rooms.value && option.value !== `1` && option.value !== `2`) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    });
  }
  if (rooms.value === `100`) {
    capacity.value = `0`;
    capacityOptions.forEach((option) => {
      if (option.value !== `0`) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    });
  }
};
setRoomCapacity();

rooms.addEventListener(`change`, () => {
  setRoomCapacity();
});

// валидация поля адреса

const getPinLocatoin = (pinElement) => {
  if (map.classList.contains(`map--faded`)) {
    return `${Math.round(pinElement.getBoundingClientRect().left + pinElement.getBoundingClientRect().width / 2)}, ${Math.round((pinElement.getBoundingClientRect().top + pageYOffset) + pinElement.getBoundingClientRect().height / 2)}`;
  } else {
    return `${Math.round(pinElement.getBoundingClientRect().left + pinElement.getBoundingClientRect().width / 2)}, ${Math.round((pinElement.getBoundingClientRect().top + pageYOffset) + pinElement.getBoundingClientRect().height)}`;
  }
};

const setAddress = () => {
  addressField.disabled = true;
  addressField.value = getPinLocatoin(mainPin);
};

setAddress();

//

const getRandomNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getRandomIndex = (items) => getRandomNumber(0, items.length - 1);

// const removeExtraItems = (items) => {
//   while (items.firstChild) {
//     items.removeChild(items.firstChild);
//   }
// };

// const hideEmptyBlock = (items, block) => {
//   if (items.length === 0) {
//     block.style.display = `none`;
//   }
// };

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

const renderPin = (element) => {
  const pin = pinTemplate.cloneNode(true);

  pin.style.left = `${element.location.x + pinTemplate.offsetWidth / 2}px`;
  pin.style.top = `${element.location.y + pinTemplate.offsetHeight}px`;
  pin.querySelector(`img`).src = element.author.avatar;
  pin.querySelector(`img`).alt = element.offer.title;

  return pin;
};

// const renderCard = (element) => {
//   const card = cardTemplate.cloneNode(true);

//   const cardFeatures = card.querySelector(`.popup__features`);
//   const feature = card.querySelector(`.popup__feature`);
//   const cardPhotos = card.querySelector(`.popup__photos`);
//   const photo = card.querySelector(`.popup__photo`);

//   card.querySelector(`.popup__title`).textContent = element.offer.title;
//   card.querySelector(`.popup__text--address`).textContent = element.offer.address;
//   card.querySelector(`.popup__text--price`).textContent = `${element.offer.price}₽/ночь`;
//   card.querySelector(`.popup__type`).textContent = TYPES_IN_RUSSIAN[element.offer.type];
//   card.querySelector(`.popup__text--capacity`).textContent = `${element.offer.rooms} комнаты для ${element.offer.guests} гостей.`;
//   card.querySelector(`.popup__text--time`).textContent = `Заезд после ${element.offer.checkin}, выезд до ${element.offer.checkout}.`;
//   card.querySelector(`.popup__description`).textContent = element.offer.description;
//   card.querySelector(`.popup__avatar`).src = element.author.avatar;

//   //  features

//   removeExtraItems(cardFeatures);

//   for (let i = 0; i < element.offer.features.length; i++) {
//     const featureElement = feature.cloneNode(true);
//     featureElement.className = `popup__feature popup__feature--${element.offer.features[i]}`;
//     cardFeatures.appendChild(featureElement);
//   }

//   hideEmptyBlock(element.offer.features, cardFeatures);

//   //  photos

//   removeExtraItems(cardPhotos);

//   for (let i = 0; i < element.offer.photos.length; i++) {
//     const photoElement = photo.cloneNode(true);
//     photoElement.src = element.offer.photos[i];
//     cardPhotos.appendChild(photoElement);
//   }

//   hideEmptyBlock(element.offer.photos, cardPhotos);

//   return card;
// };

const renderFragmentPins = (items) => {
  for (let i = 0; i < items.length; i++) {
    fragmentPins.appendChild(renderPin(items[i]));
  }
};
renderFragmentPins(elements);

const renderPins = (container, dataFragment) => {
  container.appendChild(dataFragment);
};


//  render first card

// map.insertBefore(renderCard(elements[0]), map.querySelector(`.map__filters-container`));
