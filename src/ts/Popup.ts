import { Tooltip } from "./tooltipFabric";
import { vault } from "./app";

export class Popup {
  public actualMessages: { id: number; name: HTMLFormElement["name"] }[] = [];
  private tooltip: Tooltip = new Tooltip();
  private ckeckValidity: boolean = false;
  private popupOnSubmit() {
    const input: HTMLFormElement | null =
      document.querySelector("input[name='item']");
    if (input) {
      const lastMessageElement = Array.from(
        document.querySelectorAll(".geo-of-message"),
      ).at(-1);
      if (lastMessageElement) {
        const regex = /\[?(\d+\.\d+),\s*−?(\d+\.\d+)\]?/g;
        lastMessageElement.textContent = input.value.replace(regex, "[$1, $2]");
      }
      input.value = "";
      this.popupCreator();
    }
  }

  popupCreator() {
    const warningModal = document.querySelector(".popup_warning");

    if (warningModal && !warningModal?.classList.contains("hidden")) return;

    const popupWindow = document.querySelector(".popup_window");

    if (!popupWindow) {
      const popupWindow = document.createElement("div");
      popupWindow.classList.add(
        "popup_window",
        "shown",
        "top-[50%]",
        "left-[50%]",
        "transform-gpu",
        "-translate-x-1/2",
        "-translate-y-1/2",
        "w-[400px]",
        "absolute",
        "border-solid",
        "border-0",
        "bg-white",
        "rounded",
        "shadow-lg",
        "p-6",
      );
      popupWindow.innerHTML = `
      <form class="form" novalidate>
        <div class="form-header mb-4">
          <h2 class="text-lg font-semibold">Что-то пошло не так</h2>
        </div>
        <p class="theme mb-4 text-gray-700 text-sm">К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.</p>
        <h2 class="mb-2 text-sm">Широта и долгота через запятую</h2>
        <input type="text" name="item" class="focus:outline-none focus:ring-2 focus:ring-indigo-500/40 mb-4 p-2 border-2 border-indigo-200 rounded w-full" required>
        <div class="form_buttons flex justify-end">
          <button class="cancel-bnt mr-2 px-4 py-2 border-2 border-indigo-200 rounded" type="button">Отмена</button>
          <button class="submit-btn px-4 py-2 bg-indigo-500 text-white rounded" type="submit">Ok</button>
        </div>
      </form>`;
      document.body.appendChild(popupWindow);
    } else {
      popupWindow.classList.toggle("hidden");
    }

    if (
      !document.querySelector(".popup_window")?.classList.contains("hidden")
    ) {
      const input = document.querySelector(
        "input[name='item']",
      ) as HTMLInputElement;
      input?.focus();

      this.tooltipLogic();
    }
  }

  private warningPopupOnCancel(popupDelete: HTMLElement) {
    const cancelBnt = popupDelete.querySelector(".cancel-bnt");

    const warningPopupCancelHandler = (event: Event) => {
      event.preventDefault();

      Array.from(document.querySelectorAll(".message"))?.at(-1)?.remove();
      vault.splice(-1, 1);
      document.querySelector(".audio")!.innerHTML =
        `<i class="fa-solid fa-microphone"></i>`;
      document.querySelector(".video")!.innerHTML =
        `<i class="fa-solid fa-video"></i>`;

      this.warningPopup();
      cancelBnt?.removeEventListener("click", warningPopupCancelHandler);
    };

    cancelBnt?.addEventListener("click", warningPopupCancelHandler);
  }

  warningPopup(errorMsg?: string) {
    const popupWindow = document.querySelector(".popup_window");
    if (popupWindow && !popupWindow.classList.contains("hidden")) {
      (popupWindow.querySelector(".cancel-bnt") as HTMLButtonElement)?.click();
      if (!popupWindow.classList.contains("hidden")) {
        popupWindow.classList.add("hidden");
      }
    }

    const popupWarning: HTMLElement | null =
      document.querySelector(".popup_warning");
    if (!popupWarning) {
      const popupWindow = document.createElement("div");
      popupWindow.classList.add(
        "popup_warning",
        "top-[50%]",
        "left-[50%]",
        "transform-gpu",
        "-translate-x-1/2",
        "-translate-y-1/2",
        "w-[400px]",
        "absolute",
        "border-solid",
        "border-0",
        "bg-white",
        "rounded",
        "shadow-lg",
        "p-6",
      );
      popupWindow.innerHTML = `
      <form class="form-delete">
        <div class="form-header mb-4"><h2 class="text-lg font-semibold">Что-то пошло не так</h2></div>
        <p class="theme mb-4 text-gray-700 text-sm">Недоступно API для кмеры и/или микрофона в вашем браузере или они отсутствуют. Либо вы не запретили браузеру использовать ваш микрофон и/или камеру для этого сайта. Нужно с этим что-то сделать. Конкретная причина:</p>
        <p class="theme mb-4 text-gray-700 text-sm">
        <ul>
          <li class="theme mb-4 text-gray-700 text-sm font-bold">${errorMsg}</li>
          </ul>
        </p>
        <div class="form_buttons flex justify-center">
          <button class="cancel-bnt px-4 py-2 bg-indigo-500 text-white rounded" type="button">Закрыть</button>
        </div>
      </form>`;
      document.body.appendChild(popupWindow);
    } else {
      popupWarning.classList.toggle("hidden");
    }
    if (!popupWarning?.classList.contains("hidden") || !popupWarning) {
      const worningElement =
        popupWarning ?? document.querySelector(".popup_warning");
      if (worningElement) this.warningPopupOnCancel(worningElement);
    }
  }

  private tooltipLogic() {
    const form: HTMLFormElement | null = document.querySelector(".form");
    const cancelButton: HTMLElement | null | undefined =
      form?.querySelector(".cancel-bnt");

    const errors = {
      item: {
        valueMissing: "Нам потребуются координаты...",
        patternMismatch:
          "Координаты должны быть в формате '[51.50851, −0.12572]'",
      },
    };
    const showTooltip = (message: string, el: HTMLFormElement) => {
      this.actualMessages.push({
        name: el.name,
        id: this.tooltip.showTooltip(message, el),
      });
    };

    const getError = (el: HTMLFormElement | null) => {
      const errorKey: string | undefined = Object.keys(
        ValidityState.prototype,
      ).find((key) => {
        if (!el || !(el instanceof HTMLInputElement)) return;
        if (key === "valid") return;
        if (key in el.validity) {
          return (el.validity as never)[
            key
          ] as ValidityState[keyof ValidityState];
        }
      });

      if (!errorKey && el?.tagName === "INPUT") {
        const err = this.validator(el!.value);
        if (err) {
          return errors[el!.name as never][err];
        }
        return null;
      }

      if (
        el!.name in errors &&
        errorKey &&
        errorKey in errors[el!.name as never]
      ) {
        return errors[el!.name as never][errorKey];
      }
    };

    const popupCancelHandler = (event: Event) => {
      event.preventDefault();
      if (event.target === form?.querySelector(".cancel-bnt")) {
        (
          document.querySelector("input[name='item']") as HTMLInputElement
        ).value = "";

        this.popupCreator();

        this.actualMessages.forEach((message) =>
          this.tooltip.removeTooltip(message.id),
        );
        this.actualMessages = [];

        cancelButton?.removeEventListener("click", popupCancelHandler);
        form?.removeEventListener("submit", formSubmitEventHandler);
      }
    };

    cancelButton?.addEventListener("click", popupCancelHandler);

    const formSubmitEventHandler = (e: Event) => {
      e.preventDefault();

      this.actualMessages.forEach((message) =>
        this.tooltip.removeTooltip(message.id),
      );
      this.actualMessages = [];

      const elements: HTMLFormControlsCollection | undefined = form?.elements;

      Array.from(elements!).some((elem) => {
        const error = getError(elem as HTMLFormElement);

        if (error) {
          showTooltip(error, elem as HTMLFormElement);
          return true;
        }
        return false;
      });

      if (form?.checkValidity() && this.ckeckValidity) {
        console.log("valid");
        console.log("submit");

        this.popupOnSubmit();
        cancelButton?.removeEventListener("click", popupCancelHandler);
        form.removeEventListener("submit", formSubmitEventHandler);
        Array.from(form.elements).forEach((el) =>
          el.removeEventListener("focus", elementBlurCallback),
        );
        this.ckeckValidity = false;
      }
    };

    form?.addEventListener("submit", formSubmitEventHandler);

    const elementOnBlur = (e: Event) => {
      if (e.target instanceof HTMLFormElement) {
        const el = e.target;

        const error = getError(el);

        const currentErrorMessage = this.actualMessages.find(
          (item) => item.name === el.name,
        );

        if (error) {
          if (!currentErrorMessage) {
            showTooltip(error, el);
          }
        } else {
          if (currentErrorMessage) {
            this.tooltip.removeTooltip(currentErrorMessage.id);
            this.actualMessages.splice(
              this.actualMessages.indexOf(currentErrorMessage),
              1,
            );
          }
        }
      }
    };

    const elementBlurCallback = (event: Event) =>
      event.target?.addEventListener("blur", elementOnBlur);

    Array.from(form!.elements).forEach(
      (element) => element?.addEventListener("focus", elementBlurCallback),
    );
  }

  public validator(text: string) {
    if (/^(?:(?:\[)?(\d+\.\d+),\s*−?(\d+\.\d+)(?:\])?$)/g.test(text)) {
      this.ckeckValidity = true;
      return;
    }
    return "patternMismatch";
  }
}
