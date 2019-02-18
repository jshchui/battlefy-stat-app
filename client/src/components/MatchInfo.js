import React, { Component } from 'react';
import axios from 'axios';

import champions from '../data/champion.json';
import runesReforged from '../data/runesReforged.json';
import summonerSpells from '../data/summoner.json';
import items from '../data/item.json';

class MatchInfo extends Component {
  state = {
    currentPlayerStats: null,
    gameDurationInMinutes: null
  };

  componentDidMount() {
    axios
      .get(`/getMatch/${this.props.gameId}`)
      .then(res => {
        const participantIdentities = res.data.participantIdentities;
        const participants = res.data.participants;
        const currentPlayerStats = this.getPlayerStats(
          participantIdentities,
          participants
        );
        const gameDurationInMinutes = res.data.gameDuration / 60;
        this.setState({
          currentPlayerStats: currentPlayerStats,
          gameDurationInMinutes: gameDurationInMinutes.toFixed(1).toString()
        });
      })
      .catch(error => {
        alert(error);
        console.log('error: ', error);
      });
  }

  getChampPlayed = championId => {
    const currentChamp = Object.values(champions.data).find(
      champ => champ.key === championId.toString()
    );

    return {
      name: currentChamp.name,
      image: currentChamp.image.full
    };
  };

  getPlayerStats = (playerIdentities, participants) => {
    const currentPlayerId = playerIdentities.find(
      participant =>
        participant.player.summonerName.toLowerCase() ===
        this.props.summoner.toLowerCase()
    ).participantId;

    const currentPlayerStats = participants.find(
      participant => participant.participantId === currentPlayerId
    );

    return currentPlayerStats;
  };

  renderSummonerSpellsImages = () => {
    if (!this.state.currentPlayerStats) return null;
    const { spell1Id, spell2Id } = this.state.currentPlayerStats;
    const summonerSpellList = summonerSpells.data;
    const spell1Image = Object.values(summonerSpellList).find(
      data => parseInt(data.key) === spell1Id
    ).image.full;
    const spell2Image = Object.values(summonerSpellList).find(
      data => parseInt(data.key) === spell2Id
    ).image.full;

    return (
      <div className="profile__summoner-spells">
        <img
          className="summoner-spell"
          alt="summoner spell"
          src={`../assets/summoner-spells/${spell1Image}`}
        />
        <img
          className="summoner-spell"
          alt="summoner spell"
          src={`../assets/summoner-spells/${spell2Image}`}
        />
      </div>
    );
  };

  renderPerkImages = () => {
    if (!this.state.currentPlayerStats) return null;
    const { stats } = this.state.currentPlayerStats;
    const { perk0, perkPrimaryStyle, perkSubStyle } = stats;

    const primaryPerkData = runesReforged.find(
      mastery => mastery.id === perkPrimaryStyle
    ).slots;

    const mainPerkImage = primaryPerkData[0].runes.find(
      perk => perk.id === perk0
    ).icon;

    const subPerkImage = runesReforged.find(
      mastery => mastery.id === perkSubStyle
    ).icon;

    return (
      <div className="perk">
        <img
          className="perk__main"
          alt="masteries"
          src={`../assets/${mainPerkImage}`}
        />
        <img
          className="perk__sub"
          alt="masteries"
          src={`../assets/${subPerkImage}`}
        />
      </div>
    );
  };

  renderItems = () => {
    if (!this.state.currentPlayerStats) return null;
    const {
      item0,
      item1,
      item2,
      item3,
      item4,
      item5,
      item6
    } = this.state.currentPlayerStats.stats;

    const itemData = items.data;

    const item0Image = (item0 && itemData[item0].image.full) || '0.png';
    const item1Image = (item1 && itemData[item1].image.full) || '0.png';
    const item2Image = (item2 && itemData[item2].image.full) || '0.png';
    const item3Image = (item3 && itemData[item3].image.full) || '0.png';
    const item4Image = (item4 && itemData[item4].image.full) || '0.png';
    const item5Image = (item5 && itemData[item5].image.full) || '0.png';
    const item6Image = (item6 && itemData[item6].image.full) || '0.png';

    return (
      <div className="inventory">
        <img
          className="inventory__item"
          alt="items"
          src={`../assets/item/${item0Image}`}
        />
        <img
          className="inventory__item"
          alt="items"
          src={`../assets/item/${item1Image}`}
        />
        <img
          className="inventory__item"
          alt="items"
          src={`../assets/item/${item2Image}`}
        />
        <img
          className="inventory__item"
          alt="trinket"
          src={`../assets/item/${item6Image}`}
        />
        <img
          className="inventory__item"
          alt="items"
          src={`../assets/item/${item3Image}`}
        />
        <img
          className="inventory__item"
          alt="items"
          src={`../assets/item/${item4Image}`}
        />
        <img
          className="inventory__item"
          alt="items"
          src={`../assets/item/${item5Image}`}
        />
      </div>
    );
  };

  render() {
    const playerChamp = this.getChampPlayed(this.props.championId);
    const stats =
      this.state.currentPlayerStats && this.state.currentPlayerStats.stats;
    const outcome = stats && stats.win;
    const gameDuration = this.state.gameDurationInMinutes;

    const kills = stats && stats.kills.toString();
    const deaths = stats && stats.deaths.toString();
    const assists = stats && stats.assists.toString();
    const kda = ((parseInt(kills) + parseInt(assists)) / parseInt(deaths))
      .toFixed(1)
      .toString();

    const level = stats && stats.champLevel.toString();
    const creepScore = stats && stats.totalMinionsKilled.toString();
    const creepScorePerMinute =
      creepScore && (creepScore / gameDuration).toFixed(1).toString();

    return (
      <div
        className={`match ${outcome ? 'victory__border' : 'defeat__border'}`}
      >
        <div className="match-stats profile">
          <img
            className="profile__champion"
            alt="champion"
            src={`../assets/champion/${playerChamp.image}`}
          />
          {this.renderSummonerSpellsImages()}
        </div>

        <div className="match-stats">
          <p className={outcome ? 'victory__text' : 'defeat__text'}>
            {outcome ? 'Victory' : 'Defeat'}
          </p>
          <p>{playerChamp.name}</p>
          <p>
            {kills} / {deaths} / {assists}
          </p>
          <p>KDA: {kda}</p>
        </div>

        <div className="match-stats">
          {this.renderItems()}
          <p>Level {level}</p>
          <p>
            Creep Score: {creepScore} ({creepScorePerMinute}/m)
          </p>
        </div>

        <div className="match-stats">
          {this.renderPerkImages()}
          <p>Duration</p>
          <p>{gameDuration} minutes</p>
        </div>
      </div>
    );
  }
}

export default MatchInfo;
