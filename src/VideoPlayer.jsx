import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2, Volume2, VolumeX } from "lucide-react";

const VideoPlayer = () => {
  const videoId = useParams().videoId;
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const playerRef = useRef(null);
  const playerOverlayRef = useRef(null);
  const playButtonRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressRef = useRef(null);
  const playPauseButtonRef = useRef(null);
  const timeDisplayRef = useRef(null);
  const thumbnailPlaceHolder = useRef(null);
  const controlBarRef = useRef(null);
  const containerRef = useRef(null);
  const topBarRef = useRef(null);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player("player", {
        height: "100%",
        width: "100%",
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          showinfo: 0,
          fs: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
      setPlayer(newPlayer);
    };

    return () => {
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (player !== null) {
      updateProgressBar();
    }
  }, [player]);

  const onPlayerReady = (event) => {
    setIsLoading(false);
    event.target.setVolume(100);
    thumbnailPlaceHolder.current.addEventListener("click", () => {
      player.playVideo();
      thumbnailPlaceHolder.current.style.display = "none";
    });
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      setIsBuffering(false);
      thumbnailPlaceHolder.current.style.display = "none";
      updateProgressBar();
    } else if (event.data === window.YT.PlayerState.BUFFERING) {
      setIsBuffering(true);
    } else {
      setIsPlaying(false);
      setIsBuffering(false);
    }
  };

  const togglePlayPause = () => {
    isPlaying ? player.pauseVideo() : player.playVideo();
  };

  const toggleMute = () => {
    isMuted ? player.unMute() : player.mute();
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (
      player &&
      player.getVideoLoadedFraction &&
      player.getVideoLoadedFraction() > 0
    ) {
      playerOverlayRef.current.style.display = "none";
      controlBarRef.current.style.display = "flex";
    }
  }, [player]);

  const handleProgressBarClick = (e) => {
    const percent = e.nativeEvent.offsetX / progressBarRef.current.offsetWidth;
    player.seekTo(percent * player.getDuration());
  };

  const updateProgressBar = () => {
    if (player && player.getCurrentTime && player.getDuration) {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();
      const percentage = (currentTime / duration) * 100;
      setCurrentTime(currentTime);
      setDuration(duration);
      progressRef.current.style.width = `${percentage}%`;
    }
    requestAnimationFrame(updateProgressBar);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return hours > 0
      ? `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`
      : `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsHovering(false);
    }, 2500);
  };

  if (!videoId) {
    return <div>Invalid video ID</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-[95vw] h-[calc(95vw*9/16)] md:w-[85vw] md:h-[calc(85vw*9/16)] overflow-hidden rounded-md border shadow-xl"
      >
        <div
          id="player"
          ref={playerRef}
          className="absolute top-0 left-0 w-full h-full"
        ></div>
        {/* <div
          ref={thumbnailPlaceHolder}
          className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer bg-sky-200 transition-opacity duration-300"
          style={{ opacity: isPlaying ? 0 : 1 }}
        /> */}
        <div
          ref={topBarRef}
          className={`absolute top-0 left-0 right-0 bg-sky-500 p-3 md:p-4 flex justify-between items-center border-t transition-opacity shadow-3xl duration-100 ease-in z-50 ${
            isHovering || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-white max-md:text-sm font-semibold">
            YT Video Player
          </h2>
        </div>
        <div
          ref={playerOverlayRef}
          onClick={togglePlayPause}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 via-transparent to-black/10 flex justify-center items-center cursor-pointer"
        >
          {isLoading && (
            <div className="animate-spin">
              <Loader2 className="h-6 md:h-8 w-6 md:w-8 text-white" />
            </div>
          )}
          {!isPlaying && !isLoading && (
            <button
              ref={playButtonRef}
              className="border-none text-white text-xl cursor-pointer py-3 px-6 flex items-center bg-sky-500 rounded-md transition-transform duration-200 hover:scale-110"
            >
              <Play className="h-6 md:h-7 w-6 md:w-7" />
            </button>
          )}
        </div>
        <div
          ref={controlBarRef}
          className="absolute bottom-0 left-0 right-0 bg-zinc-800 p-2 md:p-3 flex items-center justify-center gap-x-2 md:gap-x-3 transition-opacity duration-300"
          style={{ opacity: isLoading ? 0 : 1 }}
        >
          <button
            ref={playPauseButtonRef}
            onClick={togglePlayPause}
            className="border-none text-white text-xl cursor-pointer py-[5px] px-[6.5px] flex items-center bg-sky-500 rounded-md transition-transform duration-200 hover:scale-110"
          >
            {isBuffering ? (
              <Loader2 className="h-3 md:h-4 w-3 md:w-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-3 md:h-4 w-3 md:w-4" />
            ) : (
              <Play className="h-3 md:h-4 w-3 md:w-4" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="border-none text-white text-xl cursor-pointer py-[5px] px-[6.5px] flex items-center bg-sky-500 rounded-md transition-transform duration-200 hover:scale-110"
          >
            {isMuted ? (
              <VolumeX className="h-3 md:h-4 w-3 md:w-4" />
            ) : (
              <Volume2 className="h-3 md:h-4 w-3 md:w-4" />
            )}
          </button>
          <div
            ref={progressBarRef}
            onClick={handleProgressBarClick}
            className="flex-grow group flex-1 h-1 md:h-1.5 bg-zinc-600 cursor-pointer rounded-full overflow-hidden"
          >
            <div
              ref={progressRef}
              className="h-full bg-white rounded-r-full group-hover:bg-sky-500 transition-all duration-300"
            ></div>
          </div>
          <span
            ref={timeDisplayRef}
            className="text-white text-xs md:text-sm"
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </main>
  );
};

export default VideoPlayer;
