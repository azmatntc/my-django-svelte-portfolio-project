import { useRef, useEffect } from 'react';
import Typed from 'typed.js';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';

function Home() {
  const typedRef = useRef(null);

  useEffect(() => {
    const options = {
      strings: [
        'Full-Stack Developer',
        'React & Node.js Expert',
        'Cloud & DevOps Specialist'
      ],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true
    };

    const typed = new Typed(typedRef.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const particlesOptions = {
    background: {
      color: {
        value: '#0f172a',
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push',
        },
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: '#ffffff',
      },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden py-16">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center min-h-[calc(100vh-4rem)]">
        <div className="backdrop-filter backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-2xl max-w-2xl glassmorphism">
          <h1 className="text-5xl md:text-7xl font-bold font-montserrat mb-4">
            Hi, I'm Malik Azmat Abbas
          </h1>
          <h2 className="text-3xl md:text-4xl font-inter text-gray-300 mb-8">
            <span ref={typedRef}></span>
          </h2>
          <p className="text-xl font-inter mb-12 max-w-xl mx-auto">
            Crafting innovative web solutions with React, Node.js, Cloud, and DevOps expertise.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="portfolio"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              View My Work
            </a>
            <a
              href="contact"
              className="bg-transparent border-2 border-blue-600 hover:bg-blue-600 text-blue-600 hover:text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Let's Build Together
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;