from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import numpy as np
from statsforecast.models import AutoARIMA
import json


def get_timeseries():
    with open('key.json') as f:
        data = json.load(f)
        print(data)

    key = data['key']

    history_data = requests.get(
        'https://api.owlracle.info/v3/eth/history?apikey={}&candles=100&txfee=true'
        .format(key))
    history_data = history_data.json()

    low = []

    for obj in history_data:
        low.append(obj['gasPrice']['low'])

    low.reverse()

    return np.array(low)


def get_prediction():
    values = get_timeseries()
    model = AutoARIMA()
    predictions = model.forecast(values, 2)
    print("Pred: ", predictions)
    prediction_json = {
        'low_30_minutes': predictions['mean'][0],
        'low_60_minutes': predictions['mean'][1]
    }

    return prediction_json


app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    pred = get_prediction()

    return pred