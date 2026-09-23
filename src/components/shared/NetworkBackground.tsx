"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    };

    window.addEventListener("resize", resize);

    const isDark = resolvedTheme === "dark";
    // Subtle, elegant colors
    const nodeColor = isDark ? "rgba(96, 165, 250, 0.4)" : "rgba(11, 43, 85, 0.6)"; // Dark blue for light mode
    const lineColorBase = isDark ? "96, 165, 250" : "11, 43, 85"; // Dark blue for lines

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.5 + 1; // Smaller nodes
        this.speedX = (Math.random() * 1 - 0.5) * 0.5;
        this.speedY = (Math.random() * 1 - 0.5) * 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas!.height || this.y < 0) this.speedY = -this.speedY;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      }
    }

    const init = () => {
      particlesArray = [];
      // Increased density for more lines
      const numberOfParticles = Math.min((canvas.width * canvas.height) / 9000, 160); 
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) { // Longer reach for more lines
            ctx.beginPath();
            // Line opacity based on distance
            const opacity = 1 - distance / 150;
            // Higher base opacity to make it more evident
            ctx.strokeStyle = `rgba(${lineColorBase}, ${opacity * (isDark ? 0.7 : 0.75)})`;
            ctx.lineWidth = 1.8; // Thicker lines
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
