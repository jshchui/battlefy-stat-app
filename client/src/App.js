import React, { Component } from 'react';
import axios from 'axios';
import './css/App.css';
import MatchInfo from './components/MatchInfo';

class App extends Component {
  state = {
    summonerInput: '',
    currentSummoner: '',
    matches: null,
    loading: false
  };

  handleChange = e => {
    this.setState({
      summonerInput: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });

    axios.get(`/getMatchlist/${this.state.summonerInput}`).then(res => {
      this.setState({
        matches: res.data,
        loading: false,
        currentSummoner: this.state.summonerInput
      });
    });
  };

  renderMatches = () => {
    if (this.state.matches === '')
      return <p>The user doesn't exist or there was a problem :(</p>;
    if (!this.state.matches) return null;
    return (
      <div>
        <p>Previous matches for {this.state.currentSummoner}</p>
        {this.state.matches.map(match => (
          <MatchInfo
            key={match.gameId}
            gameId={match.gameId}
            championId={match.championId}
            summoner={this.state.currentSummoner}
          />
        ))}
      </div>
    );
  };

  render() {
    return (
      <div className="App">
        <form className="input-form" onSubmit={this.handleSubmit}>
          <input
            className="input-field"
            type="text"
            value={this.state.summonerInput}
            onChange={this.handleChange}
            placeholder="Type and enter summoner name here"
          />
          <input className="input-submit" type="submit" value="Submit" />
        </form>
        {this.state.loading ? <p>Getting Matches...</p> : null}
        {this.renderMatches()}
      </div>
    );
  }
}

export default App;
