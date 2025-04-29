import React from 'react';

const Home = () => {
  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center p-6 transition-all duration-200">
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-8 animate-fadeIn">
          Welcome to <span className="text-blue-600 dark:text-blue-400">My React App</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed animate-fadeIn animation-delay-300">
          This is a sample React application showcasing various features including
          dark mode, sound effects, animations, and interactive components.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 animate-fadeIn animation-delay-600">
          <a 
            href="#cards"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('cards').scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-200"
          >
            Explore Cards
          </a>
          
          <a 
            href="#counter"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('counter').scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-200"
          >
            Try Counter
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;