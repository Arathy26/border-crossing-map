# 🗺️ Border Crossing Activity Map
### POC 39 - Real Rails Intelligence Library

A production-style border crossing intelligence dashboard 
built with Next.js, FastAPI, MapLibre and deck.gl.

## 🚀 Features
- Interactive dark world map with MapLibre GL
- Real-time border crossing markers with risk colors
- Animated flow lines between high-risk crossings
- 10 feature tabs: Map, Charts, Compare, Delays, Analytics, Distance, Table, Trade, Census, deck.gl
- Smart search with dropdown suggestions
- FastAPI backend with Pandas + GeoPandas analytics
- UN Comtrade + US Census mock data (labeled)
- OpenStreetMap Overpass API integration
- Turf.js distance calculator
- TanStack Table with sorting
- CSV data download

## 🛠️ Tech Stack
**Frontend:** Next.js 16, TypeScript, Tailwind CSS, MapLibre GL JS, deck.gl, Turf.js, TanStack Table, Recharts

**Backend:** Python FastAPI, Pandas, GeoPandas, Shapely

**Data:** OpenStreetMap, UN Comtrade (mock), US Census (mock), Synthetic crossing data

## ⚡ Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**

## 📊 Data Sources
| Source | Type |
|--------|------|
| OpenStreetMap Overpass API | Live |
| UN Comtrade | Synthetic |
| US Census Bureau | Synthetic |
| Crossing wait times | Synthetic |

## 👤 Built By
Student working towards becoming an AI Engineer at Anthropic 🎯
