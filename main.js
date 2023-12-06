/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 962:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MediaTools = void 0;
const app_1 = __webpack_require__(866);
const Popup_1 = __webpack_require__(116);
class MediaTools {
    static getCurrentGeoposition() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((data) => {
                    resolve(data);
                }, (error) => {
                    reject(error);
                });
            }
            else {
                reject(new Error("Geolocation in not supported by this browser."));
            }
        });
    }
    static async getVideo() {
        return await new Promise((resolve, reject) => {
            if (navigator.mediaDevices) {
                try {
                    const video = navigator.mediaDevices.getUserMedia({
                        video: { width: 500 },
                    });
                    resolve(video);
                }
                catch (error) {
                    reject(new Error("Video is restricted by User."));
                }
            }
            else {
                reject(new Error("Video in not supported by this browser."));
            }
        });
    }
    static async getAudio() {
        return await new Promise((resolve, reject) => {
            if (navigator.mediaDevices) {
                try {
                    const video = navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });
                    resolve(video);
                }
                catch (error) {
                    reject(new Error("Meida in not supported by this browser."));
                }
            }
            else {
                reject(new Error("Meida in not supported by this browser."));
            }
        });
    }
    static async getVideoAudio() {
        return await new Promise((resolve, reject) => {
            if (navigator.mediaDevices) {
                try {
                    const video = navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: { width: 500 },
                    });
                    resolve(video);
                }
                catch (error) {
                    reject(new Error("Video or audio is restricted by User."));
                }
            }
            else {
                reject(new Error("Meida in not supported by this browser."));
            }
        });
    }
    static async mediaRecorder(typeOfStream) {
        const mediaElement = typeOfStream === "video"
            ? Array.from(document.querySelectorAll(".video_container")).at(-1)
            : Array.from(document.querySelectorAll(".audio_container")).at(-1);
        const videoButton = document.querySelector(".video");
        const audioButton = document.querySelector(".audio");
        let stream;
        try {
            stream =
                typeOfStream === "video"
                    ? await MediaTools.getVideoAudio()
                    : await MediaTools.getAudio();
        }
        catch (e) {
            new Popup_1.Popup().warningPopup(`${e}`);
            return;
        }
        app_1.activeStream.push(stream);
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        let timer;
        let witchButton;
        recorder.addEventListener("start", () => {
            let counter = 0;
            timer = setInterval(() => {
                counter++;
                if (recorder.state === "recording") {
                    const lastTimer = document.querySelector(".timer");
                    if (lastTimer) {
                        lastTimer.remove();
                    }
                    const minutes = Math.floor(counter / 60);
                    const seconds = counter % 60;
                    const element = document.createElement("div");
                    element.classList.add("timer");
                    element.textContent = `${minutes
                        .toString()
                        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                    videoButton?.insertAdjacentElement("afterend", element);
                }
            }, 1000);
        });
        recorder.addEventListener("dataavailable", (event) => {
            chunks.push(event.data);
        });
        recorder.addEventListener("stop", async () => {
            const blob = new Blob(chunks);
            if (mediaElement instanceof HTMLMediaElement) {
                if (witchButton === "stop") {
                    await app_1.vault.at(-1).getGeo();
                    mediaElement.src = URL.createObjectURL(blob);
                    mediaElement.classList.add("w-3/5");
                    mediaElement.setAttribute("width", "500");
                    mediaElement.setAttribute("controls", "");
                    if (typeOfStream === "video") {
                        app_1.vault.at(-1).video = blob;
                    }
                    else {
                        app_1.vault.at(-1).audio = blob;
                    }
                }
                if (witchButton === "cancel") {
                    mediaElement.closest(".message")?.remove();
                    app_1.vault.splice(-1, 1);
                }
                mediaElement.srcObject = null;
                clearInterval(timer);
                if (videoButton?.nextElementSibling?.classList.contains("timer")) {
                    videoButton?.nextElementSibling?.remove();
                }
            }
        });
        const onDestroy = () => {
            recorder.stop();
            app_1.activeStream.forEach((stream) => {
                stream.getTracks().forEach((track) => {
                    track.stop();
                });
            });
            videoButton.innerHTML = `<i class="fa-solid fa-video"></i>`;
            audioButton.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
            videoButton?.removeEventListener("click", onStopClick);
            audioButton?.removeEventListener("click", onCancelClick);
        };
        const onStopClick = (event) => {
            if (event.target instanceof HTMLElement &&
                (event.target.firstElementChild?.classList.contains("fa-stop") ||
                    event.target.classList.contains("fa-stop"))) {
                witchButton = "stop";
                onDestroy();
            }
        };
        const onCancelClick = (event) => {
            if (event.target instanceof HTMLElement &&
                (event.target.firstElementChild?.classList.contains("fa-xmark") ||
                    event.target.classList.contains("fa-xmark"))) {
                witchButton = "cancel";
                onDestroy();
            }
        };
        videoButton?.addEventListener("click", onStopClick);
        audioButton?.addEventListener("click", onCancelClick);
        recorder.start();
    }
}
exports.MediaTools = MediaTools;


/***/ }),

/***/ 60:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Message = void 0;
const MediaTools_1 = __webpack_require__(962);
const app_1 = __webpack_require__(866);
const Popup_1 = __webpack_require__(116);
class Message {
    text;
    video;
    audio;
    date;
    geo;
    constructor(text, video, audio, date, geo) {
        this.text = text;
        this.video = video;
        this.audio = audio;
        this.date = date;
        this.geo = geo;
        this.text = text;
        this.date = date ?? Date.now();
        this.geo = geo;
    }
    dateConverter(created) {
        const date = new Date(created);
        const formatter = new Intl.DateTimeFormat("ru", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
        return formatter.format(date);
    }
    async postMessage(chat) {
        const messageDomElement = document.createElement("div");
        const audioButton = document.querySelector(".audio");
        const videoButton = document.querySelector(".video");
        messageDomElement.classList.add("message", "bg-indigo-50", "h-fit", "text-indigo-950", "rounded-lg", "p-4", "w-[98%]", "mb-4", "mx-auto");
        messageDomElement.innerHTML = `
      <div class="text-of-message break-words mb-4"><div>${this.text}</div></div>
      <div class="geo-of-message text-gray-500 text-xs">loading...</div>
      <div class="date text-yellow-800 text-xs">${this.dateConverter(this.date)}</div>`;
        chat.appendChild(messageDomElement);
        const forInsert = messageDomElement.querySelector(".text-of-message");
        if (this.audio) {
            const audioElement = document.createElement("audio");
            audioElement.classList.add("audio_container");
            audioElement.setAttribute("controls", "");
            forInsert?.insertBefore(audioElement, forInsert.firstElementChild.nextElementSibling);
            await MediaTools_1.MediaTools.mediaRecorder("audio");
            if (audioButton && videoButton) {
                videoButton.innerHTML = `<i class="fa-solid fa-stop"></i>`;
                audioButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
            }
        }
        else if (this.video) {
            const videoElement = document.createElement("video");
            videoElement.classList.add("video_container", "w-3/5");
            forInsert?.insertBefore(videoElement, forInsert.firstElementChild.nextElementSibling);
            let stream;
            try {
                stream = await MediaTools_1.MediaTools.getVideo();
            }
            catch (e) {
                new Popup_1.Popup().warningPopup(`${e}`);
                return;
            }
            if (stream) {
                app_1.activeStream.push(stream);
                videoElement.srcObject = stream;
                videoElement.addEventListener("canplay", () => {
                    videoElement.play();
                });
                if (videoButton && audioButton) {
                    videoButton.innerHTML = `<i class="fa-solid fa-stop"></i>`;
                    audioButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
                }
                await MediaTools_1.MediaTools.mediaRecorder("video");
            }
        }
        else {
            await this.getGeo();
        }
    }
    async getGeo() {
        const geoElement = Array.from(document.querySelectorAll(".geo-of-message")).at(-1);
        MediaTools_1.MediaTools.getCurrentGeoposition()
            .then((geo) => {
            if (geoElement && geo instanceof GeolocationPosition) {
                this.geo = {
                    latitude: geo.coords.latitude,
                    longitude: geo.coords.longitude,
                };
                geoElement.textContent = `${geo.coords.latitude}, ${geo.coords.longitude}`;
            }
        })
            .catch((error) => {
            console.error("Could not fetch geo data:", error?.code);
            this.geo = error.message;
            new Popup_1.Popup().popupCreator();
            if (geoElement) {
                geoElement.textContent = `${error?.message}`;
            }
        });
    }
}
exports.Message = Message;


/***/ }),

/***/ 116:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Popup = void 0;
const tooltipFabric_1 = __webpack_require__(129);
const app_1 = __webpack_require__(866);
class Popup {
    actualMessages = [];
    tooltip = new tooltipFabric_1.Tooltip();
    ckeckValidity = false;
    popupOnSubmit() {
        const input = document.querySelector("input[name='item']");
        if (input) {
            const lastMessageElement = Array.from(document.querySelectorAll(".geo-of-message")).at(-1);
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
        if (warningModal && !warningModal?.classList.contains("hidden"))
            return;
        const popupWindow = document.querySelector(".popup_window");
        if (!popupWindow) {
            const popupWindow = document.createElement("div");
            popupWindow.classList.add("popup_window", "shown", "top-[50%]", "left-[50%]", "transform-gpu", "-translate-x-1/2", "-translate-y-1/2", "w-[400px]", "absolute", "border-solid", "border-0", "bg-white", "rounded", "shadow-lg", "p-6");
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
        }
        else {
            popupWindow.classList.toggle("hidden");
        }
        if (!document.querySelector(".popup_window")?.classList.contains("hidden")) {
            const input = document.querySelector("input[name='item']");
            input?.focus();
            this.tooltipLogic();
        }
    }
    warningPopupOnCancel(popupDelete) {
        const cancelBnt = popupDelete.querySelector(".cancel-bnt");
        const warningPopupCancelHandler = (event) => {
            event.preventDefault();
            Array.from(document.querySelectorAll(".message"))?.at(-1)?.remove();
            app_1.vault.splice(-1, 1);
            document.querySelector(".audio").innerHTML =
                `<i class="fa-solid fa-microphone"></i>`;
            document.querySelector(".video").innerHTML =
                `<i class="fa-solid fa-video"></i>`;
            this.warningPopup();
            cancelBnt?.removeEventListener("click", warningPopupCancelHandler);
        };
        cancelBnt?.addEventListener("click", warningPopupCancelHandler);
    }
    warningPopup(errorMsg) {
        const popupWindow = document.querySelector(".popup_window");
        if (popupWindow && !popupWindow.classList.contains("hidden")) {
            popupWindow.querySelector(".cancel-bnt")?.click();
            if (!popupWindow.classList.contains("hidden")) {
                popupWindow.classList.add("hidden");
            }
        }
        const popupWarning = document.querySelector(".popup_warning");
        if (!popupWarning) {
            const popupWindow = document.createElement("div");
            popupWindow.classList.add("popup_warning", "top-[50%]", "left-[50%]", "transform-gpu", "-translate-x-1/2", "-translate-y-1/2", "w-[400px]", "absolute", "border-solid", "border-0", "bg-white", "rounded", "shadow-lg", "p-6");
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
        }
        else {
            popupWarning.classList.toggle("hidden");
        }
        if (!popupWarning?.classList.contains("hidden") || !popupWarning) {
            const worningElement = popupWarning ?? document.querySelector(".popup_warning");
            if (worningElement)
                this.warningPopupOnCancel(worningElement);
        }
    }
    tooltipLogic() {
        const form = document.querySelector(".form");
        const cancelButton = form?.querySelector(".cancel-bnt");
        const errors = {
            item: {
                valueMissing: "Нам потребуются координаты...",
                patternMismatch: "Координаты должны быть в формате '[51.50851, −0.12572]'",
            },
        };
        const showTooltip = (message, el) => {
            this.actualMessages.push({
                name: el.name,
                id: this.tooltip.showTooltip(message, el),
            });
        };
        const getError = (el) => {
            const errorKey = Object.keys(ValidityState.prototype).find((key) => {
                if (!el || !(el instanceof HTMLInputElement))
                    return;
                if (key === "valid")
                    return;
                if (key in el.validity) {
                    return el.validity[key];
                }
            });
            if (!errorKey && el?.tagName === "INPUT") {
                const err = this.validator(el.value);
                if (err) {
                    return errors[el.name][err];
                }
                return null;
            }
            if (el.name in errors &&
                errorKey &&
                errorKey in errors[el.name]) {
                return errors[el.name][errorKey];
            }
        };
        const popupCancelHandler = (event) => {
            event.preventDefault();
            if (event.target === form?.querySelector(".cancel-bnt")) {
                document.querySelector("input[name='item']").value = "";
                this.popupCreator();
                this.actualMessages.forEach((message) => this.tooltip.removeTooltip(message.id));
                this.actualMessages = [];
                cancelButton?.removeEventListener("click", popupCancelHandler);
                form?.removeEventListener("submit", formSubmitEventHandler);
            }
        };
        cancelButton?.addEventListener("click", popupCancelHandler);
        const formSubmitEventHandler = (e) => {
            e.preventDefault();
            this.actualMessages.forEach((message) => this.tooltip.removeTooltip(message.id));
            this.actualMessages = [];
            const elements = form?.elements;
            Array.from(elements).some((elem) => {
                const error = getError(elem);
                if (error) {
                    showTooltip(error, elem);
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
                Array.from(form.elements).forEach((el) => el.removeEventListener("focus", elementBlurCallback));
                this.ckeckValidity = false;
            }
        };
        form?.addEventListener("submit", formSubmitEventHandler);
        const elementOnBlur = (e) => {
            if (e.target instanceof HTMLFormElement) {
                const el = e.target;
                const error = getError(el);
                const currentErrorMessage = this.actualMessages.find((item) => item.name === el.name);
                if (error) {
                    if (!currentErrorMessage) {
                        showTooltip(error, el);
                    }
                }
                else {
                    if (currentErrorMessage) {
                        this.tooltip.removeTooltip(currentErrorMessage.id);
                        this.actualMessages.splice(this.actualMessages.indexOf(currentErrorMessage), 1);
                    }
                }
            }
        };
        const elementBlurCallback = (event) => event.target?.addEventListener("blur", elementOnBlur);
        Array.from(form.elements).forEach((element) => element?.addEventListener("focus", elementBlurCallback));
    }
    validator(text) {
        if (/^(?:(?:\[)?(\d+\.\d+),\s*−?(\d+\.\d+)(?:\])?$)/g.test(text)) {
            this.ckeckValidity = true;
            return;
        }
        return "patternMismatch";
    }
}
exports.Popup = Popup;


/***/ }),

/***/ 866:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activeStream = exports.vault = void 0;
const Message_1 = __webpack_require__(60);
exports.vault = [];
exports.activeStream = [];
function app() {
    const input = document.querySelector(".input");
    const audio = document.querySelector(".audio");
    const video = document.querySelector(".video");
    const chat = document.querySelector(".content-container");
    const inputContainer = document.querySelector(".input-container");
    const submitMessageHandler = async (event) => {
        if (event.key === "Enter") {
            const message = new Message_1.Message(input.value);
            input.value = "";
            input.style.height = "auto";
            exports.vault.push(message);
            await message.postMessage(chat);
        }
    };
    const videoHandler = async (event) => {
        event.preventDefault();
        if (event.target instanceof HTMLElement) {
            if (event.target.classList.contains("fa-video") ||
                event.target.firstElementChild?.classList.contains("fa-video")) {
                const message = new Message_1.Message(input.value, true);
                exports.vault.push(message);
                await message.postMessage(chat);
            }
        }
    };
    const audioHandler = async (event) => {
        event.preventDefault();
        if (event.target instanceof HTMLElement) {
            if (event.target.classList.contains("fa-microphone") ||
                event.target.firstElementChild?.classList.contains("fa-microphone")) {
                const message = new Message_1.Message(input.value, undefined, true);
                exports.vault.push(message);
                await message.postMessage(chat);
            }
        }
    };
    input?.addEventListener("keyup", submitMessageHandler);
    video?.addEventListener("click", videoHandler);
    audio?.addEventListener("click", audioHandler);
    input?.addEventListener("focus", () => {
        inputContainer.classList.add("outline", "outline-offset-1", "outline-2", "outline-indigo-500/40");
    });
    input?.addEventListener("blur", function () {
        inputContainer.classList.remove("outline", "outline-offset-1", "outline-2", "outline-indigo-500/40");
    });
}
app();


/***/ }),

/***/ 129:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tooltip = void 0;
class Tooltip {
    _tooltips = [];
    showTooltip(message, element) {
        const tooltipElement = document.createElement("DIV");
        tooltipElement.classList.add("form-error", "absolute", "py-1", "px-4", "rounded", "bg-orange-600", "text-white", "text-sm", "shadow-md", "z-50", "transform", "transition-transform", "ease-in-out", "duration-500", "animate-bounceX");
        tooltipElement.textContent = message;
        const id = performance.now();
        this._tooltips.push({
            id,
            element: tooltipElement,
        });
        document.body.appendChild(tooltipElement);
        const { right, top } = element.getBoundingClientRect();
        tooltipElement.style.left = right + 5 + "px";
        tooltipElement.style.top =
            top + element.offsetHeight / 2 - tooltipElement.offsetHeight / 2 + "px";
        return id;
    }
    removeTooltip(id) {
        const tooltip = this._tooltips.find((t) => t.id === id);
        if (tooltip) {
            tooltip.element.remove();
        }
        this._tooltips = this._tooltips.filter((t) => t.id !== id);
    }
}
exports.Tooltip = Tooltip;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/* harmony import */ var _ts_app_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(866);


})();

/******/ })()
;
//# sourceMappingURL=main.js.map