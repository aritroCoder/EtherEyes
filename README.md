# EtherEyes

This snap will enable the metamask users to forecast the gas prices and plan their transactions beforehand.

#### Improved cost efficiency:

Knowing the expected gas price in advance allows users to make informed decisions on when to execute transactions. This can help reduce costs and increase overall efficiency by avoiding times of high gas prices.

#### Better planning:

Predictive models can help project future gas prices, allowing businesses and individuals to plan accordingly and minimize any potential negative impact on their operations.

#### Improved investor confidence:

For investors and traders, being able to predict gas prices can provide a deeper understanding of the market and increase confidence in their investments.

## Features

- Notification about current gas prices
- Dark theme available
- Notification toggle
- Graphical data representaion of gas prices
- You can set the urgency of your transaction

## Installation

#### Dependencies

- Python version 3.7-3.10 (recommended 3.9)
- yarn
- Metamask Flask

####

To check your python version run

```bash
python --version
```

#### Setting up the virtual environment

We recommended you using conda as environment manager, for installation instruction refer https://conda.io/projects/conda/en/latest/user-guide/install/index.html

Create a python 3.9 environment

```bash
conda create -n py39 python=3.9
```

This will prevent any dependency conflicts with your global level python installation

Installing requried libraries:

```bash
pip install "fastapi[all]"
pip install anyio
pip install numpy
pip install statsforecast
pip install requests
```

Setting up servers

```bash
cd ~/Desktop
git clone https://github.com/aritroCoder/transaction-insights.git
```

#### Setting up config

Create a file named `config.json` in `transaction-insights/` directory, and write in the file (Create an API key from https://owlracle.info/eth and paste it in place of `your_key`)

```json
{
  "key": "your_key"
}
```
Then copy this file to `transaction-insights/packages/snap/` and `transaction-insights/packages/site` directories

Starting the python server

```bash
cd ~/Desktop/transaction-insights/
uvicorn fastserver:app --reload --port 5000
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

## Authors

This project is built for inter IIT Tech meet 11 by the team of Institute ID: 23
