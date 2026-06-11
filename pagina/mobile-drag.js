let touchItem = null;

function activarDragMobile(selector) {
  document.querySelectorAll(selector).forEach(item => {
    item.style.touchAction = "none";

    item.addEventListener("touchstart", function () {
      touchItem = this;
      this.style.opacity = "0.5";
    }, { passive: true });

    item.addEventListener("touchend", function (e) {
      if (!touchItem) return;

      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const zona = target?.closest(".drop-zone, .zona-drop, #bloques-container");

      if (zona) zona.appendChild(touchItem);

      touchItem.style.opacity = "1";
      touchItem = null;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  activarDragMobile(".drag-item");
  activarDragMobile(".bloque");
});
