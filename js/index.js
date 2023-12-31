const API_URL = `https://mysterious-gorgeous-sodalite.glitch.me`;
// const API_URL = `http://127.0.0.1:3000`;
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
      this.elem.style = "";
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
try {
  preload.init();
  window.onload = () => {
    preload.remove(document.body);
  };
} catch (error) {
  console.warn(error);
}

try {
  // Slider
  const sliderThumbs = new Swiper(".gift__slider_thumbs", {
    spaceBetween: 12,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
    scrollbar: {
      el: ".swiper-scrollbar",
      hide: false,
      draggable: true,
    },
    breakpoints: {
      320: {
        spaceBetween: 12,
      },
      1024: {
        spaceBetween: 16,
      },
    },
  });

  const sliderCard = new Swiper(".gift__slider_card", {
    spaceBetween: 16,
    speed: 800,
    thumbs: {
      swiper: sliderThumbs,
    },
  });
  //========================================================================================================================================================

  const form = document.querySelector(".gift__form");
  const phoneInputs = form.querySelectorAll(".form__field_phone");
  const submitBtn = form.querySelector(".form__btn");
  const cardInput = form.querySelector(".form__card");

  // Поиск ативного слайда с выбранной открыткой
  const updateCardInput = () => {
    const activeSlide = document.querySelector(".gift__slider_card .swiper-slide-active");
    const cardData = activeSlide.querySelector(".gift__card-image").dataset.card;
    cardInput.value = cardData;
  };
  updateCardInput();

  sliderCard.on("slideChangeTransitionEnd", updateCardInput);
  //========================================================================================================================================================

  // Маска ввода для телефонов
  phoneInputs.forEach((input) => {
    IMask(input, {
      mask: "+{375}(00)000-00-00",
    });
  });
  //========================================================================================================================================================

  // Enable / disable кнопки Отправить
  const updateSubmitBtn = () => {
    let isFormFilled = true;

    for (const field of form.elements) {
      if (field.classList.contains("form__field")) {
        if (!field.value.trim()) {
          isFormFilled = false;
          break;
        }
      }
    }

    submitBtn.disabled = !isFormFilled;
  };
  //========================================================================================================================================================

  // Валидация полей формы и отправка
  const phoneValidateOptions = {
    presence: {
      message: 'Поле "Телефон" обязательно для заполнения',
    },
    format: {
      pattern: "\\+375\\(\\d{2}\\)\\d{3}\\-\\d{2}\\-\\d{2}",
      message: 'Номер телефона должен быть в формате "+375(XX)000-00-00"',
    },
  };

  form.addEventListener("input", updateSubmitBtn);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // todo preloader
    const submitBtnText = submitBtn.textContent;
    submitBtn.textContent = "";
    preload.add(submitBtn);
    submitBtn.querySelector(".preload").style.cssText = `position: static;padding: 0;background-color: transparent;`;

    const errors = validate(form, {
      // sender_phone, recipient_phone - атрибут "name" полей формы, которые валидируем
      sender_phone: phoneValidateOptions,
      recipient_phone: phoneValidateOptions,
    });

    if (errors) {
      let errorString = "";
      for (const key in errors) {
        errorString += "\n" + errors[key];
      }
      alert(errorString);
      preload.remove(document.body);
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(`${API_URL}/api/gift`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        prompt(
          "Открытка успешно сохранена. Скопируйте ссылку ниже для отправки адресату: ",
          `${location.origin}/card.html?id=${result.id}`,
        );
        form.reset();
      } else {
        alert(`Ошбика при отправке: ${result.message}`);
      }
      preload.remove(submitBtn);
      submitBtn.textContent = submitBtnText;
      updateSubmitBtn();
    } catch (error) {
      console.error(`Произошла ошибка при отправке: ${error}`);
      alert(`Произошла ошибка. Попробуйте снова позже.`);
    }
  });
  //========================================================================================================================================================
} catch (error) {
  console.warn(error.message);
}
