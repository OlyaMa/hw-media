import { Popup } from "../Popup";

describe("Popup validator method", () => {
  let instance: Popup;

  beforeEach(() => {
    instance = new Popup();
  });

  // Валидные наборы
  test.each([
    ["51.50851, −0.12572"],
    ["51.50851,−0.12572"],
    ["[51.50851, −0.12572]"],
    ["39.913818,116.363625"],
    ["[39.913818,116.363625]"],
  ])("correct data returns nothing %s)", (text: string) => {
    expect(instance.validator(text)).toBeUndefined();
  });

  // Невалидные наборы
  test.each([
    ["incorrect data"],
    ["51.50851"],
    ["−0.12572"],
    ["[51.50851]"],
    ["[−0.12572]"],
    ["39.913818,116.363625 "],
    ["[ 39.913818,116.363625]"],
    [" [39.913818,116.363625]"],
  ])("incorrect data returns patternMismatch %s)", (text) => {
    expect(instance.validator(text)).toBe("patternMismatch");
  });
});
