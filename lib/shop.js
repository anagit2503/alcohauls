// The shop's real-world details, used in the footer and page metadata.
export const SHOP = {
  name: 'Noma Wine & Liquor',
  shortName: 'Noma',
  tagline: 'Wine & Liquor',
  street: '40 Patterson St NE',
  city: 'Washington, DC 20002',
  phone: '+1 202-741-0220',
  phoneHref: 'tel:+12027410220',
  instagram: 'https://www.instagram.com/explore/locations/106566238924037/noma-wine-and-liquor/?hl=en',
  lat: 38.90633669070466,
  lng: -77.00774948385873,
  timeZone: 'America/New_York',
  // 0 = Sunday. open/close are 24-hour times.
  hours: [
    { day: 'Sunday', open: '12:00', close: '22:00' },
    { day: 'Monday', open: '12:00', close: '22:00' },
    { day: 'Tuesday', open: '12:00', close: '22:00' },
    { day: 'Wednesday', open: '12:00', close: '22:00' },
    { day: 'Thursday', open: '11:00', close: '22:00' },
    { day: 'Friday', open: '11:00', close: '23:00' },
    { day: 'Saturday', open: '11:00', close: '23:00' },
  ],
}

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${SHOP.lat},${SHOP.lng}`

// OpenStreetMap needs no API key and no cookie banner.
export const mapEmbed = (() => {
  const d = 0.004
  const bbox = [SHOP.lng - d, SHOP.lat - d / 2, SHOP.lng + d, SHOP.lat + d / 2].join(',')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${SHOP.lat},${SHOP.lng}`
})()

// "12:00" -> "12pm", "23:00" -> "11pm"
export function clock(time) {
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 === 0 ? 12 : h % 12
  return m ? `${hour}.${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`
}

// Today's index and whether the shop is open, in the shop's own time zone.
export function openState(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SHOP.timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(now)
  const get = (type) => parts.find((p) => p.type === type)?.value
  const index = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  const minutes = Number(get('hour')) % 24 * 60 + Number(get('minute'))
  const today = SHOP.hours[index]
  const toMinutes = (t) => Number(t.split(':')[0]) * 60 + Number(t.split(':')[1])
  return { index, isOpen: Boolean(today) && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close), today }
}
