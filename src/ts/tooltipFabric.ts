export class Tooltip {
  _tooltips: { id: number; element: HTMLElement }[] = [];

  showTooltip(message: string, element: HTMLElement) {
    const tooltipElement = document.createElement("DIV");

    tooltipElement.classList.add(
      "form-error",
      "absolute",
      "py-1",
      "px-4",
      "rounded",
      "bg-orange-600",
      "text-white",
      "text-sm",
      "shadow-md",
      "z-50",
      "transform",
      "transition-transform",
      "ease-in-out",
      "duration-500",
      "animate-bounceX",
    );
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

  removeTooltip(id: number) {
    const tooltip = this._tooltips.find((t) => t.id === id);

    if (tooltip) {
      tooltip.element.remove();
    }

    this._tooltips = this._tooltips.filter((t) => t.id !== id);
  }
}
