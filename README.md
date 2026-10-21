# Lallubhai Park Smart Navigation

Responsive React + Vite prototype inspired by the supplied Lallubhai Park information-board map and the reference website layout.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Features

- Responsive BMC-style header and gradient hero banner
- Search field and category cards
- Interactive Leaflet map using the supplied printed park map as an image overlay
- Clickable landmark, garden, bus stop, education, and public toilet markers
- Destination selection, approximate route preview, and browser geolocation permission check
- English/Marathi language toggle
- Neighbourhood information and project credit sections

## Important map limitation

The map is currently an image overlay, not a georeferenced GIS map. Marker positions are approximate pixel coordinates. The displayed route is only an illustrative preview and is not turn-by-turn pedestrian routing. Production GPS navigation requires georeferenced GIS data, verified coordinates and a routable pedestrian network. The status card is informational and does not claim to show live weather or air-quality measurements.
