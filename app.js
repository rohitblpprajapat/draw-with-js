const canvas = document.querySelector('#draw');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.strokeStyle = '#BADA55';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 10;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let hue = 0;
    let direction = true;

    function draw(e) {
      if (!isDrawing) return;
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.beginPath();
      // Smooth the drawing with a quadratic curve
      ctx.moveTo(lastX, lastY);
      ctx.quadraticCurveTo(lastX, lastY, e.offsetX, e.offsetY);
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];

      hue = (hue + 1) % 360;
      ctx.lineWidth = (direction) ? (ctx.lineWidth + 1) : (ctx.lineWidth - 1);

      if (ctx.lineWidth >= 100 || ctx.lineWidth <= 1) {
        direction = !direction;
      }

      saveDrawing();
    }

    // function throttle(callback, delay) {
    //   let previousCall = new Date().getTime();
    //   return function() {
    //     const time = new Date().getTime();

    //     if ((time - previousCall) >= delay) {
    //       previousCall = time;
    //       callback.apply(null, arguments);
    //     }
    //   };
    // }

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    // const throttledDraw = throttle(draw, 1);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    function saveDrawing() {
      const drawingData = canvas.toDataURL();
      localStorage.setItem('savedDrawing', drawingData);
    }

    function deleteDrawing() {
      localStorage.removeItem('savedDrawing');
      clearCanvas();
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const savedDrawingData = localStorage.getItem('savedDrawing');
    if (savedDrawingData) {
      const img = new Image();
      img.src = savedDrawingData;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    }

    document.getElementById('clearButton').addEventListener('click', deleteDrawing);