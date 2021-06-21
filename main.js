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
    context.fillStyle = "rgb(255,255,255)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#000000";
  };

  const draw = (x, y) => {
    if (!isDrag) {
      return;
    }

    context.lineWidth = 3;

    if ((lastPosition, x == null || lastPosition.y === null)) {
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
    console.log(context.strokeStyle);
    isDrag = true;
  };

  const dragEnd = () => {
    context.closePath();
    isDrag = false;

    lastPosition.x = null;
    lastPosition.y = null;
  };

  const download = function () {
    const base64 = canvas.toDataURL("image/png");
    this.href = base64;
    this.download = "draw.png";
  };

  const initEventHandler = () => {
    const clearButton = document.querySelector("#clear-button");
    const downloadButton = document.querySelector("#download");
    const colorButtons = document.querySelectorAll(".color-change");
    const colorInput = document.querySelector("#color");

    colorButtons.forEach((colorButton) => {
      colorButton.addEventListener(
        "click",
        () => (context.strokeStyle = colorButton.dataset.color)
      );
    });

    clearButton.addEventListener("click", initialize);
    downloadButton.addEventListener("click", download);

    colorInput.addEventListener("change", function () {
      const newElement = document.createElement("div");
      newElement.setAttribute("class", "color-change");
      newElement.setAttribute("style", `background-color: ${this.value}`);
      newElement.setAttribute("data-color", `${this.value}`);
      newElement.addEventListener(
        "click",
        () => (context.strokeStyle = newElement.dataset.color)
      );
      context.strokeStyle = newElement.dataset.color;
      const parent = document.getElementById("color-box");
      parent.appendChild(newElement);
    });

    canvas.addEventListener("mousedown", dragStart);
    canvas.addEventListener("mouseup", dragEnd);
    canvas.addEventListener("mouseout", dragEnd);
    canvas.addEventListener("mousemove", (event) => {
      draw(event.layerX, event.layerY);
    });
    window.addEventListener("resize", resize);
  };

  initialize();

  initEventHandler();
});
