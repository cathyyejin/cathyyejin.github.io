# Background Music Setup

## How to Add Background Music

1. **Prepare your music file**
   - Format: MP3 (recommended for best browser compatibility)
   - File size: Keep it reasonable (under 5MB if possible)
   - Location: Place it in the `public/music/` folder

2. **Create the music folder** (if it doesn't exist):
   ```bash
   mkdir -p public/music
   ```

3. **Add your music file**:
   - Name it `background.mp3`
   - Place it at: `public/music/background.mp3`

4. **Alternative file name/location**:
   If you want to use a different file name or location, update the path in `src/App.jsx`:
   ```jsx
   <audio
     ref={audioRef}
     src="/music/your-filename.mp3"  // Change this
     loop
     preload="auto"
   />
   ```

## Features

- ✅ Floating music control button (bottom-right corner)
- ✅ Play/Pause toggle
- ✅ Auto-loop (music repeats automatically)
- ✅ Remembers user preference (saves to localStorage)
- ✅ Visual indicator when music is playing (sound waves animation)
- ✅ Works on mobile and desktop

## Browser Compatibility

- Most modern browsers support MP3
- Some browsers may require user interaction before playing (autoplay restrictions)
- The button will handle this automatically

## Tips

- Use royalty-free music or music you have rights to use
- Consider file size for mobile users
- Test on different devices to ensure good experience
