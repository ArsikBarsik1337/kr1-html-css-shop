/* =========================================================
   main.js — общий скрипт для всех страниц проекта.
   Работает безопасно: если элемента нет на странице —
   код просто не выполняется, ошибок в консоли не будет.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     1. Модальное окно заявки на главной странице
     ------------------------------------------------------- */
  const orderDialog = document.getElementById('order-dialog');
  const orderButtons = document.querySelectorAll('.product-card__button[data-product]');
  const closeDialogButton = document.getElementById('close-order-dialog');
  const selectedProductInput = document.getElementById('selected-product');
  const orderForm = document.getElementById('order-form');
  const successMessage = document.getElementById('success-message');

  if (orderDialog && orderButtons.length > 0) {
    // Открытие модалки по кнопке «Заказать»
    orderButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const productName = button.dataset.product || '';
        if (selectedProductInput) {
          selectedProductInput.value = productName;
        }
        orderDialog.showModal();
      });
    });

    // Закрытие по кнопке «Закрыть»
    if (closeDialogButton) {
      closeDialogButton.addEventListener('click', () => {
        orderDialog.close();
      });
    }

    // Закрытие по клику на backdrop (вне области dialog)
    orderDialog.addEventListener('click', (event) => {
      if (event.target === orderDialog) {
        orderDialog.close();
      }
    });
  }

  /* -------------------------------------------------------
     2. Общая функция обработки формы с валидацией.
     Возвращает true, если форма успешно «отправлена».
     ------------------------------------------------------- */
  function handleFormSubmit(form, onSuccess) {
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      // Сбрасываем предыдущие метки об ошибках
      const formElements = Array.from(form.elements);
      formElements.forEach((element) => {
        if (element.willValidate) {
          element.removeAttribute('aria-invalid');
        }
      });

      // Проверяем встроенные HTML-ограничения
      if (!form.checkValidity()) {
        formElements.forEach((element) => {
          if (element.willValidate && !element.checkValidity()) {
            element.setAttribute('aria-invalid', 'true');
          }
        });
        form.reportValidity();
        return;
      }

      // Всё ок — вызываем колбэк успеха
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    });
  }

  /* -------------------------------------------------------
     3. Форма в модальном окне (index.html)
     ------------------------------------------------------- */
  if (orderForm) {
    handleFormSubmit(orderForm, () => {
      if (successMessage) {
        successMessage.hidden = false;
        // Прячем сообщение через 4 секунды
        setTimeout(() => {
          successMessage.hidden = true;
        }, 4000);
      }
      orderForm.reset();
      if (orderDialog) {
        orderDialog.close();
      }
    });
  }

  /* -------------------------------------------------------
     4. Форма на странице order.html
     ------------------------------------------------------- */
  const orderPageForm = document.getElementById('order-page-form');
  const orderPageSuccess = document.getElementById('order-page-success');

  if (orderPageForm) {
    handleFormSubmit(orderPageForm, () => {
      if (orderPageSuccess) {
        orderPageSuccess.hidden = false;
        orderPageSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          orderPageSuccess.hidden = true;
        }, 4000);
      }
      orderPageForm.reset();
    });
  }

  /* -------------------------------------------------------
     5. Плавный скролл для кнопки «Наверх»
     ------------------------------------------------------- */
  const buttonUp = document.querySelector('.button-up');
  if (buttonUp) {
    buttonUp.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});