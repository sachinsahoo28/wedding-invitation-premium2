// PLACEHOLDERS: replace every value below with real wedding details.
export const wedding = {
  bride: 'Bride Name', groom: 'Groom Name',
  hashtag: '#BrideWedsGroom',
  date: '2027-02-14T11:00:00+05:30', // PLACEHOLDER date
  story: 'PLACEHOLDER: Write your love story here in two or three heartfelt sentences.',
  // WEDDING SONG — put your own licensed MP3 in /public (e.g. public/wedding-song.mp3) and set music: 'wedding-song.mp3'.
  // No song is bundled (commercial tracks need the artist's/label's permission). Empty = the player shows a "Song not added" placeholder.
  music: 'wedding-song.mp3',
  // WEDDING VIDEO — put your real file in /public (e.g. public/wedding-film.mp4, ideally H.264/AAC .mp4 under ~30 MB)
  // and set video: 'wedding-film.mp4'. A full https:// URL to a direct .mp4/.webm file also works.
  // Leave empty and the section shows a clearly marked placeholder (no fake player).
  video: '',
  defaultGreeting: 'Dear Family & Friends',
  inviteBaseUrl: '', // PLACEHOLDER: your deployed URL, e.g. https://your-domain.com/ (blank = current page)
  closing: 'PLACEHOLDER: Your presence and blessings will make our day complete.',
  timeZone: 'Asia/Kolkata',
  // PLACEHOLDER photo paths (put files in /public, e.g. '/hero.jpg'). Empty = labelled placeholder.
  photos: { hero: '', bride: '', groom: '', reveal: '' },
  captions: { bride: 'PLACEHOLDER caption for the bride', groom: 'PLACEHOLDER caption for the groom' },
  videoPoster: '', // poster image shown before playback (e.g. 'wedding-film-poster.jpg' in /public). Empty = ornamental backdrop.
  videoTitle: 'Moments of Love', videoLead: 'A glimpse of our celebration', // section heading + short caption
  // Event `time` format: 'Date · Time' (the part before the dot is shown as the date, the part after as the time).
  events: [
    { name: 'Haldi', time: 'PLACEHOLDER date · time', place: 'PLACEHOLDER venue' },
    { name: 'Mehendi', time: 'PLACEHOLDER date · time', place: 'PLACEHOLDER venue' },
    { name: 'Sangeet', time: 'PLACEHOLDER date · time', place: 'PLACEHOLDER venue' },
    { name: 'Wedding Ceremony', time: 'PLACEHOLDER date · time', place: 'PLACEHOLDER venue' },
    { name: 'Reception', time: 'PLACEHOLDER date · time', place: 'PLACEHOLDER venue' },
  ],
  // Address lines are split on commas for the staggered reveal.
  // `photo` is optional: put a venue photograph in /public (e.g. 'venue.jpg'). Empty = no photo block is shown.
  venue: { name: 'PLACEHOLDER Venue Name', address: 'PLACEHOLDER address, City',
    photo: '', photoAlt: 'The wedding venue',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=PLACEHOLDER+venue' },
}
