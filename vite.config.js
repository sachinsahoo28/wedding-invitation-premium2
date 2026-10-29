import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

/*
 * Guard for the wedding song: warns when an MP3 in public/ starts with a large ID3 tag (almost always embedded cover
 * art). Browsers must download the whole tag before the first note, so a 1–2 MB picture turns "tap → music" into a
 * 10–40 s wait on mobile data, which looks like the music "sometimes doesn't play".
 */
function lightweightAudio(limitKB = 64) {
  let publicDir = '', logger = console
  return {
    name: 'lightweight-audio',
    configResolved(c) { publicDir = c.publicDir; logger = c.logger },
    buildStart() {
      if (!publicDir || !fs.existsSync(publicDir)) return
      for (const f of fs.readdirSync(publicDir).filter((n) => /\.mp3$/i.test(n))) {
        const fd = fs.openSync(path.join(publicDir, f), 'r'), h = Buffer.alloc(10)
        fs.readSync(fd, h, 0, 10, 0); fs.closeSync(fd)
        if (h.toString('latin1', 0, 3) !== 'ID3') continue
        const kb = Math.round((((h[6] & 127) << 21) | ((h[7] & 127) << 14) | ((h[8] & 127) << 7) | (h[9] & 127)) / 1024)
        if (kb > limitKB) logger.warn(`\n[lightweight-audio] public/${f}: ${kb} KB of tag data (usually cover art) sits before the first audio frame; `
          + `guests must download it before the song can start. Strip it losslessly:\n  ffmpeg -i ${f} -map 0:a -c:a copy -map_metadata -1 clean.mp3\n`)
      }
    },
  }
}

// base './' lets the build work on GitHub Pages under any repo name
export default defineConfig({ base: './', plugins: [react(), lightweightAudio()] })
