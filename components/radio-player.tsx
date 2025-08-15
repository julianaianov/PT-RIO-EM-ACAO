"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Heart, Share2 } from "lucide-react"

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([70])
  const [isMuted, setIsMuted] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        // Mock radio stream URL - replace with actual stream
        audioRef.current.src = "https://example.com/radio-stream"
        audioRef.current.play().catch(console.error)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
    }
  }

  const shareRadio = () => {
    const text = "Ouça a Rádio PT RJ ao vivo! A voz da transformação social no Rio de Janeiro."
    const url = window.location.href

    if (navigator.share) {
      navigator.share({ title: "Rádio PT RJ", text, url })
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
      window.open(whatsappUrl, "_blank")
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = volume[0] / 100
    }
  }, [volume])

  return (
    <div className="space-y-6">
      <audio ref={audioRef} />

      {/* Now Playing */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Debate Político</h3>
        <p className="text-gray-600">com João Santos</p>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFavorite(!isFavorite)}
          className={isFavorite ? "text-red-500 border-red-500" : ""}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>

        <Button size="lg" onClick={togglePlay} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700">
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
        </Button>

        <Button variant="outline" size="icon" onClick={shareRadio}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleMute}>
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <Slider value={volume} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
        <span className="text-sm text-gray-600 w-8">{volume[0]}%</span>
      </div>

      {/* Status */}
      <div className="text-center text-sm text-gray-600">
        {isPlaying ? "Reproduzindo ao vivo" : "Clique para ouvir"}
      </div>
    </div>
  )
}
