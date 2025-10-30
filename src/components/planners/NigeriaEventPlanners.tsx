import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import FallbackImage from "@/components/ui/fallback-image";
import { usePlannerImages } from "@/hooks/usePlannerImages";

export type Planner = {
  name: string;
  city: string;
  state: string;
  phones: string[];
  email?: string;
  website?: string;
  address?: string;
  sources?: string[];
  imageUrl?: string;
};

const planners: Planner[] = [
  // ——— LAGOS ———
  {
    name: "Zapphaire Events",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2348052199654", "+2348062621570"],
    email: "info@zapphaireevents.com",
    website: "https://zapphaireevents.com/",
    address: "371 Borno Way, Alagomeji-Yaba, Lagos",
    sources: [
      "https://zapphaireevents.com/contact/",
      "https://zapphaireevents.com/join-the-team/"
    ],
  },
  {
    name: "Eventful Nigeria (Eventful Limited)",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2348107511512"],
    email: "info@eventfulnigeria.com",
    website: "https://www.eventfulnigeria.com/",
    address: "1 Obokun Street, Off Coker Rd, Ilupeju, Lagos",
    sources: [
      "https://www.eventfulnigeria.com/contact-us/"
    ],
  },
  {
    name: "June5ive Events",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2347033241493", "+2348096441482"],
    email: "june5iveevents@gmail.com",
    website: "https://www.instagram.com/june5iveevents/",
    address: "Lagos, Nigeria",
    sources: [
      "https://www.scribd.com/document/788832097/Event-Planners-in-Nigeria"
    ],
  },
  {
    name: "The Cruise Events",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2347036539834"],
    email: "info@thecruiseevents.com",
    website: "https://thecruiseevents.com/",
    address: "Lagos, Nigeria",
    sources: [
      "https://www.scribd.com/document/788832097/Event-Planners-in-Nigeria"
    ],
  },
  {
    name: "Omu Obilor Luxury Event Planner",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2348022233135", "+2348059044387"],
    website: "https://www.ngex.com/bd/c/Weddings/Wedding%20Planners%20%26%20Coordinators/",
    address: "10 Moleye St, Yaba, Lagos",
    sources: [
      "https://www.ngex.com/bd/c/Weddings/Wedding%20Planners%20%26%20Coordinators/"
    ],
  },
  {
    name: "Indigo Crystal Concept",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2347060590242", "+2348025947118"],
    email: "inquiry@indigocrystal.com.ng",
    website: "https://indigocrystal.com.ng/",
    address: "34/36 Ikorodu Road, Fadeyi, Yaba, Lagos",
    sources: ["https://indigocrystal.com.ng/contact-indigocrystal/"]
  },
  {
    name: "Live Event Solutions",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2348101388999", "+2349060008150"],
    email: "support@liveeventsolutions.com.ng",
    website: "https://liveeventsolutions.com.ng/",
    address: "14b Olatunji Close, Off TVC Continental Way, Ikosi, Ketu, Lagos",
    sources: ["https://liveeventsolutions.com.ng/contact-us/"]
  },
  {
    name: "Epicentre Global Events",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2348034727637", "+2348091518185"],
    email: "epicentreevents@gmail.com",
    website: "https://epicentreglobalevents.com/",
    address: "42 Olorunlogbon Street, Anthony Village, Lagos",
    sources: ["https://epicentreglobalevents.com/contact/"]
  },
  {
    name: "Gadiel Event Planners",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2348034352800"],
    email: "gadielluxury@gmail.com",
    website: "https://gadieleventplanners.com.ng/",
    address: "Lekki, Lagos, Nigeria",
    sources: ["https://gadieleventplanners.com.ng/contact-us/"]
  },
  {
    name: "Elizabeth R Events",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2348058730526"],
    email: "lawal@elizabethrevents.com.ng",
    website: "https://elizabethrevents.com.ng/",
    address: "114 Awolowo Road, South West Ikoyi, Lagos",
    sources: ["https://elizabethrevents.com.ng/"]
  },
  {
    name: "Storypage Events",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2347037181861"],
    email: "storypageevents@gmail.com",
    address: "Garnet Building, 2nd Floor, Lekki-Epe Expressway, Lagos",
    sources: ["https://www.nigeriaeventspeople.com/event-companies/event-plannerwedding-planner-and-decorator-lagos-nigeria"]
  },
  {
    name: "Qmara Vie Planners",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2348032911665"],
    website: "https://qmaravieplanners.ng/",
    address: "Lagos, Nigeria",
    sources: ["https://qmaravieplanners.ng/"]
  },
  {
    name: "Zina Events",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2349050097698"],
    email: "zinaeventsng@gmail.com",
    website: "https://www.nigeriaeventspeople.com/companies/event-planners-and-managers",
    address: "Lagos, Nigeria",
    sources: ["https://www.nigeriaeventspeople.com/companies/event-planners-and-managers"]
  },
  {
    name: "Calee's Events Planning & Management",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2348068185061", "+2348156568989"],
    email: "caleeeventsplanner@gmail.com",
    website: "https://www.nigeriaeventspeople.com/companies/event-planners-and-managers",
    address: "Lagos, Nigeria",
    sources: ["https://www.nigeriaeventspeople.com/companies/event-planners-and-managers"]
  },
  {
    name: "VinceConcept / VinceConcept Event",
    city: "Lagos",
    state: "Lagos",
    phones: ["+2348063703759"],
    email: "vinceconcept11@gmail.com",
    website: "https://www.nigeriaeventspeople.com/companies/event-planners-and-managers",
    address: "Lagos, Nigeria",
    sources: ["https://www.nigeriaeventspeople.com/companies/event-planners-and-managers"]
  },
  {
    name: "Magna Events Ltd",
    city: "Lagos",
    state: "Lagos",
    phones: [],
    email: "info@magnaeventsltd.com",
    website: "https://magnaeventsltd.com/",
    address: "Nigeria",
    sources: [
      "https://www.scribd.com/document/788832097/Event-Planners-in-Nigeria"
    ],
  },
  // ——— ABUJA ———
  {
    name: "PK Events Nigeria",
    city: "Abuja",
    state: "FCT",
    phones: ["+2348066500787"],
    website: "https://www.instagram.com/pkevents_/",
    address: "Abuja, Nigeria",
    sources: ["https://www.instagram.com/pkevents_/"]
  },
  {
    name: "Sparkling Event Planners Ltd",
    city: "Abuja",
    state: "FCT",
    phones: ["+2348134084085", "+2348078079886"],
    website: "https://www.facebook.com/sparklingeventplanners.ng/",
    address: "Abuja, Nigeria",
    sources: ["https://www.facebook.com/sparklingeventplanners.ng/"]
  },
  {
    name: "Posh & Pristine Events",
    city: "Abuja",
    state: "FCT",
    phones: ["+2349097304788"],
    email: "info@poshnpristine.com",
    website: "https://poshnpristine.com/",
    address: "Suite 303, 2nd Floor, ParkHill Center, Living Word St, 5th Avenue, Gwarinpa, Abuja",
    sources: ["https://poshnpristine.com/"]
  },
  {
    name: "Events With Anthonia",
    city: "Abuja",
    state: "FCT",
    phones: ["+2347046995475"],
    email: "eventswithanthonia@gmail.com",
    website: "https://eventswithanthonia.com/",
    address: "Shop 2 Emerald Court, Apo Gudu, Abuja",
    sources: ["https://eventswithanthonia.com/"]
  },
  {
    name: "Edycraft Designs",
    city: "Abuja",
    state: "FCT",
    phones: ["+2348080244889", "+2348138285278"],
    website: "https://www.facebook.com/edycraftdesigns/",
    address: "Abuja, Nigeria",
    sources: ["https://www.facebook.com/edycraftdesigns/"]
  },
  {
    name: "Selcah Logistics / Selcah Events",
    city: "Abuja",
    state: "FCT",
    phones: ["+2348081369722", "+2348092656230"],
    email: "selcahlogistics@gmail.com",
    website: "http://www.selcah.com",
    address: "Abuja, Nigeria",
    sources: ["https://www.nigeriaeventspeople.com/companies/event-planners-and-managers"]
  },
  {
    name: "Innate Arts & Media (IAM)",
    city: "Abuja",
    state: "FCT",
    phones: ["+2348036788888"],
    email: "dada@iam.com.ng",
    website: "https://www.nigeriaeventspeople.com/companies/event-planners-and-managers",
    address: "Abuja, Nigeria",
    sources: ["https://www.nigeriaeventspeople.com/companies/event-planners-and-managers"]
  },
  {
    name: "Enchanted Events NG",
    city: "Abuja",
    state: "FCT",
    phones: ["+2348034508188", "+2348139905180"],
    email: "ugo@enchantedeventsng.com",
    address: "Abuja, Nigeria",
    sources: ["https://www.scribd.com/document/788832097/Event-Planners-in-Nigeria"]
  },
  // ——— IBADAN (OYO) ———
  {
    name: "Mr D Events Planner & Decor",
    city: "Ibadan",
    state: "Oyo",
    phones: ["+2347054136264"],
    website: "https://www.facebook.com/mrdeventplanner1/",
    address: "Ibadan, Oyo State",
    sources: ["https://www.facebook.com/mrdeventplanner1/"]
  },
  {
    name: "Soweto Events",
    city: "Ibadan",
    state: "Oyo",
    phones: ["+2348036049627"],
    website: "https://www.instagram.com/sowetoevents/",
    address: "Opp WAEC Office, Ijokodo, Ibadan, Oyo",
    sources: ["https://www.instagram.com/sowetoevents/"]
  },
  {
    name: "Hinny Event Services",
    city: "Ibadan",
    state: "Oyo",
    phones: ["+2349151406950"],
    website: "https://www.instagram.com/hinny_event_services/",
    address: "Ojurin Akobo, Ibadan, Oyo",
    sources: ["https://www.instagram.com/hinny_event_services/"]
  },
  // ——— PORT HARCOURT (RIVERS) ———
  {
    name: "Class Eventz",
    city: "Port Harcourt",
    state: "Rivers",
    phones: [],
    website: "https://eventplanner.ng/vendors/wedding-planner/rivers/port-harcourt/class-eventz/",
    address: "Port Harcourt, Rivers State",
    sources: [
      "https://eventplanner.ng/vendors/wedding-planner/rivers/port-harcourt/class-eventz/"
    ],
  },
  {
    name: "PH Professional Event Planner (VisCorner listing)",
    city: "Port Harcourt",
    state: "Rivers",
    phones: ["+2349133687246"],
    website: "https://viscorner.com/event-services/event-planning/port-harcourt",
    address: "No 35 Joe Street off Ada George, Port Harcourt",
    sources: ["https://viscorner.com/event-services/event-planning/port-harcourt"]
  },
  {
    name: "Briellez Events",
    city: "Port Harcourt",
    state: "Rivers",
    phones: [],
    website: "https://www.instagram.com/briellezevents/",
    address: "10 Oroazi Rd, King David Event Centre, off Rumuola Rd, Port Harcourt",
    sources: ["https://www.instagram.com/briellezevents/"]
  },
  // ——— BENIN CITY (EDO) ———
  {
    name: "Valron Events NG",
    city: "Benin City",
    state: "Edo",
    phones: ["+2348078703681"],
    website: "https://www.instagram.com/valroneventsng/",
    address: "Benin City, Edo State",
    sources: ["https://www.instagram.com/valroneventsng/"]
  },
  {
    name: "Katrick Events Ltd",
    city: "Benin City",
    state: "Edo",
    phones: [],
    website: "https://www.instagram.com/katrickevents/",
    address: "5 Idehen St, off Irhirhi, Airport Rd GRA, Benin City",
    sources: ["https://www.instagram.com/katrickevents/"]
  },
  // ——— KANO ———
  {
    name: "3D Eventz Guru (Kano Event Planner)",
    city: "Kano",
    state: "Kano",
    phones: ["+2348059500043"],
    website: "https://www.instagram.com/3deventz_guru/",
    address: "TS 26/27 Sabo Bakin Zuwo Rd, Tarauni, Kano",
    sources: ["https://www.instagram.com/3deventz_guru/"]
  },
  {
    name: "Tessciano Events & Rentals",
    city: "Kano",
    state: "Kano",
    phones: [],
    website: "https://www.instagram.com/tessciano_events_rentals/",
    address: "No. 103 Yoruba Rd by Bishop's Court, Sabon Gari, Kano",
    sources: ["https://www.instagram.com/tessciano_events_rentals/"]
  },
  // ——— KADUNA ———
  {
    name: "SYK-E Productions (Kaduna)",
    city: "Kaduna",
    state: "Kaduna",
    phones: ["+2348033282659", "+2348077657687"],
    website: "https://www.instagram.com/syk_e_productions/",
    address: "41 Balarabe Musa Rd, Narayi High Cost, Kaduna South",
    sources: ["https://www.instagram.com/syk_e_productions/"]
  },
  {
    name: "2SJ Events (Kaduna–Abuja)",
    city: "Kaduna",
    state: "Kaduna",
    phones: [],
    website: "https://www.instagram.com/_2sjevents/",
    address: "Kaduna & Abuja, Nigeria",
    sources: ["https://www.instagram.com/_2sjevents/"]
  },
  // ——— OGUN ———
  {
    name: "D'Best Events (Abeokuta)",
    city: "Abeokuta",
    state: "Ogun",
    phones: ["+2347069516998"],
    website: "https://www.instagram.com/dbest_event/",
    address: "59 Moshood Abiola Way (opp. IBD Int'l Hotel), Leme, Abeokuta",
    sources: ["https://www.instagram.com/dbest_event/"]
  },
  {
    name: "Grandeur Colourful Affairs",
    city: "Abeokuta",
    state: "Ogun",
    phones: ["+2347069774056"],
    website: "https://campidu.com/tags/event-planner/",
    address: "Abeokuta, Ogun State",
    sources: ["https://campidu.com/tags/event-planner/"]
  },
  {
    name: "Oyee Events n Interior",
    city: "Abeokuta",
    state: "Ogun",
    phones: ["+2348075431169", "+2348157991323"],
    website: "https://ngex.com/bd/areasearch/Nigeria/OGUN/Abeokuta/Mile%202/c/Events/Event%20Planners%20%26%20Managers/",
    address: "4 Aroo St, Abeokuta, Ogun",
    sources: [
      "https://ngex.com/bd/areasearch/Nigeria/OGUN/Abeokuta/Mile%202/c/Events/Event%20Planners%20%26%20Managers/"
    ]
  },
  // ——— DELTA (WARRI/ASABA) ———
  {
    name: "No Surprises Ltd (Delta coverage)",
    city: "Asaba",
    state: "Delta",
    phones: ["+2347038642886", "+234013427521"],
    website: "https://takooka.com/event-planners-in-kaduna-state.php",
    address: "Delta State & Nationwide",
    sources: ["https://takooka.com/event-planners-in-kaduna-state.php"]
  },
];

const cities = [
  "All",
  "Lagos",
  "Abuja",
  "Benin City",
  "Port Harcourt",
  "Ibadan",
  "Delta",
  "Ogun",
  "Kano",
  "Kaduna",
  "Abeokuta",
];

export default function NigeriaEventPlanners() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All");

  const filtered = useMemo(() => {
    return planners.filter((p) => {
      const matchesCity = city === "All" || p.city === city;
      const matchesQuery = !q || 
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.city.toLowerCase().includes(q.toLowerCase()) ||
        p.state.toLowerCase().includes(q.toLowerCase()) ||
        p.address?.toLowerCase().includes(q.toLowerCase()) ||
        p.email?.toLowerCase().includes(q.toLowerCase()) ||
        p.phones.some(phone => phone.includes(q));
      return matchesCity && matchesQuery;
    });
  }, [q, city]);

  const { getImage, isLoading, progress } = usePlannerImages(filtered);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Nigeria Event Planners — Master List</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Planners only • {planners.length} records • Filter by city and search by name, phone, email, or address.
      </p>
      {progress.loaded < progress.total && (
        <p className="text-sm text-muted-foreground mb-6">
          Loading images: {progress.loaded}/{progress.total}
        </p>
      )}

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Input
          className="w-full md:w-1/2"
          placeholder="Search (name, phone, email, address)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, idx) => {
          const imageUrl = getImage(p.name);
          const loading = isLoading(p.name);

          return (
            <article key={`${p.name}-${p.city}-${idx}`} className="rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              {/* Large Featured Image */}
              <div className="relative w-full h-[280px] bg-muted/30 overflow-hidden">
                {loading ? (
                  <Skeleton className="w-full h-full" />
                ) : imageUrl ? (
                  <FallbackImage
                    src={imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackClassName="w-full h-full"
                    showFallbackText={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <span className="text-6xl font-bold text-primary/40">{p.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Company Name */}
                <h2 className="font-semibold text-xl mb-3 line-clamp-2">{p.name}</h2>
                
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-muted text-sm rounded">
                    Event Planning
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <span>📍 {p.city}, {p.state}</span>
                </div>

                {/* Address */}
                {p.address && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {p.address}
                  </p>
                )}

                {/* Contact Information - Compact */}
                <div className="space-y-2 pt-4 border-t text-sm">
                  {p.phones.length > 0 && (
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {p.phones.slice(0, 2).map((phone, i) => (
                        <a key={i} href={`tel:${phone}`} className="text-primary hover:underline">
                          {phone}
                          {i < Math.min(p.phones.length, 2) - 1 ? ", " : ""}
                        </a>
                      ))}
                      {p.phones.length > 2 && (
                        <span className="text-muted-foreground"> +{p.phones.length - 2} more</span>
                      )}
                    </div>
                  )}

                  {p.email && (
                    <div className="truncate">
                      <span className="font-medium">Email:</span>{" "}
                      <a href={`mailto:${p.email}`} className="text-primary hover:underline">
                        {p.email}
                      </a>
                    </div>
                  )}

                  {p.website && (
                    <div>
                      <a
                        href={p.website}
                        className="text-primary hover:underline inline-flex items-center gap-1"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit Website →
                      </a>
                    </div>
                  )}

                  {p.sources && p.sources.length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        View Sources ({p.sources.length})
                      </summary>
                      <div className="mt-2 text-xs text-muted-foreground space-y-1">
                        {p.sources.map((s, idx) => (
                          <div key={`${s}-${idx}`}>
                            <a href={s} target="_blank" rel="noreferrer" className="hover:text-primary underline">
                              Source {idx + 1}
                            </a>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No planners found matching your search.</p>
        </div>
      )}

      <footer className="mt-8 text-xs text-muted-foreground">
        <p>
          Note: This list is curated for planners only. Please verify contacts before outreach.
        </p>
      </footer>
    </div>
  );
}
