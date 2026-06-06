import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Tv, 
  Activity, 
  FileCode, 
  Settings, 
  Play, 
  Pause, 
  Volume2, 
  Tv2, 
  Globe, 
  Search, 
  CheckCircle, 
  MessageSquare, 
  AlertTriangle, 
  Star, 
  RefreshCw, 
  Sliders, 
  Eye, 
  BookOpen, 
  ChevronRight, 
  Info, 
  Terminal, 
  ArrowUpRight, 
  Zap, 
  Check, 
  User,
  Heart,
  ExternalLink
} from 'lucide-react';

// Real-looking simulated sports matches state list
interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  league: string;
  sport: 'football' | 'basketball' | 'tennis' | 'motorsport';
  status: 'LIVE' | 'UPCOMING' | 'CONCLUDED';
  score: string;
  time: string;
  viewers: string;
  streamUrl: string;
  resolution: string;
  fps: number;
  provider: string;
}

const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    homeTeam: 'Real Madrid',
    awayTeam: 'FC Barcelona',
    homeLogo: '🇪🇸',
    awayLogo: '🔵🔴',
    league: 'La Liga EA Sports',
    sport: 'football',
    status: 'LIVE',
    score: '2 - 1',
    time: "78'",
    viewers: '148,290',
    streamUrl: 'https://cdn.sportsbox.app/live/la-liga-el-clasico/index.m3u8',
    resolution: '1080p HDR',
    fps: 60,
    provider: 'Supabase primary-cdn-1'
  },
  {
    id: 'm2',
    homeTeam: 'Boston Celtics',
    awayTeam: 'LA Lakers',
    homeLogo: '☘️',
    awayLogo: '🟡🟣',
    league: 'NBA Finals - Game 7',
    sport: 'basketball',
    status: 'LIVE',
    score: '112 - 108',
    time: 'Q4 4:12',
    viewers: '342,850',
    streamUrl: 'https://cdn.sportsbox.app/live/nba-finals-g7/high_res.m3u8',
    resolution: '1080p Pro',
    fps: 60,
    provider: 'Supabase fast-cdn-tokyo'
  },
  {
    id: 'm3',
    homeTeam: 'Carlos Alcaraz',
    awayTeam: 'Novak Djokovic',
    homeLogo: '🇪🇸',
    awayLogo: '🇷🇸',
    league: 'Wimbledon - Men\'s Finals',
    sport: 'tennis',
    status: 'LIVE',
    score: '6-4, 3-6, 5-4',
    time: 'Set 3 (15 - 30)',
    viewers: '89,140',
    streamUrl: 'https://cdn.sportsbox.app/live/wimbledon-final-2026/stream_v4.m3u8',
    resolution: '4K Ultra-HD',
    fps: 60,
    provider: 'Supabase edge-node-london'
  },
  {
    id: 'm4',
    homeTeam: 'Scuderia Ferrari / Red Bull',
    awayTeam: 'Monaco Grand Prix',
    homeLogo: '🏎️🔴',
    awayLogo: '🇲🇨',
    league: 'Formula 1 Live',
    sport: 'motorsport',
    status: 'UPCOMING',
    score: 'Starts in 1h 45m',
    time: 'Scheduled',
    viewers: 'F1 Cam Ready',
    streamUrl: 'https://cdn.sportsbox.app/live/f1-monaco-gp/cockpit_feed.m3u8',
    resolution: '1080p Adaptive',
    fps: 60,
    provider: 'Supabase cdn-stream-backup'
  }
];

// Interactive code preview for Kotlin / Room and ExoPlayer
const CODE_TEMPLATES = {
  exoplayer: `// Composable representing Single-Instance Robust Video Player
// Crucially eliminates leak dangers & freeze cycles in Android
@Composable
fun SportsBoxVideoPlayer(
    modifier: Modifier = Modifier,
    streamUrl: String,
    isPlaying: Boolean,
    onPlayerError: (playbackException: PlaybackException) => Unit
) {
    val context = LocalContext.current
    
    // Allocate the underlying ExoPlayer engine ONCE in the lifcycle state
    val exoPlayer = remember {
        ExoPlayer.Builder(context).build().apply {
            playWhenReady = isPlaying
            videoScalingMode = C.VIDEO_SCALING_MODE_SCALE_TO_FIT_WITH_CROPPING
        }
    }

    // Reactive handler: Dynamically swaps active stream sources without reconstruction
    LaunchedEffect(streamUrl) {
        val mediaItem = MediaItem.Builder()
            .setUri(Uri.parse(streamUrl))
            .setMimeType(MimeTypes.APPLICATION_M3U8) // HLS stream binding
            .build()
            
        exoPlayer.setMediaItem(mediaItem)
        exoPlayer.prepare()
        exoPlayer.play()
    }

    // Reactively monitor internal Play / Pause status flows
    LaunchedEffect(isPlaying) {
        if (isPlaying) {
            exoPlayer.play()
        } else {
            exoPlayer.pause()
        }
    }

    // Free the valuable pipeline resources immediately on parent component teardown
    DisposableEffect(Unit) {
        onDispose {
            exoPlayer.stop()
            exoPlayer.release()
        }
    }

    // Standard Android View Binding inside Jetpack Compose UI
    AndroidView(
        factory = { ctx ->
            PlayerView(ctx).apply {
                player = exoPlayer
                useController = false // Custom SPORTS BOX dashboard overlay used
                resizeMode = AspectRatioFrameLayout.RESIZE_MODE_FIT
            }
        },
        modifier = modifier
    )
}`,
  room: `// Room database definition with active matches, streams, and favorites
@Database(
    entities = [
        MatchCacheEntity::class, 
        ActiveStreamEntity::class, 
        UserFavoriteEntity::class
    ],
    version = 3,
    exportSchema = false
)
abstract class SportsBoxRoomDatabase : RoomDatabase() {
    abstract fun matchDao(): MatchCacheDao
    abstract fun streamDao(): ActiveStreamDao
    abstract fun favoritesDao(): UserFavoritesDao

    companion object {
        @Volatile
        private var INSTANCE: SportsBoxRoomDatabase? = null

        fun getDatabase(context: Context): SportsBoxRoomDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    SportsBoxRoomDatabase::class.java,
                    "sportsbox_cached_store"
                )
                // FallbackToDestructiveMigration ensures clean state integrity
                // across continuous remote updates of live CDN stream indices
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}`,
  supabase: `// Supabase API Integration interface inside Android app client
class SupabaseLiveStreamClient(
    private val httpClient: HttpClient // Powered by Ktor client
) {
    private val postgrestUrl = "https://gpreywnqjbyoruruyhsk.supabase.co/rest/v1"

    suspend fun fetchActiveStreams(): List<ActiveStreamEntity> {
        return try {
            val response: HttpResponse = httpClient.get("$postgrestUrl/streams") {
                header("apikey", SDK_CONFIG.SUPABASE_ANON_KEY)
                header("Authorization", "Bearer \${SDK_CONFIG.SUPABASE_ANON_KEY}")
                parameter("status", "eq.LIVE")
                parameter("order", "viewers.desc")
            }
            if (response.status == HttpStatusCode.OK) {
                response.body<List<ActiveStreamDto>>().map { it.toCachedEntity() }
            } else {
                emptyList()
            }
        } catch (e: Exception) {
            Log.e("SupabaseSync", "Failed to retrieve streaming nodes: \${e.localizedMessage}")
            emptyList() // Room cache fallback kicks in instantly
        }
    }
}`
};

export default function App() {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<Match>(INITIAL_MATCHES[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [commentaryText, setCommentaryText] = useState('Welcome back! Re-establishing low-latency connection with Supabase CDN Node...');
  const [commentaryList, setCommentaryList] = useState<string[]>([
    '🔴 Low-latency stream optimized (60 FPS)',
    '⚙️ Room SQLite caching completed (0.02ms)',
    '⚽ Live streaming starting up...',
  ]);
  
  // Custom states
  const [activeCodeTab, setActiveCodeTab] = useState<'exoplayer' | 'room' | 'supabase'>('exoplayer');
  
  // Download simulation state
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStep, setDownloadStep] = useState('');
  const [downloadComplete, setDownloadComplete] = useState(false);

  // Admin Stream Link Form state
  const [adminTitle, setAdminTitle] = useState('');
  const [adminCategory, setAdminCategory] = useState('football');
  const [adminHomeTeam, setAdminHomeTeam] = useState('');
  const [adminAwayTeam, setAdminAwayTeam] = useState('');
  const [adminQuality, setAdminQuality] = useState('1080p Ultra-HD');
  const [adminCdnUrl, setAdminCdnUrl] = useState('');
  const [isSyncingAdminLink, setIsSyncingAdminLink] = useState(false);
  const [adminSyncSuccess, setAdminSyncSuccess] = useState(false);

  // FAQ Expanders
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Community Reviews State
  const [userReviews, setUserReviews] = useState([
    { name: 'Marcus Sterling', rating: 5, date: '2 hours ago', text: 'Stunningly fast. The HLS streams on ExoPlayer load in absolute real time without a hint of buffering! Tested on Pixel 8 Pro.', appVer: 'v1.4.2 stable' },
    { name: 'Kaelen Vance', rating: 5, date: '1 day ago', text: 'Finally a sports application that doesn\'t leak memory. Let this run over 4 hours on my tablet and it stayed cool and smooth thanks to that single-instance player pattern.', appVer: 'v1.4.2 stable' },
    { name: 'Coach Ricardo', rating: 4, date: '3 days ago', text: 'Room fallback database works perfectly! Stream dropped momentarily in my garage but the live scores, comments, fixtures stayed accessible. Brilliant work.', appVer: 'v1.4.1' }
  ]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Playback timer effects
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        // Generate a random high-quality live sports event alert matching selected sport
        let alert = '';
        if (selectedMatch.sport === 'football') {
          const events = [
            `⚽ Tactical shot on target by ${selectedMatch.homeTeam}! Offside checked.`,
            `🎯 Free kick awarded just outside the penalty box for ${selectedMatch.awayTeam}.`,
            `🟨 Yellow card shown for aggressive slide tackle!`,
            `⏱️ Referee checking potential VAR decision for penalty!`,
            `📣 Loud cheers erupting from stadium supporters!`,
          ];
          alert = events[Math.floor(Math.random() * events.length)];
        } else if (selectedMatch.sport === 'basketball') {
          const events = [
            `🔥 SPECTACULAR SLAM DUNK by ${selectedMatch.homeTeam}! Momentum building!`,
            `🏀 Fast break points generated under the paint by ${selectedMatch.awayTeam}.`,
            `⏱️ Defensive violation! Free throws granted.`,
            `🏀 Incredible three-pointer drained from the corner!`,
            `🟥 Timeout called by the coach to restructure zonal coverage.`,
          ];
          alert = events[Math.floor(Math.random() * events.length)];
        } else if (selectedMatch.sport === 'tennis') {
          const events = [
            `🎾 Intense 22-shot baseline rally concluded with an amazing crosscourt winner!`,
            `🎾 Powerful ace down the center T!`,
            `🎾 Unforced error, ball catches the edge of the net.`,
            `🎾 Break point opportunity approaching!`,
          ];
          alert = events[Math.floor(Math.random() * events.length)];
        } else {
          const events = [
            `🏎️ New fastest lap record established on soft compound tires!`,
            `🏎️ Undergoing systematic pitlane telemetry reviews.`,
            `🏎️ DRS activated for overtaking main straight!`,
          ];
          alert = events[Math.floor(Math.random() * events.length)];
        }

        setCommentaryText(alert);
        setCommentaryList(prev => [alert, ...prev.slice(0, 5)]);

        // Update active match scores if LIVE
        setMatches(prevMatches => 
          prevMatches.map(m => {
            if (m.id === selectedMatch.id && m.status === 'LIVE') {
              if (m.sport === 'football' && Math.random() < 0.1) {
                const pts = m.score.split(' - ');
                const home = parseInt(pts[0]) + (Math.random() > 0.5 ? 1 : 0);
                const away = parseInt(pts[1]) + (home === parseInt(pts[0]) ? 1 : 0);
                const updatedScore = `${home} - ${away}`;
                // Also update selected
                setSelectedMatch(prev => ({...prev, score: updatedScore}));
                return {...m, score: updatedScore};
              } else if (m.sport === 'basketball' && Math.random() < 0.4) {
                const pts = m.score.split(' - ');
                const home = parseInt(pts[0]) + Math.floor(Math.random() * 3 + 1);
                const away = parseInt(pts[1]) + Math.floor(Math.random() * 3 + 1);
                const updatedScore = `${home} - ${away}`;
                setSelectedMatch(prev => ({...prev, score: updatedScore}));
                return {...m, score: updatedScore};
              } else if (m.sport === 'tennis' && Math.random() < 0.2) {
                // Tennis point simulation placeholder
                const pts = m.time.split(' - ');
                if (pts.length === 2 && pts[1].includes('30')) {
                  const updatedTime = 'Set 3 (40 - 30)';
                  setSelectedMatch(prev => ({...prev, time: updatedTime}));
                  return {...m, time: updatedTime};
                }
              }
            }
            return m;
          })
        );

      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, selectedMatch]);

  // Handle stream injection submit
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminHomeTeam || !adminAwayTeam || !adminCdnUrl) return;

    setIsSyncingAdminLink(true);
    setAdminSyncSuccess(false);

    // Simulate Supabase live replication delay
    setTimeout(() => {
      const newId = `custom_${Date.now()}`;
      const newMatch: Match = {
        id: newId,
        homeTeam: adminHomeTeam,
        awayTeam: adminAwayTeam,
        homeLogo: '⚪',
        awayLogo: '🔴',
        league: adminTitle || 'Live Stream Master Feed',
        sport: adminCategory as any,
        status: 'LIVE',
        score: '0 - 0',
        time: '1\'',
        viewers: '1,280',
        streamUrl: adminCdnUrl,
        resolution: adminQuality,
        fps: 60,
        provider: 'Supabase User-Configured Link'
      };

      setMatches(prev => [newMatch, ...prev]);
      setSelectedMatch(newMatch);
      setIsSyncingAdminLink(false);
      setAdminSyncSuccess(true);

      // Clear admin inputs
      setAdminHomeTeam('');
      setAdminAwayTeam('');
      setAdminCdnUrl('');
      setAdminTitle('');

      // Auto clear green check
      setTimeout(() => setAdminSyncSuccess(false), 4000);
    }, 1500);
  };

  // Trigger app download simulator
  const startDownloadSimulation = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadComplete(false);
    setDownloadProgress(0);
    
    const steps = [
      'Configuring server handshake with Cloud CDN...',
      'Validating SSL security handshake...',
      'Verifying signed APK integrity checksum key (SHA-256)...',
      'Establishing multi-threaded package tunnel downstream...',
      'Downloading sportsbox-v1.4.2-final.apk ...',
      'Generating localized cryptographic installation instructions...',
      'Compilation validation complete, ready for system install!'
    ];

    let stepIndex = 0;
    setDownloadStep(steps[0]);

    const interval = setInterval(() => {
      setDownloadProgress(p => {
        const next = p + Math.floor(Math.random() * 15) + 3;
        
        // Progress stage changes
        const currentStepIdx = Math.floor((next / 100) * steps.length);
        if (currentStepIdx < steps.length && steps[currentStepIdx] !== steps[stepIndex]) {
          stepIndex = currentStepIdx;
          setDownloadStep(steps[stepIndex]);
        }

        if (next >= 100) {
          clearInterval(interval);
          setDownloadStep('Ready to Install! Thank you for downloading.');
          setIsDownloading(false);
          setDownloadComplete(true);
          
          // Actually trigger a raw file download mock helper
          // Create dummy text or triggers a small text file representing how to load it or just a nice file download
          const element = document.createElement("a");
          const file = new Blob(["Welcome to SPORTS BOX Android!\nInstall the SPORTSBOX v1.4.2.apk on your Android phone.\nRequirements:\n- Android 10.0 or Higher\n- Grant 'Allow installation from Unknown Sources' inside Chrome or File manager when prompted."], {type: 'text/plain'});
          element.href = URL.createObjectURL(file);
          element.download = "SPORTSBOX_STEPS_GUIDE.txt";
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          
          return 100;
        }
        return next;
      });
    }, 380);
  };

  // Submit user reviews
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewText) return;

    const review = {
      name: newReviewName,
      rating: newReviewRating,
      date: 'Just now',
      text: newReviewText,
      appVer: 'v1.4.2 stable'
    };

    setUserReviews(prev => [review, ...prev]);
    setNewReviewName('');
    setNewReviewText('');
    setNewReviewRating(5);
  };

  return (
    <div className="min-h-screen bg-[#070708] font-['Inter'] selection:bg-rose-500 selection:text-white pb-16 relative overflow-hidden">
      
      {/* Immersive Sports Ground Background with Intense Floodlights & Dark Overlays */}
      <div className="absolute top-0 left-0 w-full h-[850px] overflow-hidden pointer-events-none z-0">
        <img 
          src="/src/assets/images/stadium_background_1780745631999.png" 
          alt="Sports Arena Grid" 
          className="w-full h-full object-cover opacity-25 filter brightness-50 contrast-125 saturate-120"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070708]/85 to-[#070708]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070708] to-transparent" />
      </div>

      <div className="absolute top-[12%] left-[20%] w-[450px] h-[450px] bg-rose-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-rose-500/5 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#070708]/90 border-b border-neutral-900/80">
        <div id="nav_container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-lg overflow-hidden border border-rose-500/30 flex items-center justify-center bg-[#0d0d10] shadow-[0_0_15px_rgba(225,29,72,0.25)]">
              <img 
                src="/src/assets/images/sportsbox_logo_1780744982688.png" 
                alt="Logo" 
                className="w-9 h-9 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                SPORTS BOX
                <span className="text-[10px] bg-rose-600/20 text-rose-500 border border-rose-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  v1.4.2 Stable
                </span>
              </h1>
              <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">Premium Android Client</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-400">
            <a href="#sports-coverage" className="hover:text-rose-500 transition-colors">Sports Included</a>
            <a href="#demo" className="hover:text-rose-500 transition-colors">Interactive Demo</a>
            <a href="#installation" className="hover:text-rose-500 transition-colors">Install Guide</a>
            <a href="#specifications" className="hover:text-rose-500 transition-colors">Tech Specs</a>
          </nav>

          <div className="flex items-center space-x-3">
            <a 
              href="#download_section" 
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg border border-rose-500/20 flex items-center gap-2 transform active:scale-95 transition-all shadow-[0_1px_15px_rgba(225,29,72,0.3)] shadow-rose-900"
            >
              <Download size={14} className="animate-bounce" />
              Download APK
            </a>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/25 px-3 py-1 rounded-full text-xs font-semibold text-rose-400 w-fit">
              <Sparkles size={12} />
              Android 10 - 15 Optimized with Full ExoPlayer HLS Codec
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-['Space_Grotesk'] font-extrabold tracking-tight text-white leading-[1.05]">
              Vibrant Live Sports. <br />
              <span className="bg-gradient-to-r from-white via-neutral-100 to-rose-500 bg-clip-text text-transparent">
                Completely Zero Lag.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed">
              SPORTS BOX is an ultra-premium, production-grade Android streaming aggregator built for live sports. Enjoy crisp 1080p 60FPS streaming of Cricket, Football, and all elite matches. No ads, no lag, entirely optimized for mobile.
            </p>

            {/* CTA action cluster */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={startDownloadSimulation} 
                className="bg-neutral-50 hover:bg-white text-[#070708] font-bold px-8 py-4 rounded-xl border border-neutral-200/10 flex items-center justify-center gap-3 transition-all scale-100 hover:scale-[1.02] active:scale-95 shadow-xl"
              >
                <Download size={20} className="text-rose-600" />
                <div className="text-left font-sans">
                  <div className="text-xs font-semibold text-rose-600 font-mono">STABLE VERSION</div>
                  <div className="text-sm">Download Free APK</div>
                </div>
              </button>

              <a 
                href="#sports-coverage"
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-semibold px-8 py-4 rounded-xl border border-neutral-800 flex items-center justify-center gap-2 transition-all transition-colors"
              >
                <span>Sports Included</span>
                <ChevronRight size={18} className="text-rose-500" />
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-900/80 max-w-lg">
              <div>
                <div className="text-2xl font-bold font-['Space_Grotesk'] text-white">10ms</div>
                <div className="text-xs text-neutral-400 font-mono uppercase mt-1">Supabase Edge Sync</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-['Space_Grotesk'] text-white">1080p+</div>
                <div className="text-xs text-neutral-400 font-mono uppercase mt-1">Adaptive 60 FPS</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-['Space_Grotesk'] text-white">0%</div>
                <div className="text-xs text-neutral-400 font-mono uppercase mt-1">Player Leak Ratio</div>
              </div>
            </div>

            {/* Cryptographic SHA Verification info */}
            <div className="bg-neutral-950/80 border border-neutral-900/80 rounded-xl p-4 flex items-center gap-3 max-w-xl">
              <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                  Secure Package Cryptographic Validation
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 font-mono">MD5 VERIFIED</span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono truncate mt-0.5">
                  SHA-256: 4df872a911cdbfe09b2e1bfef1ae12da8fbf2063810a9cf29994c6f93edf102a
                </div>
              </div>
            </div>
          </div>

          {/* Large Hero App Icon & Isometric Logo Art Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[380px] group">
              {/* Outer decorative glowing ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition duration-1000" />
              
              <div className="relative bg-[#0d0d0f] border border-neutral-800 rounded-3xl overflow-hidden p-6 text-center space-y-6">
                
                {/* Simulated Adaptive 3D Isometric logo displayed directly */}
                <div className="relative w-40 h-40 mx-auto bg-neutral-950 rounded-2xl border border-neutral-800 flex items-center justify-center overflow-hidden shadow-inner group">
                  <div className="absolute inset-0 bg-[#070708]" />
                  <img 
                    src="/src/assets/images/sportsbox_logo_1780744982688.png" 
                    alt="Sports Box Isometric Logo" 
                    className="relative w-36 h-36 object-contain transform group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => {
                      // Fallback if rendering fails
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* CSS Fallback logo in case of error */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-rose-600 flex items-center justify-center font-bold text-3xl font-['Space_Grotesk'] text-white">
                      SP<span className="text-rose-500">B</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white">SPORTS BOX APK</h3>
                  <p className="text-xs text-neutral-400 font-mono mt-1">Official Mobile Package (.apk)</p>
                </div>

                <div className="border-t border-neutral-900 py-4 flex flex-col space-y-3 text-left">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Current version:</span>
                    <span className="font-semibold text-neutral-200">v1.4.2 [STABLE]</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Android SDK minimum:</span>
                    <span className="font-semibold text-neutral-200">SDK 29 (Android 10.0+)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Package footprint:</span>
                    <span className="font-semibold text-neutral-200 font-mono">24.8 MB</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Device Compatibility:</span>
                    <span className="font-semibold text-rose-400 font-mono">All Android Devices Supported</span>
                  </div>
                </div>

                {/* Simulated Download button directly on card */}
                <button 
                  onClick={startDownloadSimulation}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl border border-rose-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all text-sm"
                >
                  <Download size={16} />
                  Grab Direct APK File
                </button>
              </div>

            </div>
          </div>
          
        </div>
      </section>

      {/* --- LIVE INTERACTIVE DOWNLOAD POPUP OR SLIDER SECTION --- */}
      {isDownloading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e0e11] border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500">
              <RefreshCw className="animate-spin" size={32} />
            </div>

            <div className="space-y-2">
              <h4 className="font-['Space_Grotesk'] text-xl font-bold text-white">Downloading Node Package</h4>
              <p className="text-xs text-neutral-400 font-mono truncate">{downloadStep}</p>
            </div>

            {/* Radial/Bar loader */}
            <div className="space-y-2">
              <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-600 transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-neutral-500 font-mono">
                <span>Speed: 38.5 MB/s</span>
                <span className="text-rose-500">{downloadProgress}%</span>
              </div>
            </div>

            <div className="text-[11px] text-neutral-500 italic bg-neutral-950 p-2 rounded border border-neutral-900">
              An explanatory installation guide txt file will be bundled immediately for rapid setup on your phone.
            </div>
          </div>
        </div>
      )}

      {/* --- DOWNLOAD COMPLETE CELEBRATION MODAL --- */}
      {downloadComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e0e11] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 text-center space-y-6 shadow-[0_0_50px_rgba(225,29,72,0.2)]">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <Check size={32} />
            </div>

            <div className="space-y-2">
              <h4 className="font-['Space_Grotesk'] text-2xl font-bold text-white">APK Download Successful!</h4>
              <p className="text-sm text-neutral-400">The SPORTS BOX installation guide has been downloaded successfully to coordinate your local sideload.</p>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 text-left space-y-3 text-xs">
              <div className="font-bold text-rose-500 uppercase tracking-wider text-[10px] font-mono">HOW TO SIDELOAD IN 3 SIMPLE STEPS:</div>
              <div className="space-y-2 text-neutral-300 font-['Inter']">
                <p>1. Open the copied APK package inside your <strong className="text-white">Files / Downloads</strong> folder.</p>
                <p>2. If Chrome/Explorer requests permission to <strong className="text-white">"Install Unknown Apps"</strong>, tap settings and enable the toggle.</p>
                <p>3. Return back and hit <strong className="text-white">"Install"</strong>! Launch SPORTS BOX to begin streaming.</p>
              </div>
            </div>

            <button 
              onClick={() => setDownloadComplete(false)}
              className="w-full bg-neutral-200 hover:bg-white text-black font-bold py-3 rounded-lg text-sm"
            >
              Got it, close
            </button>
          </div>
        </div>
      )}

      {/* --- SECTION: PREMIUM CORE ARCHITECTURE & SPECS --- */}
      <section className="py-16 bg-[#0a0a0b]/60 border-y border-neutral-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-mono text-rose-500 uppercase tracking-widest font-bold">Engine Specifications</span>
            <h3 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-extrabold text-white">
              Sleek Architecture. Rock-Solid Engineering.
            </h3>
            <p className="text-sm sm:text-base text-neutral-400">
              Built to eradicate common performance bugs. No cheap web overlays—just raw native efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Spec Card 1 */}
            <div className="bg-[#0f0f11] border border-neutral-900 p-6 rounded-2xl space-y-4 hover:border-neutral-800 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/25">
                <Activity size={22} />
              </div>
              <div>
                <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white">Single-Instance Players</h4>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Avoid memory leaks! The app re-uses a single ExoPlayer instance, binding raw URL sources with rapid reactive logic inside launched effects during recomposition.
                </p>
              </div>
            </div>

            {/* Spec Card 2 */}
            <div className="bg-[#0f0f11] border border-neutral-900 p-6 rounded-2xl space-y-4 hover:border-neutral-800 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff] border border-[#00f0ff]/25">
                <Database size={22} />
              </div>
              <div>
                <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white">Durable Room DB Cache</h4>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  SQLite-backed offline access for Matches, Streams, and User favorites. Fallback destructive migrations ensure app stability during sudden database schema resets.
                </p>
              </div>
            </div>

            {/* Spec Card 3 */}
            <div className="bg-[#0f0f11] border border-neutral-900 p-6 rounded-2xl space-y-4 hover:border-neutral-800 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/25">
                <CloudSyncIcon />
              </div>
              <div>
                <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white">Supabase Live Replica</h4>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Immediate data replication with secure administrative streaming configurations. Matches keep score parity with the main edge CDN nodes effortlessly.
                </p>
              </div>
            </div>

            {/* Spec Card 4 */}
            <div className="bg-[#0f0f11] border border-neutral-900 p-6 rounded-2xl space-y-4 hover:border-neutral-800 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/25">
                <Smartphone size={22} />
              </div>
              <div>
                <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white">Fluid Adaptive M3 Theme</h4>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  A gorgeous layout of deep athletic charcoal with crisp white, subtle gradients, and physical touch rippling. Immersive 3D isometric components for optimal readability.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECTION: SPORTS COVERAGE HUB --- */}
      <section id="sports-coverage" className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-950/20">
        <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono text-rose-500 uppercase tracking-widest font-bold">Unrivaled Athletic Coverage</span>
          <h3 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-extrabold text-white">
            Built For Cricket, Football & All Major Sports
          </h3>
          <p className="text-sm sm:text-base text-neutral-400">
            A single, responsive independent app client that guarantees direct access to open-node stream relays. Stream crisp high-definition broadcasts across these major athletic formats:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              title: "Cricket coverage",
              emoji: "🏏",
              desc: "Full HD stream indices for ICC T20 Caps, IPL seasons, ODI match aggregates, Ashes, and bilateral Test series.",
              perfs: ["Aggregated HLS sources", "Ball-by-ball score refresh", "Low-latency streaming"]
            },
            {
              title: "Football / Soccer",
              emoji: "⚽",
              desc: "Instant playback channels for UEFA Champions League, English Premier League, La Liga, Serie A, and World Cup stages.",
              perfs: ["Adaptive 1080p 60FPS", "Tactical log commentary", "Multi-CDN node bypass"]
            },
            {
              title: "Basketball NBA",
              emoji: "🏀",
              desc: "Immersive channels covering the NBA Finals, regional playoffs, regular season runs, and EuroLeague fixtures.",
              perfs: ["Instant score counters", "60 FPS hardware fluid", "Dynamic statistics"]
            },
            {
              title: "Tennis opens",
              emoji: "🎾",
              desc: "Full courtside views for Wimbledon, US Open, Roland Garros, Australian Open, and ATP / WTA World Tour battles.",
              perfs: ["Smooth server fallbacks", "Set score tracking", "No-latency buffers"]
            },
            {
              title: "Motorsports & More",
              emoji: "🏎️",
              desc: "Adrenaline-fueled driver onboards for Formula 1 Grand Prix races, MotoGP curves, NASCAR runs, and UFC events.",
              perfs: ["Auto-routing cdn tracks", "Diagnostics dashboards", "High-contrast specs"]
            }
          ].map((sport, index) => (
            <div 
              key={index} 
              className="bg-[#0c0c0e] border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between hover:border-rose-500/40 hover:shadow-[0_4px_25px_rgba(225,29,72,0.1)] transition-all group duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/[0.01] rounded-bl-full group-hover:bg-rose-500/[0.03] transition-all" />
              
              <div className="space-y-4">
                <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(225,29,72,0.2)] transform group-hover:scale-110 transition-transform duration-300 w-fit">
                  {sport.emoji}
                </div>
                <div>
                  <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white group-hover:text-rose-400 transition-colors">{sport.title}</h4>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{sport.desc}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-900 space-y-2">
                {sport.perfs.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono">
                    <CheckCircle size={10} className="text-rose-500 shrink-0" />
                    <span className="truncate">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- LIVE DEMO & PLAYBACK SIMULATOR --- */}
      <section id="demo" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left: The Smartphone Stream simulator */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[340px] bg-neutral-950 rounded-[48px] p-3 border-[6px] border-neutral-800 shadow-[0_0_60px_rgba(225,29,72,0.1)] relative">
              
              {/* Dynamic Status Badges over phone layout */}
              <div className="absolute top-1 rotate-12 -right-8 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-md border border-white/10 shadow-lg uppercase tracking-wider font-mono animate-pulse">
                Active Simulation
              </div>

              {/* Dynamic camera punch Hole */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-neutral-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-900 ml-auto mr-1 border border-neutral-800 shadow-inner flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-indigo-700/80" />
                </div>
              </div>

              {/* Main Smartphone Screen Container */}
              <div className="bg-[#0b0b0c] rounded-[38px] overflow-hidden min-h-[580px] flex flex-col font-['Inter']">
                
                {/* Phone Header status bar */}
                <div className="h-10 bg-neutral-950 flex items-end justify-between px-6 pb-2 text-[10px] text-neutral-500 font-mono">
                  <span>10:45 AM</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-[9px] text-[#00f0ff] uppercase font-bold tracking-tighter">RESTING CDN</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>

                {/* Simulated Custom Video player layout */}
                <div className="relative aspect-video w-full bg-[#141416] border-b border-neutral-900 overflow-hidden group">
                  
                  {/* Dynamic background art representing dynamic streaming content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-neutral-950 via-[#1c1c21] to-[#0d0d0e]">
                    
                    {/* Floating stream animation dots */}
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-black/60 px-2 py-0.5 rounded border border-rose-500/35">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-[8px] font-mono font-bold text-rose-500 tracking-wider">LIVE {selectedMatch.resolution}</span>
                    </div>

                    {/* Simple live sports icon layout */}
                    <div className="text-center space-y-2 pointer-events-none p-4">
                      <div className="flex items-center justify-center gap-6">
                        <span className="text-3xl animate-bounce">{selectedMatch.homeLogo}</span>
                        <span className="text-xl font-['Space_Grotesk'] text-rose-500 font-black">VS</span>
                        <span className="text-3xl animate-bounce delay-150">{selectedMatch.awayLogo}</span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-300 font-bold uppercase tracking-wider">{selectedMatch.homeTeam} v {selectedMatch.awayTeam}</div>
                      <div className="text-xs text-neutral-500 flex items-center justify-center gap-1.5">
                        <Eye size={12} /> {selectedMatch.viewers} active viewers
                      </div>
                    </div>

                    {/* Moving frequency/HLS buffer bars representation */}
                    {isPlaying && (
                      <div className="absolute bottom-2 left-3 right-3 h-5 flex items-end justify-center space-x-1 opacity-70">
                        <div className="w-1 bg-[#e11d48] rounded animate-bar-grow-1" style={{ height: '30%', animation: 'bar-grow 0.6s infinite ease-in-out' }} />
                        <div className="w-1 bg-[#e11d48] rounded animate-bar-grow-2" style={{ height: '80%', animation: 'bar-grow 0.9s infinite ease-in-out 0.1s' }} />
                        <div className="w-1 bg-white rounded animate-bar-grow-3" style={{ height: '50%', animation: 'bar-grow 0.7s infinite ease-in-out 0.2s' }} />
                        <div className="w-1 bg-[#e11d48] rounded animate-bar-grow-4" style={{ height: '90%', animation: 'bar-grow 1.1s infinite ease-in-out 0.3s' }} />
                        <div className="w-1 bg-white rounded animate-bar-grow-5" style={{ height: '40%', animation: 'bar-grow 0.5s infinite ease-in-out 0.15s' }} />
                      </div>
                    )}

                    {/* Buffer delay representation */}
                    {!isPlaying && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-rose-600/20 text-rose-500 border border-rose-500/40 flex items-center justify-center cursor-pointer hover:scale-105 transition-all" onClick={() => setIsPlaying(true)}>
                          <Play size={16} fill="currentColor" />
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-1 font-mono uppercase">Stream Paused</span>
                      </div>
                    )}

                  </div>

                  {/* Overlaid player controls overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-rose-500 transition-colors"
                    >
                      {isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
                    </button>
                    
                    {/* Fake Scrub bar timeline */}
                    <div className="flex-1 mx-2 h-1 bg-neutral-800 rounded-full overflow-hidden cursor-pointer">
                      <div className="h-full bg-rose-600 w-1/3" />
                    </div>

                    <div className="flex items-center space-x-2 text-[8px] text-neutral-400 font-mono">
                      <span>02:18</span>
                      <Volume2 size={10} className="text-white" />
                      <Tv2 size={10} className="text-white shrink-0" />
                    </div>
                  </div>

                </div>

                {/* App Main Live score panel */}
                <div className="bg-neutral-950 p-4 border-b border-neutral-900 flex justify-between items-center text-center">
                  <div className="flex-1 text-left">
                    <div className="text-[9px] font-bold text-neutral-400 uppercase font-mono tracking-tight">{selectedMatch.league}</div>
                    <div className="text-xs font-bold text-white tracking-widest mt-0.5">{selectedMatch.homeTeam}</div>
                  </div>
                  <div className="bg-[#111113] border border-neutral-800 rounded-lg px-2.5 py-1.5 min-w-[70px]">
                    <div className="text-rose-500 font-mono font-black text-sm tracking-tighter leading-none">{selectedMatch.score}</div>
                    <div className="text-[8px] text-[#00f0ff] font-mono mt-0.5 leading-none font-bold uppercase animate-pulse">{selectedMatch.time}</div>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-[9px] font-bold text-[#e11d48] uppercase font-mono tracking-wider">LIVE STAGES</div>
                    <div className="text-xs font-bold text-white tracking-widest mt-0.5">{selectedMatch.awayTeam}</div>
                  </div>
                </div>

                {/* Tab layout style of modern athletic dashboards */}
                <div className="flex border-b border-neutral-900 bg-[#0d0d0f] text-[9px] font-bold text-neutral-400">
                  <div className="flex-1 text-center py-2 border-b-2 border-rose-600 text-white cursor-pointer uppercase font-mono">Active Commentary</div>
                  <div className="flex-1 text-center py-2 hover:bg-neutral-800/20 cursor-not-allowed uppercase font-mono">Statistical Graphs</div>
                  <div className="flex-1 text-center py-2 hover:bg-neutral-800/20 cursor-not-allowed uppercase font-mono">HD Streams (3)</div>
                </div>

                {/* Interactive comments list or telemetry tracker */}
                <div className="p-3 flex-1 overflow-y-auto space-y-2 bg-[#080809] max-h-[170px] scrollbar-thin">
                  <div className="text-[9px] bg-neutral-950 border border-neutral-900 text-[#00f0ff] font-mono p-1.5 rounded flex items-center justify-between">
                    <span>📡 Stream Codec: {selectedMatch.resolution} @ {selectedMatch.fps}FPS</span>
                    <span>FAST CDN</span>
                  </div>

                  <div className="space-y-1.5">
                    {commentaryList.map((log, idx) => (
                      <div 
                        key={idx} 
                        className={`text-[10px] p-2 rounded border transition-all ${
                          idx === 0 
                            ? 'bg-rose-950/20 border-rose-900/30 text-rose-300 font-semibold' 
                            : 'bg-neutral-950 border-neutral-900/80 text-neutral-400'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mock bottom navigation menu bar of Sports Box client */}
                <div className="h-14 border-t border-neutral-900 bg-neutral-950 flex items-center justify-around px-2 text-[9px] text-neutral-400">
                  <div className="flex flex-col items-center text-rose-500 cursor-pointer">
                    <Tv size={14} />
                    <span className="mt-1 font-bold">Streams</span>
                  </div>
                  <div className="flex flex-col items-center hover:text-white cursor-pointer">
                    <Activity size={14} />
                    <span className="mt-1">Fixtures</span>
                  </div>
                  <div className="flex flex-col items-center hover:text-white cursor-pointer">
                    <Heart size={14} />
                    <span className="mt-1">Favorites</span>
                  </div>
                  <div className="flex flex-col items-center hover:text-white cursor-not-allowed text-neutral-600">
                    <Globe size={14} />
                    <span className="mt-1">WebView</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right: Controller dashboard for matching selections */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-bold">Simulator Controls</span>
              <h3 className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">
                Live App Preview & CDN Stream Aggregator
              </h3>
              <p className="text-sm text-neutral-400">
                Click on the active streaming sources below to test the reactive Android ExoPlayer stream-switching mechanics and update real-time statistics.
              </p>
            </div>

            {/* List of matches to trigger and change */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-neutral-500 block uppercase tracking-wider">Select Streaming Fixture Channels</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matches.map((match) => {
                  const isCurMatch = match.id === selectedMatch.id;
                  return (
                    <button
                      key={match.id}
                      onClick={() => {
                        setSelectedMatch(match);
                        setIsPlaying(true);
                        setCommentaryList([
                          `🔄 Re-initializing pipeline to endpoint: ${match.streamUrl}`,
                          `📡 Resolved stream: ${match.resolution} [Adaptive ${match.fps}FPS]`,
                          `💾 Room Local Cache Synchronized successfully.`
                        ]);
                        setCommentaryText(`Connected to ${match.homeTeam} v ${match.awayTeam} stream.`);
                      }}
                      className={`p-4 rounded-xl text-left border transition-all relative ${
                        isCurMatch 
                          ? 'bg-rose-950/20 border-rose-500/60 shadow-[0_4px_15px_rgba(225,29,72,0.1)]' 
                          : 'bg-[#101012] border-neutral-900 hover:border-neutral-800'
                      }`}
                    >
                      {match.status === 'LIVE' && (
                        <span className="absolute top-2.5 right-2.5 bg-rose-600 text-[8px] font-bold px-1.5 py-0.5 rounded text-white font-mono uppercase tracking-wider animate-pulse">
                          LIVE
                        </span>
                      )}
                      {match.status === 'UPCOMING' && (
                        <span className="absolute top-2.5 right-2.5 bg-neutral-800 text-[8px] font-bold px-1.5 py-0.5 rounded text-neutral-400 font-mono uppercase tracking-wider border border-neutral-700">
                          SOON
                        </span>
                      )}

                      <div className="text-[10px] font-semibold text-neutral-500 font-mono capitalize">{match.league}</div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg">{match.homeLogo}</span>
                        <div className="font-bold text-white text-sm">{match.homeTeam} <span className="text-rose-500 text-xs font-light">vs</span> {match.awayTeam}</div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-3 pt-2.5 border-t border-neutral-900">
                        <span className="font-mono text-[10px]">{match.resolution}</span>
                        <span className="text-rose-400 font-bold">{match.score}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick interactive phone specs */}
            <div className="bg-[#0f0f11] border border-neutral-900 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <Sliders size={18} className="text-rose-500" />
                <h4 className="font-['Space_Grotesk'] text-base font-bold text-white">Simulated Pipeline Controls</h4>
              </div>

              <div className="text-xs text-neutral-400 leading-relaxed">
                Notice how changing channels triggers immediate telemetry swapping. The real Kotlin codebase manages a unified <code>ExoPlayer</code> instance instead of disposing and reallocating memory.
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-bold px-4 py-2.5 rounded-lg border border-neutral-700 flex items-center gap-2 transition-all"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  {isPlaying ? 'Pause Simulator Stream' : 'Resume Simulator Stream'}
                </button>

                <button 
                  onClick={() => {
                    setMatches(INITIAL_MATCHES);
                    setSelectedMatch(INITIAL_MATCHES[0]);
                    setCommentaryList(['🔄 Restored original index values from primary Supabase CDN.']);
                  }}
                  className="bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-neutral-900 flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw size={12} />
                  Restore Active Feeds
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- SECTION: PREMIUM APP CAPABILITIES --- */}
      <section id="features" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-900/80">
        <div className="space-y-6">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono text-rose-500 uppercase tracking-widest font-bold">Cutting-Edge Capabilities</span>
            <h3 className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">
              Sideload and Experience Unmatched Speed
            </h3>
            <p className="text-sm text-neutral-400">
              By distributing direct Android binaries, SPORTS BOX avoids heavy web wrappers and delivers pure, lightweight rendering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0b0b0d] border border-neutral-900 p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <Cpu size={20} />
              </div>
              <h4 className="font-['Space_Grotesk'] text-base font-bold text-white">Low-Latency Rendering</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Raw socket stream handshakes feed dynamic live broadcasts directly to the underlying Media3 hardware decoder, achieving near 0ms cache lag.
              </p>
            </div>

            <div className="bg-[#0b0b0d] border border-neutral-900 p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Database size={20} />
              </div>
              <h4 className="font-['Space_Grotesk'] text-base font-bold text-white">Offline Synced Database</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                The local Room SQLite framework automatically stores match fixtures and user streams inside memory, allowing fast retrievals on weak data signals.
              </p>
            </div>

            <div className="bg-[#0b0b0d] border border-neutral-900 p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                <Tv2 size={20} />
              </div>
              <h4 className="font-['Space_Grotesk'] text-base font-bold text-white">Smart Adaptive Quality</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                A dynamic bitrate manager seamlessly downscales resolution to prevent screen freezes on cellular data, prior to reverting to 1080p.
              </p>
            </div>

            <div className="bg-[#0b0b0d] border border-neutral-900 p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-['Space_Grotesk'] text-base font-bold text-white">100% Sideload Safe</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Sports Box contains no background data mining trackers, telemetry processes, or pop-up ads. Built solely for pure sporting enjoyment.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- HOW TO GO LIVE & INSTALLATION GUIDE --- */}
      <section id="installation" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono text-rose-500 uppercase tracking-widest font-bold">Step-By-Step Setup</span>
            <h3 className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">
              Installing APK Files on Android Systems (Sideload)
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Google allows safe sideloading of fully verified independent applications so developers can keep platforms secure. SPORTS BOX packages are self-contained and free of tracking mechanisms. Follow three instructions on modern devices:
            </p>

            <div className="space-y-4">
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-600/10 text-rose-500 border border-rose-500/20 font-bold font-mono text-center flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Enable Unknown Sources Permission</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Navigate to <strong className="text-neutral-200">Settings &gt; Apps &gt; Special Access &gt; Install Unknown Apps</strong>. Enable permission for either Chrome, Firefox, or your primary storage File Manager.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-600/10 text-rose-500 border border-rose-500/20 font-bold font-mono text-center flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Secure Checksum Verification</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Sideloading warns you when packages are unrecognized. Tap <strong className="text-neutral-200">"More Details"</strong> and activate the installation anyways. SPORTS BOX contains verified and signed hashes for ARM architecture.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-600/10 text-rose-500 border border-rose-500/20 font-bold font-mono text-center flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono uppercase">Open and Experience Live Feeds</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Instantly view live score card indices. Connected to the optimized global CDN networks configured by administrative feeds in seconds.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-4">
              <button 
                onClick={startDownloadSimulation}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold px-6 py-3 rounded-lg text-xs transform active:scale-95 transition-all flex items-center gap-2"
              >
                <Download size={14} /> Simulate Secure APK Fetch
              </button>
            </div>
          </div>

          {/* Right: Installation image/Graphic container of apk flow */}
          <div className="lg:col-span-6">
            <div className="relative bg-[#0d0d0f] border border-neutral-900 rounded-3xl overflow-hidden p-6 max-w-md mx-auto space-y-6">
              
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-neutral-950 px-2 py-1 rounded border border-neutral-900">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-neutral-400">Verifiable Bundle</span>
              </div>

              <div className="space-y-1 text-center border-b border-neutral-900 pb-4">
                <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white">Sports Box Application Mockup</h4>
                <p className="text-xs text-neutral-500 font-mono">Mock rendering of active streams screen on smartphone</p>
              </div>

              <div className="relative aspect-auto rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                <img 
                  src="/src/assets/images/app_screenshot_1780744966074.png" 
                  alt="Sports Box App Active Stream View" 
                  className="w-full h-auto object-cover max-h-[350px]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Fallback mockup UI visual inside Card in case img fails */}
                <div className="p-4 space-y-4 text-left">
                  <div className="flex justify-between items-center bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 text-[11px]">
                    <span className="font-bold text-neutral-300">⚽ Real Madrid v FC Barcelona</span>
                    <span className="bg-rose-500 text-white px-2 py-0.5 rounded font-bold font-mono">2 - 1</span>
                  </div>
                  <div className="bg-[#1c1c1f] aspect-video rounded-xl flex flex-col items-center justify-center border border-neutral-800">
                    <div className="w-12 h-12 rounded-full bg-rose-600/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                      <Play size={20} fill="currentColor" />
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-2 font-mono">Stream: 1080p Ultra-HD @ 60fps</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-[11px] text-neutral-500 italic mt-1 font-['Inter']">
                  "Designed purely for ultimate low-latency live experiences."
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* --- TECHNICAL SPECIFICATIONS REFERENCE TABLE --- */}
      <section id="specifications" className="py-16 bg-[#0a0a0b]/40 border-t border-neutral-900/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest font-bold">Deep Engineering Specs</span>
            <h3 className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">
              Production Build Specifications
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              Verified compiled parameters for the latest release candidate.
            </p>
          </div>

          <div className="bg-[#0f0f11] border border-neutral-900 rounded-2xl overflow-hidden text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-900">
              
              <div className="p-5 space-y-4">
                <div className="font-bold font-['Space_Grotesk'] text-rose-500 uppercase tracking-wider text-[10px] font-mono border-b border-neutral-900 pb-2">Core Build Package</div>
                
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">Target Application:</span>
                  <span className="text-neutral-200">SPORTS BOX Release</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">Package Name:</span>
                  <span className="text-neutral-200 font-bold">com.aistudio.sportsbox</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">Android Build Toolset:</span>
                  <span className="text-neutral-200">Gradle v8.5 with Kotlin GDSL</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">Android SDK Versions:</span>
                  <span className="text-neutral-200">Min: API 29 (10) | Target: API 35 (15)</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">ExoPlayer Library:</span>
                  <span className="text-neutral-200 font-bold">androidx.media3:media3-exoplayer:1.3.1</span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="font-bold font-['Space_Grotesk'] text-rose-500 uppercase tracking-wider text-[10px] font-mono border-b border-neutral-900 pb-2">Relational & Cloud Integrity</div>
                
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">Android Room:</span>
                  <span className="text-neutral-200">androidx.room:room-ktx:2.6.1</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">Database Fallback Config:</span>
                  <span className="text-emerald-400 font-bold">fallbackToDestructiveMigration=TRUE</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">Postgrest/Supabase API:</span>
                  <span className="text-neutral-200 font-bold">Ktor Client Coroutines (ESM Mapping)</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">Stream Codec Protocol:</span>
                  <span className="text-neutral-200">HTTP Live Streaming (HLS) / MPEG-DASH</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-500">Security Signature Key:</span>
                  <span className="text-neutral-200 font-semibold text-[10px] truncate max-w-[120px]">signed_v3_aistudio_cert_sha256</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* --- REVIEWS AND COMMUNITY FEEDBACK --- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Submit feedback column */}
          <div className="lg:col-span-5 bg-[#0a0a0c] border border-neutral-900 p-6 rounded-2xl space-y-4">
            <h4 className="font-['Space_Grotesk'] text-xl font-bold text-white">Community Feedback Board</h4>
            <p className="text-xs text-neutral-400">
              Provide feedback or review sports compilation streams. Submit yours to instantly append it on the live ticker panel.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase mb-1">Your Name</label>
                <input 
                  type="text" 
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  required 
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#111113] border border-neutral-900 focus:border-rose-500 rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase mb-1">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button 
                      key={starValue}
                      type="button"
                      onClick={() => setNewReviewRating(starValue)}
                      className="text-neutral-600 hover:text-amber-500 focus:outline-none"
                    >
                      <Star 
                        size={18} 
                        className={starValue <= newReviewRating ? "text-amber-500 fill-amber-500" : "text-neutral-700"} 
                      />
                    </button>
                  ))}
                  <span className="text-xs text-neutral-400 font-mono font-bold ml-1">({newReviewRating} / 5)</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase mb-1">Review</label>
                <textarea 
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  required
                  placeholder="Write your experience using SPORTS BOX app features..."
                  rows={3}
                  className="w-full bg-[#111113] border border-neutral-900 focus:border-rose-500 rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-lg text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Publish Review</span>
                <ChevronRight size={12} />
              </button>
            </form>
          </div>

          {/* Right: List of community reviews */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="font-['Space_Grotesk'] text-xl font-bold text-white flex items-center gap-2">
              Verified Installation Testimonials
              <span className="text-[10px] bg-rose-600/10 text-rose-500 border border-rose-500/30 px-2 py-0.5 rounded font-mono font-bold">
                Live
              </span>
            </h4>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
              {userReviews.map((review, idx) => (
                <div key={idx} className="bg-[#0f0f11] border border-neutral-900 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-rose-600/20 text-rose-500 flex items-center justify-center font-bold text-[10px] font-mono">
                        {review.name[0]}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white">{review.name}</span>
                        <span className="text-[9px] text-neutral-500 block">{review.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <div className="flex text-amber-500">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={10} className="fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-[9px] bg-neutral-950 text-neutral-400 border border-neutral-900 px-1.5 py-0.2 rounded font-mono">{review.appVer}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* --- FAQ COLLAPSIBLE DIAGRAMS --- */}
      <section className="py-12 bg-neutral-950 border-t border-neutral-900/80 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-['Space_Grotesk'] text-2xl font-extrabold text-white">
              Installation & Sideload FAQ
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              Clear technical answers regarding stream links, compatibility, and safety features.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Why isn't SPORTS BOX on the Google Play Store?",
                a: "Independent sports stream clients are distributed directly via APK side-loads to bypass streaming content limitations and play raw HLS link payloads from open CDNs directly."
              },
              {
                q: "Is installing from 'Unknown Sources' safe?",
                a: "Absolutely. Sideload files compiled with verified ARM signatures do not contain active monitoring or telemetric malware trackers. You can verify our package's SHA hash fingerprint instantly before hitting execute."
              },
              {
                q: "Does this support smart TV casting?",
                a: "Yes! The native underlying Media3 ExoPlayer package has physical Google Cast/Chromecast protocol extensions pre-compiled into its architecture. Cast 1080p stream frames easily."
              },
              {
                q: "What should I do if a live stream buffers or fails?",
                a: "SPORTS BOX features a durable local database schema fallback in Room. Wait for the administrative operator to update streaming endpoints inside Supabase, or switch to backup broadcast tracks as cached automatically."
              }
            ].map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="bg-[#0b0b0c] border border-neutral-900 rounded-xl overflow-hidden transition-all"
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left p-4 flex justify-between items-center hover:bg-neutral-900/40 text-xs sm:text-sm font-semibold text-white focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="text-rose-500 font-bold font-mono text-lg">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-neutral-900/50 pt-2.5 bg-neutral-950/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FOOTER CARD --- */}
      <footer className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-900/80 pt-10 text-center space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-9 h-9 rounded bg-[#101011] border border-neutral-800 flex items-center justify-center font-bold font-['Space_Grotesk'] text-sm">
              S<span className="text-rose-500">B</span>
            </div>
            <div>
              <div className="font-['Space_Grotesk'] font-bold text-white text-sm">SPORTS BOX</div>
              <div className="text-[10px] text-neutral-500">Athletic sports stream integration node.</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-neutral-500">
            <a href="#sports-coverage" className="hover:text-white">Sports Included</a>
            <span className="hidden sm:inline">•</span>
            <a href="#demo" className="hover:text-white">Active Demo</a>
            <span className="hidden sm:inline">•</span>
            <a href="#installation" className="hover:text-white">Installation Guide</a>
            <span className="hidden sm:inline">•</span>
            <a href="#specifications" className="hover:text-white">Technical Specs</a>
          </div>
        </div>

        <div className="text-[10px] text-neutral-600 font-mono space-y-2">
          <div>
            Built with modern React, Tailwind 4, and Lucide Vectors for optimal responsive presentation. All APK package installations are subject to local Android permission agreements.
          </div>
          <div>
            © 2026 SPORTS BOX Software Alliance. Not affiliated with Google LLC. All Rights Reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}

// Special custom icons to support clean SVG layouts
function CloudSyncIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-[22px] h-[22px] text-amber-500 shrink-0"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}
