import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaReact, FaNodeJs, FaCloud, FaMobileAlt, FaDatabase, FaCode, FaTools, FaRocket } from 'react-icons/fa';

function Services() {
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  const services = [
    {
      icon: <FaReact className="text-4xl sm:text-5xl text-blue-500" />,
      title: "Frontend Development",
      description: "Building responsive, high-performance user interfaces using React and Tailwind CSS for seamless, engaging experiences across devices."
    },
    {
      icon: <FaNodeJs className="text-4xl sm:text-5xl text-green-500" />,
      title: "Backend Development",
      description: "Developing secure, scalable server-side applications with Django, ensuring robust APIs and efficient data handling."
    },
    {
      icon: <FaDatabase className="text-4xl sm:text-5xl text-purple-500" />,
      title: "Database Design",
      description: "Designing optimized databases with PostgreSQL or MongoDB for performance, scalability, and complex data relationships."
    },
    {
      icon: <FaMobileAlt className="text-4xl sm:text-5xl text-indigo-500" />,
      title: "Responsive Design",
      description: "Creating mobile-first, adaptive designs that deliver consistent user experiences on all screen sizes."
    },
    {
      icon: <FaCode className="text-4xl sm:text-5xl text-red-500" />,
      title: "API Development",
      description: "Crafting secure, RESTful APIs with Django REST Framework, complete with comprehensive documentation."
    },
    {
      icon: <FaTools className="text-4xl sm:text-5xl text-yellow-500" />,
      title: "DevOps & Deployment",
      description: "Implementing CI/CD pipelines, cloud deployment (AWS, Azure), and containerization with Docker for reliable hosting."
    },
    {
      icon: <FaRocket className="text-4xl sm:text-5xl text-teal-500" />,
      title: "Performance Optimization",
      description: "Optimizing applications for speed and scalability using code splitting, lazy loading, and caching strategies."
    }
  ];

  const processSteps = [
    {
      title: "Discovery & Planning",
      description: "Collaborate to define project goals, scope, and technical requirements through in-depth discussions and market analysis."
    },
    {
      title: "Design & Prototyping",
      description: "Create wireframes, prototypes, and technical architecture, iterating based on client feedback for alignment."
    },
    {
      title: "Development",
      description: "Build the application iteratively using agile methodology, with regular demos and client check-ins."
    },
    {
      title: "Testing & QA",
      description: "Conduct unit, integration, and performance testing to ensure a bug-free, secure, and high-quality application."
    },
    {
      title: "Deployment",
      description: "Deploy to production with zero-downtime strategies and provide launch support for a smooth rollout."
    },
    {
      title: "Maintenance & Support",
      description: "Offer ongoing updates, bug fixes, and feature enhancements with flexible support packages."
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "$5,000 - $15,000",
      features: [
        "Basic web application",
        "Core features",
        "Responsive design",
        "1-2 month timeline",
        "Standard support (30 days)"
      ]
    },
    {
      name: "Professional",
      price: "$15,000 - $40,000",
      features: [
        "Custom web application",
        "Advanced features",
        "API integrations",
        "2-4 month timeline",
        "Priority support (90 days)"
      ]
    },
    {
      name: "Enterprise",
      price: "$40,000+",
      features: [
        "Complex enterprise solution",
        "Scalable architecture",
        "Custom integrations",
        "4-6+ month timeline",
        "Dedicated support team"
      ]
    }
  ];

  const portfolioItems = [
    {
      title: "E-Commerce Platform",
      description: "A scalable online store with React, Django, and Stripe integration for real-time payments and inventory management.",
      image: "https://picsum.photos/400/300?random=1",
      fallbackImage: "https://via.placeholder.com/400x300?text=E-Commerce"
    },
    {
      title: "Task Management App",
      description: "A collaborative tool with React frontend, Django REST backend, and WebSocket for real-time updates.",
      image: "https://picsum.photos/400/300?random=2",
      fallbackImage: "https://via.placeholder.com/400x300?text=Task+App"
    },
    {
      title: "Portfolio Website",
      description: "This site, showcasing responsive design, Tailwind CSS, and advanced React features.",
      image: "https://picsum.photos/400/300?random=3",
      fallbackImage: "https://via.placeholder.com/400x300?text=Portfolio"
    }
  ];

  return (
    <div className="bg-gray-900 text-white font-inter">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-purple-900 py-12 sm:py-16 text-center">
        <div className="w-full max-w-full px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat text-white mb-4">Full-Stack Development Services</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6">Transform your ideas into reality with cutting-edge React, Django, and Tailwind CSS solutions.</p>
          <Link to="/inquiry" className="bg-blue-600 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full font-bold hover:bg-blue-700 transition duration-300">Start Your Project</Link>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-12 sm:py-16">
        <div className="w-full max-w-full px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-montserrat mb-8 sm:mb-12 text-center">Technology Expertise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.slice(0, 4).map((tech, index) => (
              <div key={index} className="bg-gray-800 p-4 sm:p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
                {tech.icon}
                <h3 className="text-lg sm:text-xl font-semibold font-montserrat mt-3 sm:mt-4 mb-2">{tech.title}</h3>
                <p className="text-sm sm:text-base text-gray-300">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="py-12 sm:py-16 bg-gray-800">
        <div className="w-full max-w-full px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-montserrat mb-8 sm:mb-12 text-center">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                {service.icon}
                <h3 className="text-lg sm:text-xl font-semibold font-montserrat mt-3 sm:mt-4 mb-2">{service.title}</h3>
                <p className="text-sm sm:text-base text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-12 sm:py-16">
        <div className="w-full max-w-full px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-montserrat mb-8 sm:mb-12 text-center">Our Development Process</h2>
          <div className="space-y-3 sm:space-y-4">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition ${activeProcessStep === index ? 'bg-gray-800' : ''}`}
                onClick={() => setActiveProcessStep(index)}
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="bg-blue-600 text-white w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold font-montserrat">{step.title}</h3>
                    {activeProcessStep === index && <p className="text-sm sm:text-base text-gray-300 mt-1 sm:mt-2">{step.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-12 sm:py-16 bg-gray-800">
        <div className="w-full max-w-full px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-montserrat mb-8 sm:mb-12 text-center">Pricing Tiers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="bg-gray-900 p-4 sm:p-6 rounded-lg text-center shadow-lg hover:shadow-xl transition">
                <h3 className="text-lg sm:text-xl font-semibold font-montserrat mb-3 sm:mb-4">{tier.name}</h3>
                <p className="text-xl sm:text-2xl font-bold text-blue-500 mb-3 sm:mb-4">{tier.price}</p>
                <ul className="text-sm sm:text-base text-gray-300 space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex}>{feature}</li>
                  ))}
                </ul>
                <Link to="/inquiry" className="bg-blue-600 text-white py-2 px-4 rounded-full font-bold hover:bg-blue-700 transition duration-300">Get Quote</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="py-12 sm:py-16">
        <div className="w-full max-w-full px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-montserrat mb-8 sm:mb-12 text-center">Recent Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {portfolioItems.map((item, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-32 sm:h-40 object-cover"
                  onError={(e) => { e.target.src = item.fallbackImage; }}
                />
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold font-montserrat mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 bg-blue-900 text-center">
        <div className="w-full max-w-full px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-montserrat mb-6 sm:mb-8">Ready to Build Your Next Project?</h2>
          <p className="text-sm sm:text-lg text-gray-300 mb-4 sm:mb-6">Schedule a free consultation or submit a detailed project inquiry to get started.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link to="/contact" className="bg-white text-blue-900 py-2 px-4 sm:py-3 sm:px-6 rounded-full font-bold hover:bg-gray-100 transition duration-300">Contact Us</Link>
            <Link to="/inquiry" className="bg-transparent border-2 border-white text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full font-bold hover:bg-white hover:text-blue-900 transition duration-300">Submit Inquiry</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;