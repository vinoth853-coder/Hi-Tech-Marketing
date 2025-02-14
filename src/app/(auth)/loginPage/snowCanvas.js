import { useEffect, useRef } from "react";

const SnowCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const snowflakes = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: Math.random() - 0.5,
      dy: Math.random() * 2 + 1,
    }));

    function drawSnowflakes() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      });
    }

    function updateSnowflakes() {
      snowflakes.forEach(flake => {
        flake.x += flake.dx;
        flake.y += flake.dy;

        if (flake.y > canvas.height) {
          flake.y = -flake.r;
          flake.x = Math.random() * canvas.width;
        }
      });
    }

    function animate() {
      drawSnowflakes();
      updateSnowflakes();
      requestAnimationFrame(animate);
    }

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animate);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 5,
      }}
    />
  );
};

export default SnowCanvas;
