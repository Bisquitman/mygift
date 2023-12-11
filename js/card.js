const API_URL = `https://mysterious-gorgeous-sodalite.glitch.me`;
// const API_URL = `http://127.0.0.1:3000`;

const card = document.querySelector(".card");
const cardInner = document.querySelector(".card__inner");
const cardTitle = document.querySelector(".card__title");
const cardContacts = document.querySelector(".card__contacts");

const cardFront = document.querySelector(".card__front");
// const cardFrontImage = document.querySelector(".card__front-image");
const cardFrom = document.querySelector(".card__from");
const cardTo = document.querySelector(".card__to");
const cardMessage = document.querySelector(".card__message");

const mediaQuery = window.matchMedia("(max-width: 580px)");

//========================================================================================================================================================
// Preloader
const preload = {
  elem: document.createElement("div"),
  content: `
    <div class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
  `,
  add(container) {
    container.style.position = "relative";
    container.append(this.elem);
  },
  remove(container) {
    setTimeout(() => {
      this.elem.remove();
      container.style = "";
      document.querySelector(".preload")?.remove();
      document.head.querySelector("style#preloader")?.remove();
      document.head.querySelector("script#preloader")?.remove();
    }, 500);
  },
  init() {
    this.elem.className = "preload";
    this.elem.innerHTML = this.content;
  },
};
preload.init();
//========================================================================================================================================================

// Перемещение блока с контактами в зависимости от разрешения
const rearrangeElement = (e) => {
  if (e.matches) {
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
  rearrangeElement(mediaQuery);
  mediaQuery.addEventListener("change", rearrangeElement);
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
      // todo Формировать открытку через JS
      const cardFrontImage = document.createElement("img");
      cardFrontImage.className = "card__front-image";
      cardFrontImage.src = `./img/cards/${data.card}.jpg`;
      cardFront.append(cardFrontImage);

      cardFrom.textContent = data.sender_name;
      cardTo.textContent = data.recipient_name;
      const formattedMessage = data.message.replaceAll("\n", "<br>");
      cardMessage.innerHTML = formattedMessage;
    } else {
      // todo Вывести сообщение, если данные не пришли
      alert("Не удалось получить открытку.\nПопробуйте позже.");
      cardFront.style.backgroundColor = "#fff";
    }
  } else {
    alert("Не удалось получить открытку.\nПроверьте адрес.");
    cardFront.style.backgroundColor = "#fff";
  }
  preload.remove(document.body);
};
init();
