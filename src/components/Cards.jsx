import { useState, useEffect, useRef } from 'react';

const audioFiles = [
  {
    id: 1,
    title: "Blue Zenith",
    img: "/src/assets/Blue Zenith.jpg",
    audio: "/src/assets/Blue Zenith.mp3"
  },
  {
    id: 2,
    title: "Sans",
    img: "/src/assets/Sans.jpg",
    audio: "/src/assets/Sans.ogg"
  },
  {
    id: 3,
    title: "Bang Bang",
    img: "/src/assets/Bang Bang.jpg",
    audio: "/src/assets/Bang Bang.ogg"
  },
  {
    id: 4,
    title: "Time to Say Goodbye",
    img: "/src/assets/TimetoSayGoodbye.jpg",
    audio: "/src/assets/TimetoSayGoodbye.mp3"
  },
  {
    id: 5,
    title: "Save Me",
    img: "/src/assets/Save Me.png",
    audio: "/src/assets/Save Me.mp3"
  },
  {
    id: 6,
    title: "Zetsubou Plantation",
    img: "/src/assets/ZetsubouPlantation.jpg",
    audio: "/src/assets/ZetsubouPlantation.ogg"
  }
];

const Cards = ({ soundEnabled }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRefs = useRef({});
  
  // Register audio elements
  useEffect(() => {
    audioFiles.forEach(file => {
      audioRefs.current[file.id] = new Audio(file.audio);
      
      // Set up ended event listener
      audioRefs.current[file.id].addEventListener('ended', () => {
        if (currentlyPlaying === file.id) {
          setCurrentlyPlaying(null);
        }
      });
    });
    
    // Cleanup
    return () => {
      audioFiles.forEach(file => {
        if (audioRefs.current[file.id]) {
          audioRefs.current[file.id].pause();
          audioRefs.current[file.id].removeEventListener('ended', () => {});
        }
      });
    };
  }, []);
  
  // Update when currentlyPlaying changes
  useEffect(() => {
    // Pause all audios first
    audioFiles.forEach(file => {
      if (audioRefs.current[file.id]) {
        audioRefs.current[file.id].pause();
      }
    });
    
    // Play the current one if sound is enabled
    if (currentlyPlaying && soundEnabled) {
      const audio = audioRefs.current[currentlyPlaying];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.error("Audio play error:", e));
      }
    }
  }, [currentlyPlaying, soundEnabled]);
  
  // Handle toggling audio playback
  const toggleAudio = (id) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(id);
    }
  };
  
  return (
    <section id="cards" className="py-20 bg-gray-100 dark:bg-gray-800 transition-all duration-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Interactive Music Cards
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {audioFiles.map((card) => (
            <div 
              key={card.id}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-48 bg-gray-200 dark:bg-gray-600">
                <img 
                  src={card.img} 
                  alt={card.title} 
                  className="w-full h-full object-cover"
                />
                
                <button
                  className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-200 ${!soundEnabled && 'cursor-not-allowed opacity-50'}`}
                  onClick={() => soundEnabled && toggleAudio(card.id)}
                  disabled={!soundEnabled}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-full p-3 transform transition-all duration-200 hover:scale-110">
                    {currentlyPlaying === card.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{card.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {currentlyPlaying === card.id 
                    ? "Now Playing..." 
                    : soundEnabled 
                      ? "Click to play" 
                      : "Sound is disabled"
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cards;