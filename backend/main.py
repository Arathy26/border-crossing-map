import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.crossings import router
from crossing_service import load_crossings

app = FastAPI(
    title="Border Crossing Activity Map",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "project": "POC 39 Border Crossing Activity Map",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/api/stats")
def get_stats():

    data = load_crossings()

    total = len(data)

    active = len([
        d for d in data
        if d["status"] == "Active"
    ])

    restricted = len([
        d for d in data
        if d["status"] == "Restricted"
    ])

    avg_wait = round(
        sum(
            d["wait_time"]
            for d in data
        ) / total,
        1
    )

    high_risk = len([
        d for d in data
        if d["risk_level"] == "High"
    ])

    total_throughput = sum(
        d["throughput"]
        for d in data
    )

    commodities = {}

    for d in data:

        c = d.get(
            "commodity",
            "General Goods"
        )

        commodities[c] = (
            commodities.get(c, 0) + 1
        )

    risk_breakdown = {

        "Low":
        len([
            d for d in data
            if d["risk_level"] == "Low"
        ]),

        "Medium":
        len([
            d for d in data
            if d["risk_level"] == "Medium"
        ]),

        "High":
        len([
            d for d in data
            if d["risk_level"] == "High"
        ]),
    }

    regional_avg = 30

    delay_percent = round(
        (
            (avg_wait - regional_avg)
            / regional_avg
        ) * 100,
        1
    )

    return {

        "total": total,
        "active": active,
        "restricted": restricted,
        "avg_wait_time": avg_wait,
        "high_risk": high_risk,
        "total_throughput": total_throughput,

        "commodities": commodities,

        "risk_breakdown":
        risk_breakdown,

        "insights": {

            "delay_trend":
            f"{delay_percent}% above regional average",

            "why_this_matters":
            "Border crossings affect logistics speed and trade efficiency.",

            "who_controls":
            "Customs agencies and border authorities regulate movement."
        }
    }


@app.get("/api/analytics")
def get_analytics():

    data = load_crossings()

    df = pd.DataFrame(data)

    avg_wait_by_risk = (
        df.groupby("risk_level")
        ["wait_time"]
        .mean()
        .round(1)
        .to_dict()
    )

    avg_throughput_by_type = (
        df.groupby("type")
        ["throughput"]
        .mean()
        .round(0)
        .to_dict()
    )

    total_throughput_by_commodity = (
        df.groupby("commodity")
        ["throughput"]
        .sum()
        .to_dict()
    )

    top_delays = (
        df.nlargest(
            3,
            "wait_time"
        )
        [
            [
                "name",
                "wait_time",
                "country"
            ]
        ]
        .to_dict("records")
    )

    top_throughput = (
        df.nlargest(
            3,
            "throughput"
        )
        [
            [
                "name",
                "throughput",
                "country"
            ]
        ]
        .to_dict("records")
    )

    return {

        "avg_wait_by_risk":
        avg_wait_by_risk,

        "avg_throughput_by_type":
        avg_throughput_by_type,

        "total_throughput_by_commodity":
        total_throughput_by_commodity,

        "top_delays":
        top_delays,

        "top_throughput":
        top_throughput,
    }


@app.get("/api/geo-analysis")
def get_geo_analysis():

    try:

        import geopandas as gpd
        from shapely.geometry import Point

        data = load_crossings()

        df = pd.DataFrame(data)

        geometry = [

            Point(
                row["lng"],
                row["lat"]
            )

            for _, row
            in df.iterrows()
        ]

        gdf = gpd.GeoDataFrame(
            df,
            geometry=geometry,
            crs="EPSG:4326"
        )

        most_north = gdf.loc[
            gdf.geometry.y.idxmax(),
            "name"
        ]

        most_south = gdf.loc[
            gdf.geometry.y.idxmin(),
            "name"
        ]

        most_east = gdf.loc[
            gdf.geometry.x.idxmax(),
            "name"
        ]

        most_west = gdf.loc[
            gdf.geometry.x.idxmin(),
            "name"
        ]

        centroid = (
            gdf.geometry
            .unary_union
            .centroid
        )

        return {

            "most_north":
            most_north,

            "most_south":
            most_south,

            "most_east":
            most_east,

            "most_west":
            most_west,

            "centroid": {

                "lat":
                round(
                    centroid.y,
                    4
                ),

                "lng":
                round(
                    centroid.x,
                    4
                )
            },

            "total_crossings":
            len(gdf),

            "powered_by":
            "GeoPandas + Shapely"
        }

    except ImportError:

        return {

            "error":
            "GeoPandas not installed",

            "message":
            "Run: pip install geopandas"
        }