const express = require('express');
const axios = require('axios');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const API_PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/getMatchlist/:summonerName', (req, res) => {
  const summonerName = req.params.summonerName;
  fetchMatchlist(process.env.LEAGUE_API_KEY, summonerName).then(data => {
    console.log('data: ', data);
    res.json(data);
  });
});

app.get('/getMatch/:matchId', (req, res) => {
  const matchId = req.params.matchId;
  fetchMatch(process.env.LEAGUE_API_KEY, matchId).then(data => {
    console.log('matchIddata: ', data);
    res.json(data);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const fetchMatch = async (api_key, matchId) => {
  try {
    const matchData = await axios.get(
      `https://na1.api.riotgames.com/lol/match/v4/matches/${matchId}?api_key=${api_key}`
    );

    return matchData.data;
  } catch (err) {
    console.log('error: ', err);
  }
};

const fetchMatchlist = async (api_key, summonerName) => {
  try {
    const userData = await axios.get(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api_key}`
    );

    const accountId = userData.data.accountId;

    const matchListData = await axios.get(
      `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?endIndex=1&beginIndex=0&api_key=${api_key}`
    );
    const matches =
      matchListData && matchListData.data && matchListData.data.matches;
    const matchesIdAndChamp = matches.map(match => {
      return {
        gameId: match.gameId,
        championId: match.champion
      };
    });

    return matchesIdAndChamp;
  } catch (err) {
    console.log('error: ', err);
  }
};

app.listen(API_PORT, () => console.log(`listening on port ${API_PORT}`));
