# Wedding Invitation (frontend only, React + Vite)
No backend, database, auth or server APIs.
```
npm install
npm run dev
npm run build
```
## Personalize
Edit **src/data/weddingDetails.js**: every PLACEHOLDER (names, hashtag, date, events, venue, photos, music/video paths, `inviteBaseUrl`).
Put media in `public/` and reference as `/file.mp3` or `file.mp3` (both resolve correctly on GitHub Pages sub-paths). The music button stays hidden until `music` is set.
## Personalised links
- **Normal visit** (`https://your-site/`): the full **Share the Invitation** section is shown (recipient, family, optional greeting, preview, WhatsApp, Copy Link, Copy Message).
- **Personalised visit** (`https://your-site/?guest=Rahul%20Ji&family=Family`): the greeting becomes "Dear Rahul Ji & Family," and the **entire Share section is not rendered**.
- Parameters: `guest`, `family` (the old `to`, `fam`, and `g` custom-greeting params are still read, so links already sent keep working). Values are trimmed, stripped of control characters and `<>`, limited to 60 characters, and ignored if empty or badly encoded. They are only ever rendered as text.
- No name = generic greeting + sharing section. Never put phone numbers in links. Works on any static host because it only reads `window.location.search`.
- WhatsApp opens `wa.me` with the message pre-filled; the sender still presses send.

## Wedding video
1. Put the file in `public/` (e.g. `public/wedding-film.mp4`, H.264/AAC, ideally under ~30 MB) and optionally a poster (`public/wedding-film-poster.jpg`).
2. In `src/data/weddingDetails.js` set `video: 'wedding-film.mp4'` and `videoPoster: 'wedding-film-poster.jpg'` (a full https URL to a direct .mp4/.webm also works). Paths respect Vite's `base`, so GitHub Pages and Vercel both work.
3. Empty `video` shows a clearly marked placeholder (no fake player). The video file is not requested until a guest presses play, and it never autoplays.

## Wedding music
1. Put your own **licensed** song in `public/` (e.g. `public/wedding-song.mp3`). No commercial track is bundled — use music you have permission to use.
2. In `src/data/weddingDetails.js` set `music: 'wedding-song.mp3'` (paths respect Vite's `base`, so GitHub Pages and Vercel both work).
3. With `music` empty the floating player still shows, labelled "Song not added", and tapping it explains how to add one. No audio is created.

Behaviour: nothing plays on page load. Tapping the envelope (or **Open Invitation**) requests the song inside that same tap, so browsers allow it; if a browser blocks it anyway, the invitation still opens and the guest starts the song with the circular music icon (no popup). There is exactly one audio element for the whole site (`src/music.jsx`), so repeat taps never start a second copy or restart it, and it keeps playing while scrolling. If the guest pauses it, nothing restarts it. The icon reflects the audio's real state (ring + glow while playing) and has no text label. While the wedding video plays the song is held and restored when the video pauses or ends. The song is not downloaded until the first play request.

## Limits
Real RSVP collection, private guest lists and reliable open-tracking need a backend or external service (e.g. a form tool); they are intentionally not faked here.

## Deploy (GitHub Pages via Actions)
1. Create an empty GitHub repo, then: `git init && git add . && git commit -m "Wedding invite" && git branch -M main && git remote add origin <repo-url> && git push -u origin main`
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. Push to `main` runs `.github/workflows/deploy.yml`; the site URL is `https://<user>.github.io/<repo>/`.
4. Put that URL in `inviteBaseUrl` in `src/data/weddingDetails.js` so shared links use it.

## Structure (royal redesign)
- `src/styles/` – `tokens.css` (palette, fonts, textures), `buttons.css` (primary / ghost / icon system), `ornaments.css`, `envelope.css`, `doors.css`, `sections.css`, `venue.css`, `share.css`, `motion.css` (reduced-motion, loaded last).
- `src/components/` – `Envelope` (welcome overlay), `Doors` (royal doors, scroll-triggered), `sections/*` (Hero, Couple, DateReveal, Events, Venue, Film, Closing), `Share`, `Music`, plus `Ornaments`, `Reveal`, `SectionHeading`, `Photo`, `Particles`.
- Flow: the envelope overlay opens with one tap, then dissolves into the invitation. The doors live further down the page and animate only when scrolled into view; they open only on tap.
- Optional venue photo: set `venue.photo` in `weddingDetails.js` (empty = no photo block).
- Event `time` is written as `'Date · Time'`; the part before the dot is shown as the date, after it as the time.
