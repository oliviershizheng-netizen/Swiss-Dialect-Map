import React, { useState, useEffect } from 'react';
import { 
  Map as MapIcon, 
  Mountain, 
  Play, 
  Pause, 
  Info, 
  X
} from 'lucide-react';

// --- Types ---

type Language = 'German' | 'French' | 'Italian' | 'Romansh';
type Category = 'Greeting' | 'Weather' | 'Numbers' | 'Proverb' | 'Food';

interface Sample {
  text: string;
  translation: string;
  phonetic?: string;
}

interface DialectData {
  id: string;
  name: string;
  regionName: string;
  language: Language;
  coordinates: { x: number; y: number }; // Percentage 0-100
  description: string;
  samples: Record<Category, Sample>;
}

// --- Data ---

const SWISS_DATA: DialectData[] = [
  {
    id: 'zh',
    name: 'Züritüütsch',
    regionName: 'Zurich',
    language: 'German',
    coordinates: { x: 58, y: 28 },
    description: "Spoken in the canton of Zurich, this is one of the most influential dialects in German-speaking Switzerland. It is characterized by its fast pace and specific vocal shifts compared to Standard German.",
    samples: {
      Greeting: { text: "Grüezi", translation: "Hello (Formal)" },
      Weather: { text: "Es rägnet i ströme.", translation: "It is raining loosely (pouring)." },
      Numbers: { text: "Eis, Zwäi, Drü", translation: "One, Two, Three" },
      Proverb: { text: "Wer nöd wagt, de nöd günnt.", translation: "Who dares nothing, wins nothing." },
      Food: { text: "Ich hetti gern es Zürcher Gschnätzlets.", translation: "I would like sliced meat Zurich style." }
    }
  },
  {
    id: 'be',
    name: 'Bärndütsch',
    regionName: 'Bern',
    language: 'German',
    coordinates: { x: 36, y: 48 },
    description: "Known for its melodic, slower tempo and distinct vocalization of 'l' to 'u' (vocalization). It represents the heart of the Swiss plateau culture.",
    samples: {
      Greeting: { text: "Grüessech", translation: "Greetings (Formal)" },
      Weather: { text: "Es schüttet wie aus Chüble.", translation: "It's pouring from buckets." },
      Numbers: { text: "Eis, Zwöi, Drü", translation: "One, Two, Three" },
      Proverb: { text: "Nume nid gsprängt.", translation: "Don't rush it / Take it easy." },
      Food: { text: "Äs Stück Anke u Brot.", translation: "A piece of butter and bread." }
    }
  },
  {
    id: 'vs',
    name: 'Walliserditsch',
    regionName: 'Valais',
    language: 'German',
    coordinates: { x: 38, y: 76 },
    description: "A High Alemannic dialect spoken in the Alpine Rhone valley. It is extremely distinct, preserving archaic forms of grammar and vocabulary that other dialects have lost.",
    samples: {
      Greeting: { text: "Güätä Tag", translation: "Good Day" },
      Weather: { text: "Es isch hüt schono chalt.", translation: "It is pretty cold today." },
      Numbers: { text: "Eis, Zwii, Dri", translation: "One, Two, Three" },
      Proverb: { text: "Was dü wosch.", translation: "Whatever you want." },
      Food: { text: "Raclette und Fendant.", translation: "Raclette cheese and white wine." }
    }
  },
  {
    id: 'ge',
    name: 'Français Vaudois/Genevois',
    regionName: 'Geneva / Vaud',
    language: 'French',
    coordinates: { x: 8, y: 78 },
    description: "While much of Suisse Romande now speaks standard French, local accents and specific vocabulary (septante, huitante, nonante) remain strong cultural markers.",
    samples: {
      Greeting: { text: "Salut, ça joue?", translation: "Hi, is it going well?" },
      Weather: { text: "Il pleut des cordes.", translation: "It's raining ropes." },
      Numbers: { text: "Un, Deux, Trois", translation: "One, Two, Three" },
      Proverb: { text: "Y'a pas le feu au lac.", translation: "There's no fire at the lake (No rush)." },
      Food: { text: "Une fondue moitié-moitié.", translation: "A half-half cheese fondue." }
    }
  },
  {
    id: 'ti',
    name: 'Ticinese',
    regionName: 'Ticino',
    language: 'Italian',
    coordinates: { x: 60, y: 76 },
    description: "The Lombard dialect of the Italian-speaking part of Switzerland. It shares roots with the dialects of Northern Italy but has evolved independently within the Swiss confederation.",
    samples: {
      Greeting: { text: "Bondì / Ciao", translation: "Good day / Hello" },
      Weather: { text: "Oggi fa un freddo cane.", translation: "It's dog cold today." },
      Numbers: { text: "Vün, Dü, Tri", translation: "One, Two, Three" },
      Proverb: { text: "Chi va pian, va san e va lontan.", translation: "Who goes slowly, goes safely and far." },
      Food: { text: "Polenta e brasato.", translation: "Cornmeal mush and braised beef." }
    }
  },
  {
    id: 'gr',
    name: 'Sursilvan (Romansh)',
    regionName: 'Grisons',
    language: 'Romansh',
    coordinates: { x: 82, y: 52 },
    description: "Romansh is a descendant of the spoken Latin of the Roman Empire, preserved in the secluded valleys of Grisons. It is Switzerland's fourth national language.",
    samples: {
      Greeting: { text: "Bien di", translation: "Good day" },
      Weather: { text: "Ei plova.", translation: "It rains." },
      Numbers: { text: "In, Dus, Treis", translation: "One, Two, Three" },
      Proverb: { text: "L'aua quieta ruaus profunda.", translation: "Still waters run deep." },
      Food: { text: "Capuns e maluns.", translation: "Chard rolls and potato crumbs." }
    }
  }
];

// --- Components ---

const AudioPlayer = ({ sample, isPlaying, onToggle }: { sample: Sample, isPlaying: boolean, onToggle: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            onToggle(); // Stop automatically
            return 100;
          }
          return p + 1.5; // Simulate duration
        });
      }, 50);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onToggle]);

  return (
    <div className="bg-swiss-paper border border-swiss-ink/10 p-4 mt-6 rounded-sm shadow-sm">
      <div className="flex items-center gap-4 mb-3">
        <button 
          onClick={onToggle}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-swiss-red text-white hover:bg-red-700 transition-colors"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>
        <div className="flex-1">
          <div className="text-lg font-serif italic text-swiss-ink">{sample.text}</div>
          <div className="text-sm font-sans text-swiss-ink/60 uppercase tracking-wider text-xs mt-1">{sample.translation}</div>
        </div>
      </div>
      
      {/* Waveform Visualization */}
      <div className="h-8 flex items-end gap-1 overflow-hidden opacity-80">
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i}
            className={`flex-1 bg-swiss-ink/80 rounded-t-sm transition-all duration-300 ${isPlaying ? 'waveform-bar' : 'h-[2px]'}`}
            style={{ 
              animationDelay: `${i * 0.05}s`,
              height: isPlaying ? undefined : '2px'
            }}
          />
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-swiss-ink/10 w-full mt-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-swiss-red transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const MapPath = ({ 
  d, 
  fill, 
  stroke = "white", 
  strokeWidth = 1.5,
  onMouseEnter,
  onMouseLeave
}: { 
  d: string; 
  fill: string; 
  stroke?: string;
  strokeWidth?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => (
  <path 
    d={d} 
    fill={fill} 
    stroke={stroke} 
    strokeWidth={strokeWidth}
    className="map-path hover:opacity-90 cursor-pointer"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  />
);

const App = () => {
  const [activeDialectId, setActiveDialectId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'admin' | 'physical'>('admin');
  const [activeCategory, setActiveCategory] = useState<Category>('Greeting');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const activeDialect = SWISS_DATA.find(d => d.id === activeDialectId);

  // Accurate Swiss Map Topology (ViewBox 0 0 800 500)
  // These paths are constructed to fit together perfectly like a puzzle.
  const paths = {
    // 1. Romandie (French West)
    // Covers Geneva, Vaud, Neuchatel, Jura, parts of Fribourg/Valais
    romandie: `
      M 230,70 
      C 180,80 120,150 100,180 
      C 60,220 40,280 40,320 
      C 30,380 20,420 30,440 
      L 60,450 
      C 100,440 150,430 180,440 
      L 260,460 
      L 320,420 
      C 300,350 280,250 290,200 
      C 300,150 260,100 230,70 
      Z
    `,
    
    // 2. Ticino (Italian South)
    // The triangular pendant south of the Alps
    ticino: `
      M 420,330 
      L 450,320 
      L 500,310 
      C 520,350 540,400 530,450 
      L 510,490 
      C 480,460 460,420 450,400 
      L 430,380 
      L 420,330 
      Z
    `,
    
    // 3. Grisons (Romansh East)
    // The large, jagged eastern canton
    grisons: `
      M 500,310 
      L 540,220 
      L 560,180 
      C 600,180 650,160 700,180 
      L 780,240 
      C 750,350 700,400 650,420 
      L 530,360 
      L 500,310 
      Z
    `,
    
    // 4. Deutschschweiz (German North/Central)
    // Fits into the space left by the other three
    german: `
      M 230,70 
      C 260,100 300,150 290,200 
      C 280,250 300,350 320,420 
      L 420,330 
      L 450,320 
      L 500,310 
      L 540,220 
      L 560,180 
      C 550,120 500,80 480,60 
      C 420,70 400,20 380,30 
      C 340,50 300,60 230,70 
      Z
    `,
    
    // Lakes (High detail)
    lakes: [
      // Lake Geneva (Lac Léman) - Crescent shape in the southwest
      { d: "M 40,435 C 60,450 100,450 130,420 C 145,405 130,400 110,410 C 80,420 60,420 40,435 Z", name: "Leman" },
      // Lake Neuchatel - Long oval in the west
      { d: "M 165,220 C 180,210 200,230 195,240 C 180,250 160,230 165,220 Z", name: "Neuchatel" },
      // Lake Constance (Bodensee) - Wedge in the northeast
      { d: "M 490,65 C 520,60 550,70 560,85 C 540,80 520,75 490,65 Z", name: "Constance" },
      // Lake Zurich - Banana shape near Zurich
      { d: "M 450,130 C 470,140 480,160 475,170 C 460,160 450,150 450,130 Z", name: "Zurich" },
      // Lake Lucerne (Vierwaldstättersee) - Complex shape in center
      { d: "M 360,220 C 380,220 390,240 380,250 C 370,240 365,230 360,220 Z", name: "Lucerne" },
       // Lake Lugano - Small lake in Ticino
      { d: "M 495,445 C 505,440 505,455 495,455 C 490,450 495,445 495,445 Z", name: "Lugano" }
    ]
  };

  // Color logic
  const getRegionColor = (region: string, lang: Language) => {
    if (mapMode === 'physical') {
      // Physical: 
      // Romandie & German Plateau = Greenish
      // Ticino & Grisons & Southern German/Valais = Alpine Grey/White
      
      if (region === 'romandie') return '#C8D6B9'; // Plateau Green
      if (region === 'german') return '#CAD4C0'; // Plateau Green/Mix
      // Special logic for German region? The German part has both plateau and alps.
      // But for simple polygon fill, we keep it consistent.
      // We will overlay mountains to show the alps.
      
      return '#E0E0E0'; // High Alps (Ticino, Grisons) base
    } else {
      // Administrative: Language Based
      switch (lang) {
        case 'German': return '#D4D4D4'; // Light Grey
        case 'French': return '#A3A3A3'; // Medium Grey
        case 'Italian': return '#737373'; // Dark Grey
        case 'Romansh': return '#E1C16E'; // Gold accent
        default: return '#E5E5E5';
      }
    }
  };

  // Mountain Texture Overlay for Physical Mode
  const PhysicalOverlay = () => {
    if (mapMode !== 'physical') return null;
    return (
      <g className="pointer-events-none opacity-40 mix-blend-multiply">
        {/* Alpine Arch: Extending from Geneva/Valais across to Grisons */}
        <path 
          d="M 100,400 L 200,350 L 300,420 L 450,300 L 600,350 L 700,250 L 500,200 L 350,280 Z" 
          fill="url(#mountain-gradient)" 
          filter="url(#rough-terrain)"
        />
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-swiss-cream font-serif text-swiss-ink p-4 md:p-8 selection:bg-swiss-red selection:text-white">
      
      {/* Header Grid */}
      <header className="max-w-7xl mx-auto border-t-4 border-swiss-ink pt-6 mb-12 grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">
            HELVETIA
            <span className="text-swiss-red">.</span>
          </h1>
          <p className="text-xl md:text-2xl font-light italic leading-tight max-w-2xl">
            An interactive exploration of Swiss linguistic geography and dialect variance.
          </p>
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col justify-between items-start md:items-end">
          <div className="text-sm font-sans uppercase tracking-widest font-bold">
            Project No. 24
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
             <button 
              onClick={() => setMapMode('admin')}
              className={`flex items-center gap-2 px-4 py-2 border text-sm font-sans font-bold uppercase transition-all ${mapMode === 'admin' ? 'bg-swiss-ink text-white border-swiss-ink' : 'border-swiss-ink hover:bg-swiss-ink/5'}`}
            >
              <MapIcon size={16} /> Admin
            </button>
            <button 
              onClick={() => setMapMode('physical')}
              className={`flex items-center gap-2 px-4 py-2 border text-sm font-sans font-bold uppercase transition-all ${mapMode === 'physical' ? 'bg-swiss-ink text-white border-swiss-ink' : 'border-swiss-ink hover:bg-swiss-ink/5'}`}
            >
              <Mountain size={16} /> Terrain
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
        
        {/* Map Section */}
        <div className="lg:col-span-8 relative">
          <div className="w-full aspect-[4/3] relative bg-[#EBEBE6] border border-swiss-ink/20 shadow-inner overflow-hidden rounded-sm">
            
            {/* Legend Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-swiss-cream/90 backdrop-blur-sm p-3 border border-swiss-ink/10 text-xs font-sans shadow-sm">
              <div className="font-bold uppercase mb-2 border-b border-swiss-ink pb-1">
                {mapMode === 'physical' ? 'Geography' : 'Language Families'}
              </div>
              {mapMode === 'physical' ? (
                <>
                   <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#C8D6B9] border border-black"></div> Plateau</div>
                   <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#E0E0E0] border border-black"></div> Alpine</div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#D4D4D4] border border-black"></div> German</div>
                  <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#A3A3A3] border border-black"></div> French</div>
                  <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-[#737373] border border-black"></div> Italian</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#E1C16E] border border-black"></div> Romansh</div>
                </>
              )}
            </div>

            <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-xl p-8">
              <defs>
                <filter id="paper-texture">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <filter id="rough-terrain">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5" result="noise"/>
                  <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
                    <feDistantLight azimuth="45" elevation="10" />
                  </feDiffuseLighting>
                </filter>
                <linearGradient id="mountain-gradient" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                  <stop offset="50%" stopColor="#ccc" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Regions */}
              <g transform="translate(0, 0)">
                <MapPath 
                  d={paths.romandie} 
                  fill={getRegionColor('romandie', 'French')} 
                  onMouseEnter={() => setHoveredRegion('Suisse Romande')}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                <MapPath 
                  d={paths.german} 
                  fill={getRegionColor('german', 'German')} 
                  onMouseEnter={() => setHoveredRegion('Deutschschweiz')}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                <MapPath 
                  d={paths.ticino} 
                  fill={getRegionColor('ticino', 'Italian')} 
                  onMouseEnter={() => setHoveredRegion('Svizzera Italiana')}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                <MapPath 
                  d={paths.grisons} 
                  fill={getRegionColor('grisons', 'Romansh')} 
                  onMouseEnter={() => setHoveredRegion('Graubünden / Grischun')}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
              </g>

              {/* Physical Mode Overlays */}
              <PhysicalOverlay />

              {/* Lakes */}
              <g transform="translate(0, 0)">
                {paths.lakes.map((lake, i) => (
                  <path 
                    key={i} 
                    d={lake.d} 
                    fill="#2C4F6B" 
                    stroke="none" 
                    className="opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <title>{lake.name}</title>
                  </path>
                ))}
              </g>

              {/* Dialect Pins */}
              {SWISS_DATA.map((dialect) => (
                <g 
                  key={dialect.id}
                  transform={`translate(${dialect.coordinates.x * 8}, ${dialect.coordinates.y * 5})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setActiveDialectId(dialect.id);
                    setIsPlaying(false);
                  }}
                  onMouseEnter={() => setHoveredRegion(dialect.regionName)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  <circle 
                    r={activeDialectId === dialect.id ? 8 : 5} 
                    fill={activeDialectId === dialect.id ? '#DA291C' : '#1A1A1A'} 
                    stroke="white" 
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  {/* Pin Pulse */}
                  {activeDialectId === dialect.id && (
                    <circle r="12" fill="none" stroke="#DA291C" strokeWidth="1" className="animate-ping opacity-75" />
                  )}
                  {/* Tooltip Label on Map */}
                  <text 
                    y="-15" 
                    textAnchor="middle" 
                    className={`text-[12px] font-sans font-bold uppercase fill-swiss-ink transition-opacity bg-white ${activeDialectId === dialect.id || hoveredRegion === dialect.regionName ? 'opacity-100' : 'opacity-0'}`}
                    style={{ textShadow: '0 1px 2px white' }}
                  >
                    {dialect.regionName}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          
          <div className="mt-4 flex justify-between items-center border-t border-swiss-ink/20 pt-2">
            <div className="text-xs font-sans text-swiss-ink/50 uppercase tracking-widest">
              Scale 1:500,000 (Approx)
            </div>
            <div className="text-xs font-sans text-swiss-ink/50 uppercase tracking-widest">
              {hoveredRegion ? `Region: ${hoveredRegion}` : 'Select a region'}
            </div>
          </div>
        </div>

        {/* Sidebar / Detail Panel */}
        <div className="lg:col-span-4 flex flex-col h-full relative">
          
          {activeDialect ? (
            <div className="bg-white border border-swiss-ink/10 shadow-lg p-6 md:p-8 h-full flex flex-col animate-in slide-in-from-right-10 duration-500">
              
              <div className="flex justify-between items-start mb-6">
                 <div className="inline-block px-3 py-1 bg-swiss-red text-white text-xs font-sans font-bold uppercase tracking-widest mb-4">
                  {activeDialect.language}
                </div>
                <button onClick={() => setActiveDialectId(null)} className="text-swiss-ink/50 hover:text-swiss-red">
                  <X size={24} />
                </button>
              </div>

              <h2 className="text-4xl font-serif font-bold mb-2 leading-none text-swiss-ink">
                {activeDialect.name}
              </h2>
              <h3 className="text-lg font-serif italic text-swiss-ink/60 mb-6 border-b border-swiss-ink/20 pb-4">
                Region: {activeDialect.regionName}
              </h3>

              <p className="text-md leading-relaxed text-swiss-ink/80 mb-8 font-serif">
                {activeDialect.description}
              </p>

              {/* Sample Categories */}
              <div className="mt-auto">
                <div className="text-xs font-sans font-bold uppercase tracking-widest text-swiss-ink/40 mb-3">
                  Dialect Samples
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(Object.keys(activeDialect.samples) as Category[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setIsPlaying(false);
                      }}
                      className={`px-3 py-1 text-xs font-sans uppercase font-bold border transition-colors ${
                        activeCategory === cat 
                          ? 'bg-swiss-ink text-white border-swiss-ink' 
                          : 'bg-transparent text-swiss-ink border-swiss-ink/20 hover:border-swiss-ink'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Audio Player Component */}
                <AudioPlayer 
                  sample={activeDialect.samples[activeCategory]} 
                  isPlaying={isPlaying}
                  onToggle={() => setIsPlaying(!isPlaying)}
                />
              </div>

            </div>
          ) : (
            /* Empty State */
            <div className="h-full flex flex-col justify-center items-center text-center p-8 border-2 border-dashed border-swiss-ink/10 rounded-sm bg-swiss-cream/50">
              <div className="w-16 h-16 rounded-full bg-swiss-ink/5 flex items-center justify-center mb-4">
                <Info className="text-swiss-ink/40" />
              </div>
              <h3 className="text-xl font-serif font-bold text-swiss-ink/60 mb-2">Explore the Map</h3>
              <p className="text-sm font-sans text-swiss-ink/40 max-w-[200px]">
                Select a marker on the map to discover the unique dialects and cultural nuances of Switzerland.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 border-t border-swiss-ink pt-8 pb-12 grid grid-cols-12 gap-4 text-swiss-ink/60 text-sm font-sans">
        <div className="col-span-12 md:col-span-4">
          &copy; 2024 Helvetia Linguistics Project.
        </div>
        <div className="col-span-12 md:col-span-8 flex justify-start md:justify-end gap-8">
          <span>Sources</span>
          <span>Methodology</span>
          <span>About</span>
        </div>
      </footer>
    </div>
  );
};

export default App;