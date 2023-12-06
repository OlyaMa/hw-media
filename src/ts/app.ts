import { Message } from "./Message";

export const vault: Message[] = [];
export const activeStream: MediaStream[] = [];

function app() {
  const input = document.querySelector(".input") as HTMLInputElement;
  const audio = document.querySelector(".audio") as HTMLButtonElement;
  const video = document.querySelector(".video") as HTMLButtonElement;
  const chat = document.querySelector(".content-container") as HTMLDivElement;
  const inputContainer = document.querySelector(
    ".input-container",
  ) as HTMLDivElement;

  const submitMessageHandler = async (event: KeyboardEventInit) => {
    if (event.key === "Enter") {
      const message = new Message(input.value);
      input.value = "";
      input.style.height = "auto";
      vault.push(message);
      await message.postMessage(chat);
    }
  };

  const videoHandler = async (event: Event) => {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      if (
        event.target.classList.contains("fa-video") ||
        event.target.firstElementChild?.classList.contains("fa-video")
      ) {
        const message = new Message(input.value, true);
        vault.push(message);
        await message.postMessage(chat);
      }
    }
  };

  const audioHandler = async (event: Event) => {
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      if (
        event.target.classList.contains("fa-microphone") ||
        event.target.firstElementChild?.classList.contains("fa-microphone")
      ) {
        const message = new Message(input.value, undefined, true);
        vault.push(message);
        await message.postMessage(chat);
      }
    }
  };

  input?.addEventListener("keyup", submitMessageHandler);
  video?.addEventListener("click", videoHandler);
  audio?.addEventListener("click", audioHandler);

  input?.addEventListener("focus", () => {
    inputContainer.classList.add(
      "outline",
      "outline-offset-1",
      "outline-2",
      "outline-indigo-500/40",
    );
  });
  input?.addEventListener("blur", function () {
    inputContainer.classList.remove(
      "outline",
      "outline-offset-1",
      "outline-2",
      "outline-indigo-500/40",
    );
  });
}

app();
