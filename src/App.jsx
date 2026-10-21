import { useEffect, useMemo, useState } from 'react'
import { MapContainer, ImageOverlay, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Search, Navigation, MapPin, LocateFixed, Bus, Trees, Landmark, Toilet, Languages, Menu, X, ArrowUpRight, Route, Info, ChevronRight, Crosshair, Building2, CloudSun, ChevronDown, Compass, Building, GraduationCap, HeartHandshake } from 'lucide-react'

const W = 1591, H = 927
const bounds = [[0, 0], [H, W]]
const places = [
  { id:'A', name:'Lallubhai Park', category:'Landmark', x:974, y:298, detail:'Main park landmark', mr:'लल्लुभाई पार्क' },
  { id:'B', name:'MTNL', category:'Landmark', x:844, y:359, detail:'MTNL landmark', mr:'एमटीएनएल' },
  { id:'C', name:'TATA Colony', category:'Landmark', x:902, y:216, detail:'TATA Colony', mr:'टाटा कॉलनी' },
  { id:'D', name:'Rajasthan Vidyarthi Griha', category:'Educational Institute', x:1023, y:519, detail:'Student residence / institution', mr:'राजस्थान विद्यार्थी गृह' },
  { id:'E', name:'Madanlal Rajpuria Vidyarthi Griha', category:'Educational Institute', x:1048, y:452, detail:'Student residence / institution', mr:'मदनलाल राजपुरिया विद्यार्थी गृह' },
  { id:'F', name:'ICICI Bank Apartment', category:'Landmark', x:1223, y:436, detail:'ICICI Bank Apartment landmark', mr:'आयसीआयसीआय बँक अपार्टमेंट' },
  { id:'G', name:'Sardar Vallabhai Patel Garden', category:'Park / Playground', x:1398, y:379, detail:'Garden / open space', mr:'सरदार वल्लभभाई पटेल उद्यान' },
  { id:'H', name:'Nirmaya Seva Foundation', category:'Landmark', x:1467, y:490, detail:'Community service landmark', mr:'निर्मया सेवा फाउंडेशन' },
  { id:'BUS1', name:'Bus Stop — Swami Vivekanand Road', category:'Bus Stop', x:704, y:535, detail:'Bus stop shown on the information map', icon:'bus', mr:'बस थांबा' },
  { id:'BUS2', name:'Bus Stop — Swami Vivekanand Road East', category:'Bus Stop', x:1183, y:778, detail:'Bus stop shown on the information map', icon:'bus', mr:'बस थांबा' },
  { id:'TOILET', name:'Public Toilet', category:'Public Toilet', x:1213, y:829, detail:'Public toilet symbol shown near Swami Vivekanand Road', icon:'toilet', mr:'सार्वजनिक स्वच्छतागृह' },
]
const categories = [
  { name:'Landmark', icon:Landmark, count:5 },
  { name:'Park / Playground', icon:Compass, count:1 },
  { name:'Bus Stop', icon:Bus, count:2 },
  { name:'Educational Institute', icon:GraduationCap, count:2 },
  { name:'Public Toilet', icon:Toilet, count:1 },
]
function Recenter({ selected }) {
  const map = useMap()
  useEffect(() => { if (selected) map.flyTo([H - selected.y, selected.x], Math.max(map.getZoom(), 0.1), { duration: .55 }) }, [selected, map])
  return null
}
function makeIcon(place, selected) {
  const label = place.icon === 'bus' ? '🚌' : place.icon === 'toilet' ? '🚻' : place.id.length === 1 ? place.id : '•'
  return L.divIcon({ className:'custom-pin-wrap', html:`<div class="custom-pin ${selected?'selected':''} ${place.id.length===1?'letter-pin':''}">${label}</div>`, iconSize:[34,38], iconAnchor:[17,32], popupAnchor:[0,-30] })
}
function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All places')
  const [selected, setSelected] = useState(null)
  const [showRoute, setShowRoute] = useState(false)
  const [language, setLanguage] = useState('EN')
  const [mobilePanel, setMobilePanel] = useState(false)
  const [notice, setNotice] = useState('')
  const filtered = useMemo(() => places.filter(p => (category==='All places' || p.category===category) && `${p.name} ${p.category} ${p.id}`.toLowerCase().includes(query.toLowerCase())), [query, category])
  const selectPlace = (p) => { setSelected(p); setShowRoute(false); setMobilePanel(false); setNotice('') }
  const navigate = () => {
    if (!selected) { setNotice('Choose a destination from search, category cards, or the map first.'); return }
    setShowRoute(true)
    setNotice('Route preview displayed. The line is illustrative; verified pedestrian turn-by-turn directions require a mapped walking network.')
  }
  const locate = () => {
    if (!navigator.geolocation) { setNotice('Location services are not supported by this browser.'); return }
    navigator.geolocation.getCurrentPosition(() => setNotice('GPS permission received. This image-based map is not georeferenced, so your live position cannot yet be aligned accurately.'), () => setNotice('Location access was denied or unavailable. Enable browser location permission and try again.'), { enableHighAccuracy:true, timeout:8000 })
  }
  const clearMap = () => { setSelected(null); setShowRoute(false); setNotice('Map view reset.') }
  return <div className="app-shell">
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand-mark" onClick={clearMap} aria-label="Home"><Building2 size={24}/></button>
        <div className="brand-copy"><div className="brand-name">Brihanmumbai Municipal Corporation</div><div className="brand-sub">Lallubhai Park · K/West Ward – 70</div></div>
        <div className="top-actions"><button className="lang-button" onClick={()=>setLanguage(language==='EN'?'MR':'EN')}><span>{language==='EN'?'Eng':'मराठी'}</span><ChevronDown size={15}/></button><button className="studio-mark" onClick={()=>setNotice('Designed for Lallubhai Park Smart Navigation.')} aria-label="Project information"><Compass size={23}/></button><button className="mobile-menu" onClick={()=>setMobilePanel(!mobilePanel)}>{mobilePanel?<X/>:<Menu/>}</button></div>
      </div>
    </header>
    <main className="page-content">
      <section className="hero-banner"><div className="hero-kicker">BMC · K/WEST WARD 70</div><h1>{language==='EN'?"LET'S EXPLORE":"चला, परिसर पाहूया"}</h1><p>{language==='EN'?'Lallubhai Park & Neighbourhood':'लल्लुभाई पार्क आणि परिसर'}</p><div className="hero-decoration"><Compass size={84} strokeWidth={1}/></div></section>
      <section className="status-row"><div className="status-card"><span className="status-icon"><CloudSun size={24}/></span><div className="status-copy"><strong>{language==='EN'?'Park information map':'उद्यान माहिती नकाशा'}</strong><small>{language==='EN'?'Explore landmarks and public facilities':'महत्त्वाची ठिकाणे आणि सार्वजनिक सुविधा शोधा'}</small></div><span className="status-count">{places.length} <small>places</small></span><ChevronRight size={17}/></div><div className="live-gps"><span className="gps-dot"/> <span>Live GPS tracking</span><button onClick={locate}>Enable <LocateFixed size={15}/></button></div></section>
      <section className="search-section"><div className="search-wrap"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={language==='EN'?'Search landmarks, roads, parks, schools...':'महत्त्वाची ठिकाणे, रस्ते, उद्याने, शाळा शोधा...'} aria-label="Search places"/>{query&&<button onClick={()=>setQuery('')} aria-label="Clear search"><X size={17}/></button>}</div></section>
      <section className="category-panel"><div className="category-grid">{categories.map(c=>{const Icon=c.icon;return <button key={c.name} className={`category ${category===c.name?'active':''}`} onClick={()=>setCategory(category===c.name?'All places':c.name)}><span className="category-icon"><Icon size={21}/></span><span className="category-label">{language==='MR'?({ 'Landmark':'महत्त्वाचे ठिकाण','Park / Playground':'उद्यान / खेळाचे मैदान','Bus Stop':'बस थांबा','Educational Institute':'शैक्षणिक संस्था','Public Toilet':'सार्वजनिक स्वच्छतागृह'}[c.name]):c.name}</span>{c.name==='Landmark'&&<small>(8)</small>}</button>})}</div>{category!=='All places'&&<div className="filter-summary">Showing {filtered.length} {category.toLowerCase()} result(s) <button onClick={()=>setCategory('All places')}>Show all</button></div>}</section>
      <section className="map-section"><div className="section-title"><div><span className="section-kicker">GIS MAP</span><h2>{selected?selected.name:'Explore Lallubhai Park'}</h2></div><div className="map-actions"><button onClick={locate}><LocateFixed size={16}/><span>My location</span></button><button onClick={clearMap} aria-label="Reset map"><Crosshair size={16}/></button></div></div><div className="map-frame"><MapContainer crs={L.CRS.Simple} bounds={bounds} minZoom={-1.5} maxZoom={2.5} zoom={-0.15} maxBounds={[[-80,-80],[H+80,W+80]]} maxBoundsViscosity={0.7} zoomControl={true} className="park-map"><ImageOverlay url="/lallubhai-park-map.jpeg" bounds={bounds} opacity={1}/>{places.filter(p=>category==='All places'||p.category===category).map(p=><Marker key={p.id} position={[H-p.y,p.x]} icon={makeIcon(p,selected?.id===p.id)} eventHandlers={{click:()=>selectPlace(p)}}><Popup><div className="popup-content"><span className="popup-category">{p.category}</span><strong>{p.name}</strong><p>{p.detail}</p><button onClick={()=>selectPlace(p)}>Set as destination →</button></div></Popup></Marker>)}{showRoute&&selected&&<Polyline positions={[[H-413,1110],[H-445,1080],[H-486,1020],[H-selected.y,selected.x]]} pathOptions={{color:'#078c84',weight:5,opacity:.9,dashArray:'9 9'}}/>}<Recenter selected={selected}/></MapContainer><div className="map-overlay-label"><span className="map-dot"/> {showRoute?'ROUTE PREVIEW ACTIVE':'LALLUBHAI PARK · INFORMATION MAP'}</div><div className="map-scale">Map locations are approximate</div></div>
        {selected&&<div className="selected-place-card"><div className="selected-badge">{selected.id.length===1?selected.id:<MapPin size={17}/>}</div><div className="selected-copy"><span>{selected.category}</span><strong>{selected.name}</strong><p>{selected.detail}</p></div><button className="selected-action" onClick={navigate}><Navigation size={16}/> Directions</button><button className="close-selected" onClick={()=>{setSelected(null);setShowRoute(false)}} aria-label="Clear selection"><X size={18}/></button></div>}
        {notice&&<div className="notice"><Info size={17}/><span>{notice}</span><button onClick={()=>setNotice('')}><X size={16}/></button></div>}
      </section>
      <section className="history-card"><p>Explore Lallubhai Park and its surrounding neighbourhood using this digital version of the information-board map. Select a numbered landmark or use search to find local places, gardens, educational institutions, bus stops, and public facilities.</p><p>The map includes key roads such as Swami Vivekanand Road, Bharucha Road, and Lallubhai Park Road. Locations are currently digitized approximately from the supplied map image and should be verified against official GIS data before use for precise navigation.</p></section>
      <section className="people-section"><div className="people-card"><div className="people-icon"><HeartHandshake size={26}/></div><h2>GUIDED BY</h2><div className="people-name">Shri. Ameet Satam ji</div><p>Hon’ble MLA &amp; President of BJP Mumbai</p></div><div className="people-divider"/><div className="people-card"><div className="people-icon gold"><Building size={26}/></div><h2>PROJECT INITIATED BY</h2><div className="people-name">Shri. Aneesh Naval Makwaaney ji</div><p>Corporator</p></div><div className="people-divider"/><div className="support-section"><h2>SUPPORTED BY</h2><div className="support-items"><div className="support-item"><span className="support-logo"><Trees size={29}/></span><strong>Local Community</strong><small>Neighbourhood participation</small></div><div className="support-item"><span className="support-logo gold"><MapPin size={29}/></span><strong>Lallubhai Park</strong><small>Stronger community, better neighbourhood</small></div></div></div><div className="people-divider"/><div className="design-section"><h2>DESIGN BY</h2><div className="design-logo"><Compass size={34}/></div><strong>Sapthakalaa</strong><small>Environmental Design, Planning and Management</small></div></section>
      <footer className="page-footer"><span>© Design by Sapthakalaa Environmental Design, Planning and Management</span><span>Smart Navigation · Developed by Shubham Shinde</span></footer>
    </main>
  </div>
}
export default App
