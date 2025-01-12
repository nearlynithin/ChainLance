import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Database, Globe, Shield, Coins, Brain, Code, FileCheck, Users } from 'lucide-react';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';


const ChainlanceHero = () => {
  const canvasRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const controls = useAnimation();

  const technologies = [
    {
      category: "Frontend & Styling",
      items: [
        { name: "React.js", icon: "⚛️" },
        { name: "Tailwind CSS", icon: "🎨" },
      ]
    },
    {
      category: "Blockchain",
      items: [
        { name: "Solidity", icon: "📑" },
        { name: "Ethereum", icon: "⟠" },
        { name: "Web3.js", icon: "🌐" },
      ]
    },
    {
      category: "Backend & Database",
      items: [
        { name: "Python", icon: "🐍" },
        { name: "MongoDB", icon: "🍃" },
        { name: "SQLite", icon: "💾" },
      ]
    }
  ];



  const features = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Decentralized Marketplace",
      description: "Secure peer-to-peer transactions between freelancers and clients"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Smart Contracts",
      description: "Automated milestone-based payments for enhanced trust"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Secure Guard",
      description: "Fraud avoidance system designed to protect both freelancers and clients from deceptive practices."
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: "Portfolio Verification",
      description: "Blockchain-verified credentials and work history"
    },
    {
      icon: <Coins className="h-8 w-8" />,
      title: "Escrow System",
      description: "Secure blockchain-based payment protection"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Reputation System",
      description: "Immutable reviews for lasting accountability"
    }
  ];

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
    <div className="relative h-full pb-4 w-full overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 "
      />
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center text-white">
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
            Revolutionizing Freelancing with Blockchain Technology
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
      <div className="container mx-auto mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-white mb-16"
        >
        </motion.h2>
        </div>
        <div className="container mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-white mb-16"
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-purple-800 bg-opacity-50 rounded-xl p-6 flex flex-col items-center text-center"
            >
              <div className="text-purple-300 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-purple-200">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mt-24 text-white mb-16"
        >
          Our Tech Stack
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {technologies.map((category, idx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="bg-purple-800 bg-opacity-50 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold text-purple-200 mb-4">
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.items.map((tech, techIdx) => (
                  <motion.div
                    key={tech.name}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-3 text-white"
                  >
                    <span className="text-2xl">{tech.icon}</span>
                    <span>{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl  font-bold text-white mb-6">
            Ready to Transform Your Freelancing Journey?
          </h2>
          <p className="text-xl text-purple-200 mb-12">
            Join thousands of freelancers and clients already experiencing the future of decentralized work.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <motion.a href="/signup">
              <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgb(167 139 250)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              Sign Up Free
              <ArrowRight className="h-5 w-5" />
            </motion.button>
            </motion.a>
            <motion.a href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border-2 border-purple-400 hover:border-purple-300 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
            >
              <LogIn className="h-5 w-5" />
              Log In
            </motion.button>
            </motion.a>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-purple-300 text-sm"
          >
            No credit card required • Free to get started
          </motion.p>
          
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-purple-200">
              <span className="text-2xl">🔒</span>
              <span>Secure Blockchain Technology</span>
            </div>
            <div className="flex items-center gap-2 text-purple-200">
              <span className="text-2xl">⚡</span>
              <span>Instant Setup</span>
            </div>
            <div className="flex items-center gap-2 text-purple-200">
              <span className="text-2xl">🤝</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </div>
      <footer>
        <div className="text-center border-t border-purple-800 pt-4">
            <p className="text-purple-300">
              © {new Date().getFullYear()} ChainLance. All rights reserved.
            </p>
            <p className="text-sm text-purple-400 mt-2">
              Built with 🔥 by Nithin, Santhsim and Reuben.
            </p>
        </div>
      </footer>
      

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

