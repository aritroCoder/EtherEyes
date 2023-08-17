# EtherEyes

![Ethereyes logo](https://user-images.githubusercontent.com/92646038/217149434-7099535c-81eb-40d4-99ed-62b12d4dbfd4.png)

Presenting before you EtherEyes, an **_award winning_** hackathon project that enables users to make cheaper transactions by predicting the gas price and providing timely gas price notifications.

View our pulished blog where we discuss more of the technical details involved: ![Ethereyes blog](https://metamask.io/news/developers/ether-eyes-snap-predicting-future-gas-prices/).

#### Improved cost efficiency:

Knowing the expected gas price in advance allows users to make informed decisions on when to execute transactions. This can help reduce costs and increase overall efficiency by avoiding times of high gas prices.

#### Better planning:

Predictive models can help project future gas prices, allowing businesses and individuals to plan accordingly and minimize any potential negative impact on their operations.

## Features

- Notification about current gas prices
- Suggests user to buy when lowest gas price reached
- Set urgency of your transaction
- Toggle Notifications
- Graphical data representaion of gas prices
- Dark theme :)

## Installation

#### Dependencies

- Python version 3.7-3.10 (recommended 3.9)
- yarn
- Metamask Flask

#### Setting up the virtual environment

We recommended you using conda as environment manager, for installation instruction refer https://conda.io/projects/conda/en/latest/user-guide/install/index.html

Create a python 3.9 environment

```bash
conda create -n py39 python=3.9
```

This will prevent any dependency conflicts with your global level python installation

Installing requried libraries:

```bash
pip install -r requirements.txt
```

Setting up servers

```bash
cd ~/Desktop
git clone https://github.com/aritroCoder/transaction-insights.git
```

#### Setting up config

Open the file named `key.json` in `transaction-insights/` directory, and write in the file (Create an API key from https://owlracle.info/eth and paste it in place of `your_key`)

```json
{
  "key": "your_key"
}
```

Then copy and replace(when prompted) this file to `transaction-insights/packages/snap/` and `transaction-insights/packages/site/src/` directories

Starting the python server

```bash
cd ~/Desktop/transaction-insights/
uvicorn server:app --reload --port 5000
```

Open a new terminal to start yarn server

```bash
cd ~/Desktop/transaction-insights/
yarn install
yarn start
```

Done both the servers are running now..

## Getting Started

- Visit http://localhost:8000/ to access the snap website
- Connect the snap to Metamask
- Python server is at http://127.0.0.1:5000/

## Working

We collect live gas price data as a list of around 200 candlesticks (each candlestick is an aggregate of the past 30 minutes of data) using the [Owlracle](https://owlracle.info/eth) API. This gives us the timeseries data of past 100 hours of gas prices.

We then use a popular time series forecasting model called SARIMA or Seasonal ARIMA from the [statsforecast](https://nixtla.github.io/statsforecast/models.html#autoarima) package on the timeseries data to predict the lowest gas price expected in the next hour.

### Why SARIMA?

- A lot of literature on SARIMA for time-series forecasting in varying domains ([[1]](#1),[[2]](#2),[[3]](#3)) stated that the performance of SARIMA is good. We also referred to a study on ethereum gas price statistics [[4]](#4), where they used SARIMA and obtained promising results.
- An alternative would be deep learning techniques which usually involve larger models which also take more time to re-train hence making it less ideal for streaming data.

## Authors

This project is built for inter IIT Tech meet 11 by the team of Institute ID: 23(IIT Patna), and was awarded a **_bronze medal_** by Consensys.
Team members:

- [Vaishakh](https://github.com/Vaishakh-SM)
- [Aritra](https://github.com/aritroCoder)
- [Padmaksh](https://github.com/Padmaksh-Mishra)
- [Kartikay](https://github.com/KartuzGupta)

## References

<a id ="1">[1]</a>
A hybrid SARIMA and support vector machines in forecasting the production values of the machinery industry in Taiwan. Expert Systems with Applications, 32(1), 254-264. https://doi.org/10.1016/j.eswa.2005.11.027

<a id ="2"> [2] </a>
Dynamic linear model and SARIMA: a comparison of their forecasting performance in epidemiology. https://doi.org/10.1002/sim.963

<a id ="3">[3]</a>
Long-term runoff study using SARIMA and ARIMA models in the United States. https://doi.org/10.1002/met.1491

<a id="4">[4]</a>
Carl, David and Ewerhart, Christian, Ethereum Gas Price Statistics (December 22, 2020). University of Zurich, Department of Economics, Working Paper No. 373, 2020, Available at: http://dx.doi.org/10.2139/ssrn.3754217
