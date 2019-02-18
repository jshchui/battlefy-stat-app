import React, { Component } from 'react';
import axios from 'axios';
import './css/App.css';
import MatchInfo from './components/MatchInfo';

class App extends Component {
  state = {
    summoner: '',
    matches: [],
    loading: false
  };

  handleChange = e => {
    this.setState({
      summoner: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });

    axios.get(`/getMatchlist/${this.state.summoner}`).then(res => {
      this.setState({
        matches: res.data,
        loading: false
      });
    });
  };

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <label>
            <input
              className="input-field"
              type="text"
              value={this.state.summoner}
              onChange={this.handleChange}
              placeholder="Type and enter summoner name here"
            />
          </label>
          {/* <input type="submit" value="Submit" /> */}
        </form>
        {this.state.loading ? <p>Getting Matches...</p> : null}
        {this.state.matches
          ? this.state.matches.map(match => {
              return (
                <MatchInfo
                  key={match.gameId}
                  gameId={match.gameId}
                  championId={match.championId}
                  summoner={this.state.summoner}
                />
              );
            })
          : null}
      </div>
    );
  }
}

export default App;
