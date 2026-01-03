// frontend/src/components/Footer.jsx
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Footer() {
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/yourusername',
      icon: <FaGithub />,
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/yourusername',
      icon: <FaLinkedin />,
    },
    {
      name: 'Twitter',
      url: 'https://x.com/yourusername',
      icon: <FaTwitter />,
    },
  ];

  return (
    <footer className="bg-gray-800 p-4 text-center text-gray-300">
      <p>&copy; {new Date().getFullYear()} Malik Azmat Abbas. All rights reserved.</p>
      <div className="mt-2 flex justify-center space-x-4">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            className="flex items-center space-x-2 text-accent hover:text-green-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xl">{link.icon}</span>
            <span>{link.name}</span>
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;