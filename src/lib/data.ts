import grandAnseImg from "@/assets/img/grand-anse.jpg";
import waterfallImg from "@/assets/img/waterfall.jpg";
import stGeorgesImg from "@/assets/img/st-georges.jpg";
import grandEtangImg from "@/assets/img/grand-etang.jpg";
import spiceImg from "@/assets/img/spice.jpg";
import cruisePortImg from "@/assets/img/cruise-port.jpg";
import islandRoadImg from "@/assets/img/island-road.jpg";
import mtCarmelImg from "@/assets/img/mt-carmel.jpg";

export const IMG = {
  grandAnse: grandAnseImg,
  waterfall: waterfallImg,
  stGeorges: stGeorgesImg,
  grandEtang: grandEtangImg,
  spice: spiceImg,
  cruisePort: cruisePortImg,
  islandRoad: islandRoadImg,
  mtCarmel: mtCarmelImg,
};

/** Images published on the client's own website (used with automatic fallback to generated art). */
export const OFFICIAL = {
  home: "https://islandvacationgrenada.com/wp-content/uploads/2026/05/ivt-1.jpeg",
  grandAnse: "https://islandvacationgrenada.com/wp-content/uploads/2026/05/Grand-Anse.jpg",
  stGeorges: "https://islandvacationgrenada.com/wp-content/uploads/2026/05/island-vacation-2.jpg",
  mtCarmel: "https://islandvacationgrenada.com/wp-content/uploads/2026/05/ivt-11.jpeg",
  why: "https://islandvacationgrenada.com/wp-content/uploads/2026/06/island-vacation-473-37.jpeg",
};

export const BUSINESS = {
  name: "Island Vacation Taxi & Tours",
  shortName: "Island Vacation",
  owner: "Annie",
  destination: "Grenada, West Indies",
  phoneDisplay: "+1 473-537-7386",
  phoneRaw: "+14735377386",
  whatsapp: "14735377386",
  email: "Islandvaca473@gmail.com",
  site: "https://islandvacationgrenada.com/",
  tagline: "Your Island. Your Journey.",
};

export const waLink = (message: string) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;

/* ------------------------------------------------------------------ */
/* Locations                                                           */
/* ------------------------------------------------------------------ */

export type ZoneId = "airport" | "southwest" | "central" | "north";

export type Place = {
  id: string;
  name: string;
  zone: ZoneId;
  kind: "hub" | "beach" | "town" | "nature" | "landmark" | "hotel";
  note?: string;
};

export const PLACES: Place[] = [
  { id: "mbia", name: "Maurice Bishop International Airport", zone: "airport", kind: "hub", note: "Point Salines, St. David's" },
  { id: "cruise", name: "St. George's Cruise Terminal", zone: "southwest", kind: "hub", note: "Port of St. George's" },
  { id: "st-georges", name: "St. George's Town Centre", zone: "southwest", kind: "town", note: "The Carenage" },
  { id: "grand-anse", name: "Grand Anse Beach", zone: "southwest", kind: "beach" },
  { id: "grand-anse-hotels", name: "Grand Anse hotel strip", zone: "southwest", kind: "hotel", note: "Silversands, Spice Island, Mount Cinnamon" },
  { id: "lac-loc", name: "L'Acul de Sable / Sauteurs", zone: "north", kind: "town" },
  { id: "grand-etang", name: "Grand Etang Lake & Rainforest", zone: "central", kind: "nature" },
  { id: "belmont", name: "Belmont Estate", zone: "central", kind: "landmark", note: "Chocolate & spice estate, Sauteurs" },
  { id: "annandale", name: "Annandale Falls", zone: "central", kind: "nature" },
  { id: "mt-carmel", name: "Mt. Carmel Waterfall", zone: "central", kind: "nature" },
  { id: "concord", name: "Concord Falls", zone: "north", kind: "nature" },
  { id: "sculpture", name: "Underwater Sculpture Park", zone: "southwest", kind: "landmark", note: "Molinare Bay" },
  { id: "fort-george", name: "Fort George", zone: "southwest", kind: "landmark" },
  { id: "fort-frederick", name: "Fort Frederick", zone: "southwest", kind: "landmark" },
  { id: "radisson", name: "Radisson Grenada Resort", zone: "southwest", kind: "hotel" },
  { id: "royalton", name: "Royalton Grenada", zone: "southwest", kind: "hotel" },
  { id: "blue-horizons", name: "Blue Horizons Garden Resort", zone: "southwest", kind: "hotel" },
  { id: "kimpton", name: "Kimpton Kawana Bay", zone: "southwest", kind: "hotel" },
];

export const placeById = (id: string) => PLACES.find((p) => p.id === id);

export const PICKUP_OPTIONS = PLACES.filter((p) => p.kind === "hub" || p.kind === "hotel" || p.id === "st-georges" || p.id === "grand-anse");

/* ------------------------------------------------------------------ */
/* Illustrative fare bands (DEMO — no official prices exist)           */
/* ------------------------------------------------------------------ */

const ZONE_SPREAD: Record<ZoneId, Record<ZoneId, number>> = {
  airport: { airport: 1, southwest: 1, central: 2, north: 3 },
  southwest: { airport: 1, southwest: 1, central: 2, north: 3 },
  central: { airport: 2, southwest: 2, central: 1, north: 2 },
  north: { airport: 3, southwest: 3, central: 2, north: 1 },
};

/** Demo band mid-points in USD. Clearly labelled as illustrative everywhere it appears. */
const BAND_BASE: Record<number, number> = { 1: 25, 2: 42, 3: 65 };
const BAND_SPREAD = 0.3;

export type FareResult = {
  band: number;
  low: number;
  high: number;
  breakdown: { label: string; amount: number }[];
  roundTrip: boolean;
};

export function estimateFare(opts: {
  pickup: string;
  dropoff: string;
  passengers: number;
  luggage: number;
  roundTrip: boolean;
}): FareResult {
  const a = placeById(opts.pickup);
  const b = placeById(opts.dropoff);
  const band = a && b ? ZONE_SPREAD[a.zone][b.zone] : 2;
  const base = BAND_BASE[band];
  const breakdown: { label: string; amount: number }[] = [
    { label: `Demo zone band ${band} (${a?.name.split(" ")[0] ?? "—"} → ${b?.name.split(" ")[0] ?? "—"})`, amount: base },
  ];
  let total = base;
  if (opts.passengers > 4) {
    const extra = (opts.passengers - 4) * 5;
    breakdown.push({ label: `Demo additional-guest allowance × ${opts.passengers - 4}`, amount: extra });
    total += extra;
  }
  if (opts.luggage > 4) {
    const extra = (opts.luggage - 4) * 4;
    breakdown.push({ label: `Demo luggage allowance × ${opts.luggage - 4}`, amount: extra });
    total += extra;
  }
  if (opts.roundTrip) {
    const extra = Math.round(total * 0.85);
    breakdown.push({ label: "Demo round-trip return leg", amount: extra });
    total += extra;
  }
  const low = Math.round((total * (1 - BAND_SPREAD)) / 5) * 5;
  const high = Math.round((total * (1 + BAND_SPREAD)) / 5) * 5;
  return { band, low, high, breakdown, roundTrip: opts.roundTrip };
}

/** Demo vehicle categories — final vehicle confirmed by Annie. No real fleet data is claimed. */
export const VEHICLE_CLASSES = [
  { id: "sedan", label: "Comfort sedan", pax: 3, bags: 3, note: "Air-conditioned saloon car" },
  { id: "suv", label: "SUV / people carrier", pax: 6, bags: 6, note: "Air-conditioned, extra luggage room" },
  { id: "van", label: "Minibus", pax: 12, bags: 12, note: "For groups and cruise parties" },
];

/* ------------------------------------------------------------------ */
/* Named experiences (the three tours featured on the official site)   */
/* ------------------------------------------------------------------ */

export type ItineraryStop = { time: string; label: string; detail: string };

export type Tour = {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  official: boolean;
  image: string;
  fallback: string;
  alt: string;
  accent: "terracotta" | "sea" | "sage";
  summary: string;
  description: string[];
  highlights: string[];
  itinerary: ItineraryStop[];
  pickups: string[];
  related: string[];
  keywords: string;
};

export const TOURS: Tour[] = [
  {
    slug: "grand-anse-beach-tour",
    name: "Grand Anse Beach Tour",
    eyebrow: "Featured tour · Beach",
    tagline: "Two miles of white sand, and nowhere else you need to be.",
    official: true,
    image: OFFICIAL.grandAnse,
    fallback: IMG.grandAnse,
    alt: "Grand Anse Beach in Grenada, a white sand crescent curving around a turquoise bay",
    accent: "sea",
    summary:
      "Relax on the white sandy shores of Grand Anse Beach with Island Vacation Grenada — private transport there and back, with as much beach time as you want.",
    description: [
      "Grand Anse is the beach people picture when they picture Grenada: a long, gentle crescent of white sand sheltered from the Atlantic swell, with calm clear water that stays shallow a long way out.",
      "Your day is built around doing very little, comfortably. Annie arranges private, air-conditioned transport from your hotel, villa, the airport or the cruise terminal, waits while you swim and relax, then brings you back when you are ready.",
      "There is no group schedule to keep and no fixed clock — tell us how long you would like to stay and we will plan the pickups around it.",
    ],
    highlights: [
      "Famous white-sand beach with calm, sheltered water",
      "Private air-conditioned transport both ways",
      "Relaxing beach time at your own pace",
      "Scenic coastal drive along Grenada's south-west shore",
      "Flexible pickup from hotel, airport or cruise terminal",
    ],
    itinerary: [
      { time: "09:00", label: "Pickup", detail: "Meet your driver at your hotel, villa or the cruise terminal." },
      { time: "09:25", label: "Coastal drive", detail: "Scenic run down towards the south-west coast." },
      { time: "09:45", label: "Grand Anse Beach", detail: "Swim, stroll, or simply settle under the palms." },
      { time: "13:00", label: "Optional lunch stop", detail: "Beachfront restaurants and local spots along the bay." },
      { time: "14:30", label: "Return transfer", detail: "Back to your accommodation, rested and on time." },
    ],
    pickups: ["Maurice Bishop International Airport", "St. George's Cruise Terminal", "Grand Anse hotel strip", "St. George's Town Centre"],
    related: ["st-georges-city-tour", "mt-carmel-waterfall-tour"],
    keywords: "Grand Anse beach tours Grenada, private beach transfer Grenada",
  },
  {
    slug: "st-georges-city-tour",
    name: "St. George's City Tour",
    eyebrow: "Featured tour · Culture",
    tagline: "The colourful capital, read at walking pace.",
    official: true,
    image: OFFICIAL.stGeorges,
    fallback: IMG.stGeorges,
    alt: "The Carenage waterfront in St. George's, Grenada, with colourful colonial buildings around the harbour",
    accent: "terracotta",
    summary:
      "Explore the colourful capital city with the St. George's City Tour from Island Vacation Grenada — harbour, forts, markets and hillside streets.",
    description: [
      "St. George's is one of the most photographed harbours in the Caribbean: a horseshoe bay ringed with ochre, coral and cream buildings, red-tiled roofs stacked up the hillside, and the stone ramparts of Fort George looking down over it all.",
      "Your driver-guide sets the pace. Stop at the Carenage waterfront, look over the forts, wander the market streets for nutmeg, cocoa and locally made craft, and take in the views from the hills above town.",
      "Everything is private to your party, so the conversation, the stops and the timing are all yours.",
    ],
    highlights: [
      "Historic waterfront and the Carenage",
      "Fort George and the hillside viewpoints",
      "Colourful colonial architecture and local culture",
      "Market stops for nutmeg, cocoa and craft",
      "Private sightseeing at your own pace",
    ],
    itinerary: [
      { time: "09:30", label: "Pickup", detail: "Collection from your accommodation or the cruise terminal." },
      { time: "09:50", label: "The Carenage", detail: "Waterfront stroll and harbour views." },
      { time: "10:30", label: "Fort George", detail: "Ramparts and outlook over town and bay." },
      { time: "11:15", label: "Market & streets", detail: "Spice stalls, craft and everyday Grenadian life." },
      { time: "12:30", label: "Hillside views", detail: "Panoramas over the capital before your return." },
    ],
    pickups: ["Maurice Bishop International Airport", "St. George's Cruise Terminal", "Grand Anse hotel strip", "St. George's Town Centre"],
    related: ["grand-anse-beach-tour", "mt-carmel-waterfall-tour"],
    keywords: "St. George's cruise excursions, Grenada city sightseeing tour",
  },
  {
    slug: "mt-carmel-waterfall-tour",
    name: "Mt. Carmel Waterfall Tour",
    eyebrow: "Featured tour · Nature",
    tagline: "Into the green interior, where the island keeps its water.",
    official: true,
    image: OFFICIAL.mtCarmel,
    fallback: IMG.mtCarmel,
    alt: "A tropical waterfall in Grenada's rainforest interior falling into a green pool",
    accent: "sage",
    summary:
      "Visit one of Grenada's most popular attractions with the Mt. Carmel Waterfall Tour by Island Vacation Grenada — tropical scenery, nature photography and guided island transport.",
    description: [
      "The drive inland from the coast is half the pleasure: the road climbs through banana grounds and dense rainforest before the trees open up and the falls appear.",
      "Mt. Carmel is a favourite for good reason — a tall, clean drop into a green pool, framed by ferns and bamboo, and quiet enough to hear the water before you see it.",
      "Bring a swimsuit if you want to cool off, and a camera: the light through the canopy changes all day. Your driver waits at the trailhead and returns you to your accommodation afterwards.",
    ],
    highlights: [
      "Tropical rainforest scenery on the island's interior roads",
      "Waterfall experience with time to swim or photograph",
      "Nature photography in changing canopy light",
      "Guided island transportation both ways",
      "Private group — no strangers on the itinerary",
    ],
    itinerary: [
      { time: "08:30", label: "Pickup", detail: "Air-conditioned collection from your accommodation." },
      { time: "09:15", label: "Interior drive", detail: "Rainforest roads and spice-grove scenery." },
      { time: "09:45", label: "Trailhead", detail: "Short walk in with your driver-guide." },
      { time: "10:15", label: "Mt. Carmel Waterfall", detail: "Swim, explore and photograph the falls." },
      { time: "12:30", label: "Return transfer", detail: "Back downhill and home to your stay." },
    ],
    pickups: ["Maurice Bishop International Airport", "St. George's Cruise Terminal", "Grand Anse hotel strip", "St. George's Town Centre"],
    related: ["grand-anse-beach-tour", "st-georges-city-tour"],
    keywords: "Mt. Carmel waterfall tour Grenada, Grenada nature excursions",
  },
];

export const tourBySlug = (slug: string) => TOURS.find((t) => t.slug === slug);

/* ------------------------------------------------------------------ */
/* Destinations for the itinerary builder                              */
/* ------------------------------------------------------------------ */

export type Destination = {
  id: string;
  name: string;
  area: string;
  /** Illustrative dwell time in minutes — configurable demo value, not a measured visit length. */
  minutes: number;
  kind: "beach" | "falls" | "town" | "fort" | "forest" | "estate" | "sea";
  /** Named on the official site as part of a featured tour. */
  featuredTour?: string;
  note: string;
  /** Position on the illustrative island map (viewBox 0 0 400 580). */
  x: number;
  y: number;
};

export const DESTINATIONS: Destination[] = [
  { id: "grand-anse", name: "Grand Anse Beach", area: "South-west coast", minutes: 90, kind: "beach", featuredTour: "grand-anse-beach-tour", note: "White-sand bay, calm water, beachfront lunch.", x: 150, y: 428 },
  { id: "st-georges", name: "St. George's", area: "Capital waterfront", minutes: 75, kind: "town", featuredTour: "st-georges-city-tour", note: "The Carenage, market streets and harbour views.", x: 126, y: 394 },
  { id: "mt-carmel", name: "Mt. Carmel Waterfall", area: "Interior, St. David", minutes: 90, kind: "falls", featuredTour: "mt-carmel-waterfall-tour", note: "Tall falls, forest trail, swimming pool.", x: 232, y: 372 },
  { id: "annandale", name: "Annandale Falls", area: "Central interior", minutes: 60, kind: "falls", note: "Easy-access waterfall in deep green woodland.", x: 176, y: 400 },
  { id: "grand-etang", name: "Grand Etang Lake", area: "Rainforest highlands", minutes: 75, kind: "forest", note: "Crater lake, mist and giant bamboo.", x: 214, y: 344 },
  { id: "fort-george", name: "Fort George", area: "St. George's hill", minutes: 45, kind: "fort", note: "18th-century ramparts over the harbour.", x: 142, y: 380 },
  { id: "fort-frederick", name: "Fort Frederick", area: "St. George's ridge", minutes: 45, kind: "fort", note: "Hilltop fort with wide island views.", x: 156, y: 366 },
  { id: "belmont", name: "Belmont Estate", area: "Northern parish", minutes: 90, kind: "estate", note: "Working spice and chocolate estate.", x: 234, y: 246 },
  { id: "concord", name: "Concord Falls", area: "North-west", minutes: 75, kind: "falls", note: "Three-tier falls reached by a forest path.", x: 138, y: 274 },
  { id: "sculpture", name: "Underwater Sculpture Park", area: "Molinare Bay", minutes: 60, kind: "sea", note: "Snorkel or glass-bottom views of the sculptures.", x: 132, y: 458 },
  { id: "spice-estate", name: "Spice Estate Walk", area: "Interior", minutes: 60, kind: "estate", note: "Nutmeg, mace, cocoa and cinnamon drying yards.", x: 196, y: 292 },
  { id: "airport-lookout", name: "South Scenic Lookout", area: "Point Salines", minutes: 30, kind: "town", note: "Open views down the south-west coast.", x: 176, y: 470 },
];

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export type ServiceKey = "airport-transfer" | "private-taxi" | "island-tour" | "cruise-excursion";

export const SERVICES: { key: ServiceKey; label: string; short: string; blurb: string; path: string }[] = [
  { key: "airport-transfer", label: "Airport Transfer", short: "Arrivals & departures", blurb: "Meet-and-greet pickup at Maurice Bishop International Airport, luggage handled, straight to your stay.", path: "/transfers" },
  { key: "private-taxi", label: "Private Taxi", short: "Anywhere on island", blurb: "Point-to-point private rides between hotels, beaches, towns and attractions — air-conditioned, on your schedule.", path: "/transfers" },
  { key: "island-tour", label: "Island Tour", short: "Sightseeing days", blurb: "Waterfalls, forts, spice estates and rainforest, planned around what your group actually wants to see.", path: "/build-your-tour" },
  { key: "cruise-excursion", label: "Cruise Excursion", short: "Back to the ship", blurb: "St. George's cruise port pickups and return-to-port excursions built around your ship's schedule.", path: "/cruise-excursions" },
];

/* ------------------------------------------------------------------ */
/* Deterministic mock availability (DEMO)                               */
/* ------------------------------------------------------------------ */

export type SlotStatus = "open" | "limited" | "full";

const hash = (str: string) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export const SLOT_TIMES = ["06:30", "08:00", "09:30", "11:00", "13:00", "14:30", "16:00", "17:30"];

export type DayAvailability = {
  dateKey: string;
  status: "past" | "available" | "limited" | "full";
  slots: { time: string; status: SlotStatus; seats: number }[];
};

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const dateKey = iso;

export function getAvailability(date: Date): DayAvailability {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const key = iso(date);
  if (date < today) return { dateKey: key, status: "past", slots: [] };

  const h = hash(key);
  let status: DayAvailability["status"] = "available";
  if (h % 13 === 0) status = "full";
  else if (h % 5 === 0) status = "limited";

  const slots: { time: string; status: SlotStatus; seats: number }[] = SLOT_TIMES.map((time, i) => {
    const sh = hash(key + time);
    if (status === "full") return { time, status: "full", seats: 0 };
    if (status === "limited") {
      const seats = sh % 3 === 0 ? 0 : 1 + (sh % 3);
      const s: SlotStatus = seats === 0 ? "full" : seats <= 2 ? "limited" : "open";
      return { time, status: s, seats };
    }
    const seats = 4 + (sh % 5);
    const s: SlotStatus = i === 7 && sh % 4 === 0 ? "limited" : "open";
    return { time, status: s, seats };
  });

  if (status === "available" && slots.every((s) => s.seats === 0)) status = "limited";
  return { dateKey: key, status, slots };
}

/* ------------------------------------------------------------------ */
/* WhatsApp message builders                                           */
/* ------------------------------------------------------------------ */

export const MSG = {
  transfer: (o: { date: string; time: string; pax: number; pickup: string; dropoff: string; flight?: string }) =>
    `Hello Annie! I'd like to request an airport transfer in Grenada on ${o.date} at ${o.time} for ${o.pax} passengers. Pickup: ${o.pickup}. Destination: ${o.dropoff}.${
      o.flight ? ` Flight: ${o.flight}.` : ""
    } Could you confirm availability and pricing?`,

  tour: (o: { date: string; guests: number; interests: string[]; pickup: string }) =>
    `Hello Annie! I'm interested in a private Grenada island tour on ${o.date} for ${o.guests} guests. I'd love to visit ${
      o.interests.length ? o.interests.join(", ") : "the best of Grenada"
    }. Pickup: ${o.pickup}. Could you please share availability and a quote?`,

  cruise: (o: { ship: string; date: string; arrive: string; depart: string; pax: number; interest: string }) =>
    `Hello Annie! We arrive in St. George's aboard ${o.ship} on ${o.date} (in ${o.arrive}, all aboard ${o.depart}) with ${o.pax} passengers. We'd like: ${o.interest}. Could you confirm a return-to-port plan and a quote?`,

  itinerary: (o: { date: string; length: string; stops: string[]; pax: number; pickup: string }) =>
    `Hello Annie! I'm planning a private Grenada experience on ${o.date} (${o.length}) for ${o.pax} guests. My chosen stops: ${o.stops.join(" → ")}. Pickup: ${o.pickup}. Could you please share availability and a quote?`,

  booking: (ref: string) =>
    `Hello Annie! I've just submitted a demo booking request (reference ${ref}) through the website for Island Vacation Taxi & Tours. Could you confirm the details?`,

  general: (subject: string) => `Hello Annie! I have a question about ${subject} in Grenada.`,
};

/* ------------------------------------------------------------------ */
/* Itinerary time budgets (configurable, illustrative)                  */
/* ------------------------------------------------------------------ */

export const BUDGETS = {
  half: { id: "half", label: "Half day", hours: 4.5, caption: "≈ 4½ hours door to door" },
  full: { id: "full", label: "Full day", hours: 8, caption: "≈ 8 hours door to door" },
} as const;

export type BudgetId = keyof typeof BUDGETS;

export const STOP_BASE_MINUTES = 40; // illustrative pickup + travel buffer before the first stop
export const TRANSFER_MINUTES = 30; // illustrative buffer between stops

export function itineraryMinutes(stops: Destination[]) {
  if (!stops.length) return STOP_BASE_MINUTES;
  return STOP_BASE_MINUTES + stops.reduce((sum, s) => sum + s.minutes, 0) + (stops.length - 1) * TRANSFER_MINUTES;
}
