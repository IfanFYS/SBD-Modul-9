import { useState, useEffect, useRef, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import timeToSayGoodbye from './assets/TimetoSayGoodbye.mp3'
import timeToSayGoodbyeCover from './assets/TimetoSayGoodbye.jpg'
import saveMe from './assets/Save Me.mp3'
import saveMeCover from './assets/Save Me.png'
import blueZenith from './assets/Blue Zenith.mp3'
import blueZenithCover from './assets/Blue Zenith.jpg'
import bangBang from './assets/Bang Bang.ogg'
import bangBangCover from './assets/Bang Bang.jpg'
import sans from './assets/Sans.ogg'
import sansCover from './assets/Sans.jpg'
import zetsubouPlantation from './assets/ZetsubouPlantation.ogg'
import zetsubouPlantationCover from './assets/ZetsubouPlantation.jpg'
import './App.css'
// Import Navbar component
import Navbar from './components/Navbar'
import FloatingParticles from './components/FloatingParticles'
import Home from './components/Home'
import Cards from './components/Cards'
import Counter from './components/Counter'

function App() {
  const [count, setCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const textOptions = ["Fathan Yazid Satriani", "TP SBD 9"]
  const currentFullText = textOptions[currentTextIndex]
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [darkMode, setDarkMode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [currentPlayingSong, setCurrentPlayingSong] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showParticles, setShowParticles] = useState(true)
  
  // Refs for sections to scroll to
  const homeRef = useRef(null);
  const cardsRef = useRef(null);
  const counterRef = useRef(null);
  
  // Card data with songs and images
  const cardData = [
    {
      id: 1,
      title: "Time to Say Goodbye",
      description: "This osu! map, featuring Jeff Williams and Casey Lee Williams, encapsulates the emotional depth of the RWBY series. The beatmap challenges players with dynamic rhythms and transitions, reflecting the song's dramatic flair. It's a favorite among players who appreciate maps that combine storytelling with rhythmic complexity.​",
      image: timeToSayGoodbyeCover,
      audio: timeToSayGoodbye
    },
    {
      id: 2,
      title: "Save Me",
      description: "Avenged Sevenfold's \"Save Me\" offers a demanding experience in osu!, with its extended duration and intricate patterns. The map tests players' endurance and precision, making it a benchmark for those seeking to push their limits in rhythm gaming.​",
      image: saveMeCover,
      audio: saveMe
    },
    {
      id: 3,
      title: "Blue Zenith",
      description: "Composed by xi, \"Blue Zenith\" is renowned in the osu! community for its intense streams and rapid note sequences. The map's design requires exceptional timing and agility, making it a staple for players aiming to master high-speed challenges.​",
      image: blueZenithCover,
      audio: blueZenith
    },
    {
      id: 4,
      title: "Bang Bang",
      description: "Green Day's \"Bang Bang\" brings punk rock energy to osu!, with a map that mirrors the song's aggressive tempo and rebellious spirit. Players are tested with fast-paced rhythms and sharp transitions, capturing the essence of the track's intensity.​",
      image: bangBangCover,
      audio: bangBang
    },
    {
      id: 5,
      title: "Song That Might Play When You Fight Sans",
      description: "Toby Fox's iconic track from Undertale is transformed into a thrilling osu! map that embodies the unpredictability of the Sans boss fight. With erratic rhythms and sudden tempo shifts, it offers a challenging experience that keeps players on their toes.​",
      image: sansCover,
      audio: sans
    },
    {
      id: 6,
      title: "Zetsubou Plantation",
      description: "Yousei Teikoku's \"Zetsubou Plantation\" delivers a gothic rock atmosphere in its osu! adaptation. The map combines haunting melodies with complex patterns, demanding both speed and accuracy from players, and is celebrated for its dark, immersive experience.​",
      image: zetsubouPlantationCover,
      audio: zetsubouPlantation
    }
  ]

  // Filter cards based on search term
  const filteredCards = cardData.filter(card => 
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    card.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Audio player references
  const audioRefs = useRef(cardData.map(() => new Audio()));
  
  // Handle playing song for a specific card
  const playSong = (index) => {
    // If sound is disabled globally, don't play anything
    if (!soundEnabled) {
      // Show an alert or some indication that sound is muted
      return;
    }
    
    // Stop all currently playing songs first
    audioRefs.current.forEach((audio, i) => {
      if (i !== index) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    // If the clicked song is already playing, pause it
    if (currentPlayingSong === index) {
      audioRefs.current[index].pause();
      setCurrentPlayingSong(null);
    } else {
      // Otherwise, play the new song
      audioRefs.current[index].src = cardData[index].audio;
      audioRefs.current[index].play();
      setCurrentPlayingSong(index);
    }
  };
  
  // Initialize audio elements
  useEffect(() => {
    cardData.forEach((card, index) => {
      audioRefs.current[index].src = card.audio;
    });
    
    // Cleanup function to stop all audio when component unmounts
    return () => {
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);
  
  // Effect for toggling all audio when sound is enabled/disabled
  useEffect(() => {
    if (!soundEnabled) {
      // Pause any playing song when sound is disabled
      if (currentPlayingSong !== null) {
        audioRefs.current[currentPlayingSong].pause();
        // Don't reset currentPlayingSong to remember which one was playing
      }
    } else if (currentPlayingSong !== null) {
      // Resume playing if there was a song
      audioRefs.current[currentPlayingSong].play();
    }
  }, [soundEnabled, currentPlayingSong]);
  
  // Enhanced typewriter effect with no pauses - continuous animation
  useEffect(() => {
    let timeout;
    
    if (!isDeleting && typedText === currentFullText) {
      // Start deleting immediately without pause
      setIsDeleting(true);
    } 
    else if (isDeleting && typedText === '') {
      // Switch to the next text option once deletion is complete
      setIsDeleting(false);
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textOptions.length);
    }
    else if (isDeleting) {
      // Delete one character at a time
      timeout = setTimeout(() => {
        setTypedText(prev => prev.slice(0, -1));
      }, 50); // Faster deletion speed (50ms)
    } 
    else {
      // Type one character at a time
      timeout = setTimeout(() => {
        setTypedText(currentFullText.slice(0, typedText.length + 1));
      }, 80); // Faster typing speed (80ms)
    }
    
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentFullText, currentTextIndex]);

  // Intersection Observer to detect which section is in view
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveSection(id);
        }
      });
    }, options);

    const sections = [homeRef.current, cardsRef.current, counterRef.current];
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  const scrollToSection = (sectionId) => {
    const sectionMap = {
      'home': homeRef,
      'cards': cardsRef,
      'counter': counterRef
    };
    
    const ref = sectionMap[sectionId];
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    setMenuOpen(false);
  }

  // Fix dark mode toggling - update HTML class when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Track when we should show alerts
  const alertTimeoutRef = useRef(null);
  const lastDivisibleByTenRef = useRef(null);
  
  // Memoize counter functions to prevent unnecessary re-renders
  const incrementCount = useCallback(() => {
    setCount(prevCount => {
      const newCount = prevCount + 1;
      return newCount;
    });
  }, []);

  const decrementCount = useCallback(() => {
    setCount(prevCount => {
      const newCount = prevCount - 1;
      return newCount;
    });
  }, []);

  const resetCount = useCallback(() => {
    setCount(0);
    lastDivisibleByTenRef.current = null;
  }, []);
  
  // Using a separate useEffect for showing alerts to improve performance
  useEffect(() => {
    // Clear any existing timeout to prevent multiple alerts
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    
    // Only show alert if count is not 0, divisible by 10, and different from the last alert
    if (count !== 0 && count % 10 === 0 && lastDivisibleByTenRef.current !== count) {
      lastDivisibleByTenRef.current = count;
      
      // Very short delay to ensure UI is updated first
      alertTimeoutRef.current = setTimeout(() => {
        alert(`Congratulations! The counter has reached ${count}, which is divisible by 10!`);
        alertTimeoutRef.current = null;
      }, 10);
    }
    
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, [count]); // This effect runs whenever count changes

  return (
    <>
      {/* Render Navbar outside the main scrolling container */}
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        soundEnabled={soundEnabled} 
        setSoundEnabled={setSoundEnabled} 
        scrollToSection={scrollToSection} // Pass scrollToSection function as a prop
      />
      {/* Main container with padding-top to account for fixed navbar height */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-200 pt-[80px]">
        {/* Background Particles - moved inside the main container if they should scroll, or keep outside if they should be fixed too */}
        {showParticles && <FloatingParticles darkMode={darkMode} />}
        
        {/* Content wrapper with bottom padding */}
        <div className="pb-8">
          {/* Home Section */}
          <section 
            id="home" 
            ref={homeRef} 
            className="min-h-screen flex flex-col items-center justify-center w-full transition-all duration-200"
          >
            <div className="w-full max-w-7xl px-6 md:px-12">
              <h2 className="text-5xl font-bold mb-8 text-center text-gray-900 dark:text-white transition-all duration-500 animate-pulse">Tugas Pendahuluan 9 SBD</h2>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto transition-all duration-300 transform hover:scale-105">
                <p className="text-lg mb-6 text-center text-gray-700 dark:text-gray-200 transition-all duration-200">
                  Welcome to Ifan's Advanced Frontend website! This website is made for Ifan's preliminary assignment on the 9th module of Database Systems practicum.
                </p>
                
                {/* Added animated decorative elements */}
                <div className="flex justify-center mb-8">
                  <div className="flex space-x-4">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-5 h-5 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-indigo-500'}`}
                        style={{
                          animation: `bounce ${1 + i * 0.2}s ease-in-out ${i * 0.1}s infinite alternate`
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center mb-8">
                  <div className="relative w-24 h-24">
                    <img 
                      src={reactLogo} 
                      alt="React Logo" 
                      className="w-full h-full object-contain animate-spin-slow" 
                    />
                    <img 
                      src={viteLogo} 
                      alt="Vite Logo" 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 object-contain animate-pulse" 
                    />
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 mt-6">
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                    onClick={() => scrollToSection('cards')}
                  >
                    Explore Cards
                  </button>
                  <button 
                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-6 py-3 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                    onClick={() => scrollToSection('counter')} // Ensure this matches the id of the counter section
                  >
                    Try Counter
                  </button>
                </div>
              </div>
              
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:rotate-1">
                  <div className="text-blue-500 dark:text-blue-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">Fast Performance</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">Built with React and Vite for lightning-fast load times and smooth animations.</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-purple-500 dark:text-purple-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">Dark Mode</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">Switch between light and dark themes with a single click for comfortable viewing.</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:rotate-negative-1">
                  <div className="text-green-500 dark:text-green-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">Music Player</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">Enjoy your favorite OSU tracks with our integrated audio player functionality.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cards Section */}
          <section 
            id="cards" 
            ref={cardsRef} 
            className="min-h-screen w-full px-6 md:px-12 py-16 transition-all duration-200"
          >
            <h2 className="text-4xl font-bold mb-10 text-center text-gray-900 dark:text-white transition-all duration-200 animate-bounce">Music Cards Gallery</h2>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {filteredCards.length === 0 && (
                <p className="text-center mt-2 text-gray-600 dark:text-gray-300">No cards match your search</p>
              )}
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCards.map((card, index) => (
                <div 
                  key={card.id} 
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${currentPlayingSong === index ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => playSong(index)}
                >
                  <div 
                    className="h-48 bg-cover bg-center relative" 
                    style={{ backgroundImage: `url(${card.image})` }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <button 
                        className={`text-white bg-indigo-500 hover:bg-indigo-600 rounded-full p-3 transition-all duration-200 transform hover:scale-110 ${!soundEnabled && 'opacity-50'}`}
                        disabled={!soundEnabled}
                      >
                        {currentPlayingSong === index ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white transition-all duration-200">{card.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 transition-all duration-200">
                      {card.description}
                    </p>
                    <div className="flex items-center justify-center">
                      <span 
                        className={`px-2 py-1 text-xs rounded-full text-center transition-all duration-200
                          ${currentPlayingSong === index && soundEnabled 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 animate-pulse' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}
                      >
                        {currentPlayingSong === index && soundEnabled 
                          ? 'Now Playing' 
                          : soundEnabled 
                            ? 'Click to Play' 
                            : 'Sound Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Counter Section */}
          <section
            id="counter" // Ensure this id matches the one used in scrollToSection
            ref={counterRef}
            className="min-h-screen flex flex-col items-center justify-center w-full transition-all duration-200"
          >
            <Counter /> {/* Render the Counter component here */}
          </section>
        </div>
      </div>
    </>
  )
}

export default App
