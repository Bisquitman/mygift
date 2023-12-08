const API_URL = `https://mysterious-gorgeous-sodalite.glitch.me`;

const card = document.querySelector(".card");
const cardInner = document.querySelector(".card__inner");
const cardTitle = document.querySelector(".card__title");
const cardContacts = document.querySelector(".card__contacts");

const cardFrontImage = document.querySelector(".card__front-image");
const cardFrom = document.querySelector(".card__from");
const cardTo = document.querySelector(".card__to");
const cardMessage = document.querySelector(".card__message");

//========================================================================================================================================================

// Перемещение блока с контактами в зависимости от разрешения
const rearrangeElement = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 580) {
    card.after(cardContacts);
  } else {
    cardTitle.after(cardContacts);
  }
};

// Получение id открытки
const getIdFromUrl = () => {
  const params = new URLSearchParams(location.search);
  return params.get("id");
};
//========================================================================================================================================================

// Получение данных для показа открытки
const getGiftData = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/gift/${id}`);

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Открытка не найдена`);
    }
  } catch (error) {
    console.error(`Ошибка: ${error}`);
  }
};
//========================================================================================================================================================

const init = async () => {
  // Перемещение блока с контактами в зависимости от разрешения
  rearrangeElement();
  window.addEventListener("resize", rearrangeElement);
  //========================================================================================================================================================

  // Поворот карточки по клику
  card.addEventListener("click", (e) => {
    cardInner.classList.toggle("_rotate");
  });
  //========================================================================================================================================================
  // todo Сделать preloader перед получением открытки
  const id = getIdFromUrl(); // id открытки

  if (id) {
    const data = await getGiftData(id);

    if (data) {
      cardFrontImage.src = `./img/cards/${data.card}.jpg`;
      cardFrom.textContent = data.sender_name;
      cardTo.textContent = data.recipient_name;
      const formattedMessage = data.message.replaceAll('\n', '<br>');
      cardMessage.innerHTML = formattedMessage;
    } else {
      // todo Вывести сообщение, если данные не пришли
    }
  }

  
};
init();
