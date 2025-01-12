import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const ChainlanceHero = () => {
  const canvasRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;
    const connectionDistance = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;

        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = 'rgba(147, 51, 234, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.strokeStyle = `rgba(147, 51, 234, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isHovering) {
      controls.start({
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.5 }
      });
    } else {
      controls.start({ scale: 1, rotate: 0 });
    }
  }, [isHovering, controls]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1 
            className="mb-4 text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl"
            animate={controls}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Chain<span className="text-purple-300">Lance</span>
          </motion.h1>
          <p className="mb-8 text-xl sm:text-2xl md:text-3xl">
            Revolutionizing DeFi with Blockchain Technology
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 flex flex-wrap justify-center items-center gap-8"
        >
          <BlockchainFeature icon="🔒" title="Secure" description="Advanced encryption" />
          <BlockchainFeature icon="🌐" title="Decentralized" description="Distributed ledger" />
          <BlockchainFeature icon="🔗" title="Immutable" description="Tamper-proof records" />
          <BlockchainFeature icon="💼" title="Smart Contracts" description="Automated execution" />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgb(167 139 250)" }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full bg-purple-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-purple-600"
        >
          Explore ChainLance
        </motion.button>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 text-sm text-purple-200"
        >
          Powered by Ethereum and Solidity
        </motion.p>
      </div>
    </div>
  );
};

const BlockchainFeature = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex flex-col items-center p-4 bg-purple-800 bg-opacity-50 rounded-lg"
  >
    <span className="text-4xl mb-2">{icon}</span>
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-sm text-purple-200">{description}</p>
  </motion.div>
);

export default ChainlanceHero;

