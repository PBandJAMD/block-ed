import React, { Component } from 'react';
import AjaxFunctions from '../../helpers/AjaxFunctions';
import Election from '../Election/Election';
import Option from '../Option/Option';
import './Profile.css';

export default class Profile extends Component {
  constructor(){
    super();

    this.state = {
      election: {
        name: '',
        id: 0,
        options: ['yes','no']
      },
      optionStr: '',
      elections: [],
      vote: {
        election: 0,
        options: 1,
        user_signature: 'thisisasignedmessage'
      }
    }
  }

  componentDidMount() {
    AjaxFunctions.pyGetElect()
      .then(e_data => {
        this.setState({
          elections: AjaxFunctions.mapElections(e_data)
        })
      })
      .catch(err => console.log(err))
  }

  handleOptionUpdate(e) {
    this.setState({
      optionStr: e.target.value
    })
  }

  //use component to add vote option on a button click
  //i.e. 1 input box (is component)
  //when the user presses 'add option' button
  //that option is stored in state and a new box is added
  //have them be able to edit previous choices.
  //i.e. save options, edit options, add option buttons
  //so they can store them in state or add a new option

  handleElectionUpdate(e) {
    this.setState({
      election: {
        name: e.target.value,
        id: this.state.elections.length + 1,
        options: []
      }
    })
  }

  handleAddOption() {
    console.log('adding option');
  }

  handleRemoveOption() {
    console.log('removing option');
  }

  electFetch() {
    let newElection = {
      name: this.state.election.name,
      id: this.state.election.id,
      options: this.state.optionStr.split(',')
    }

    AjaxFunctions.pyPostElect(newElection)
      .then(() => {
        let elections = this.state.elections;
        elections.push(newElection);
        this.setState({
          elections
        });
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        <div className="welcome-card">
          <h2>Welcome, {this.props.appState.user.username}</h2>
        </div>
        <div className="election">
          <div className="new-elections">
            <h4>Create a new election</h4>
            <p>
              Enter a tile and the choices for your election, seperated by commas.
            </p>
            <button onClick={() => this.electFetch()}>Create Election</button>
            <br/>
            <input
              type="search"
              placeholder="name"
              onChange={(e) => this.handleElectionUpdate(e)}
            />
            <Option
              handleOptionUpdate={(e) => this.handleOptionUpdate(e)}
              handleAddOption={() => this.handleAddOption()}
              handleRemoveOption={() => this.handleRemoveOption()}
            />
          </div>
          <Election
            elections={this.state.elections}
            handleVoteClick={(id) => this.props.handleVoteClick(id)}
          />
        </div>
      </div>
    );
  }
}
