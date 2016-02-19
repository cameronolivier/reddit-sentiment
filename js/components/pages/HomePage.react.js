/*
 * HomePage
 * This is the first thing users see of our App
 */

import { asyncChangeProjectName, asyncChangeOwnerName, asyncSearchReddit } from '../../actions/AppActions';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class HomePage extends Component {
  render() {
    const dispatch = this.props.dispatch;
    const { projectName, ownerName, searchTerm } = this.props.data;
    return (
    <div>
        <h1><span className="home__text--red">{ projectName }</span></h1>
        <h2>This little webapp was made  by <a href={'https://twitter.com/' + ownerName} >@{ ownerName }</a></h2>
        <p>Current search term is: {searchTerm}</p>

        <form action="" onSubmit={this.onSubmit}>
            <label className="home__label">Search Reddit for a company to assess:
                <input className="home__input" type="text" onChange={(evt) => { dispatch(asyncSearchReddit(evt.target.value)); }} defaultValue="Apple" value={searchTerm} />
            </label>
            <button type="submit" className="btn">Search</button>
        </form>

    </div>
    );
  }
}

// REDUX STUFF

// Which props do we want to inject, given the global state?
function select(state) {
  return {
    data: state
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(HomePage);
