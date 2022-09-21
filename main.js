window.addEventListener("load", () => {
  const canvasParent = document.getElementById("canvasParent");
  const canvas = document.querySelector("#draw-area");
  const context = canvas.getContext("2d");
  const lastPosition = { x: null, y: null };
  let isDrag = false;

  const resize = () => {
    canvas.width = canvasParent.clientWidth;
    canvas.height = canvasParent.clientHeight;
  };

  const initialize = () => {
    canvas.width = canvasParent.clientWidth;
    canvas.height = canvasParent.clientHeight;
    context.strokeStyle = "#000000";
  };

  const draw = (x, y) => {
    if (!isDrag) {
      return;
    }

    context.lineWidth = 3;

    if ((lastPosition.x == null || lastPosition.y === null)) {
      context.moveTo(x, y);
    } else {
      context.moveTo(lastPosition.x, lastPosition.y);
    }

    context.lineTo(x, y);

    context.stroke();

    lastPosition.x = x;
    lastPosition.y = y;
  };

  const dragStart = () => {
    context.beginPath();
    isDrag = true;
  };

  const dragEnd = () => {
    isDrag = false;

    lastPosition.x = null;
    lastPosition.y = null;
  };

  const download = function () {
    const base64 = canvas.toDataURL("image/png");
    this.href = base64;
    this.download = "draw.png";
  };

  const allClear = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const initEventHandler = () => {
    const clearButton = document.querySelector("#clear-button");
    const downloadButton = document.querySelector("#download");
    let colorButtons = document.querySelectorAll(".color-change");
    const colorInput = document.querySelector("#color");

    const selectColor = function(colorButton) {
      context.strokeStyle = colorButton.dataset.color;
      colorButtons.forEach(button => button.classList.remove("current"));
      colorButton.classList.add("current");
    }

    colorButtons.forEach((colorButton) => {
      colorButton.addEventListener("click", () => selectColor(colorButton));
    });

    clearButton.addEventListener("click", allClear);
    downloadButton.addEventListener("click", download);

    colorInput.addEventListener("change", function () {
      const newColor = document.createElement("div");
      newColor.setAttribute("class", "color-change");
      newColor.setAttribute("style", `background-color: ${this.value}`);
      newColor.setAttribute("data-color", `${this.value}`);
      newColor.addEventListener(
        "click",
        () => (context.strokeStyle = newColor.dataset.color)
      );
      const parent = document.getElementById("color-box");
      parent.appendChild(newColor);
      selectColor(newColor);
      colorButtons = [...colorButtons, newColor];
    });

    canvas.addEventListener("mousedown", dragStart);
    canvas.addEventListener("mouseup", dragEnd);
    canvas.addEventListener("mouseout", dragEnd);
    canvas.addEventListener("mousemove", (event) => draw(event.offsetX, event.offsetY));
    window.addEventListener("resize", resize);
  };

  initialize();

  initEventHandler();
});
