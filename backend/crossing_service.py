import json
from pathlib import Path

DATA_PATH = Path(__file__).parent / "crossings.json"


def load_crossings():
    with open(DATA_PATH, "r") as file:
        data = json.load(file)

    crossings = []

    for item in data:

        regional_avg_wait = 30

        delay_percent = round(
            (
                (item["wait_time_minutes"] - regional_avg_wait)
                / regional_avg_wait
            ) * 100,
            1
        )

        crossings.append({

            "id": item["id"],

            "name": item["name"],

            "country":
            f"{item['country_from']} - {item['country_to']}",

            "country_from":
            item["country_from"],

            "country_to":
            item["country_to"],

            "wait_time":
            item["wait_time_minutes"],

            "throughput":
            item["crossings_per_day"],

            "commodity":
            item.get(
                "commodity",
                "General Goods"
            ),

            "lat":
            item["lat"],

            "lng":
            item["lng"],

            "status":
            item.get(
                "status",
                "Active"
            ),

            "risk_level":
            item.get(
                "risk_level",
                "Medium"
            ),

            "type":
            item.get(
                "type",
                "Land"
            ),

            # Intelligence layer

            "regional_avg_wait":
            regional_avg_wait,

            "delay_percent":
            delay_percent,

            "why_this_matters":
            "Border crossings affect supply chains and logistics efficiency.",

            "who_controls":
            "Customs agencies and border authorities regulate movement.",

            "importance_score":
            round(
                item["crossings_per_day"] / 1000
            )
        })

    return crossings