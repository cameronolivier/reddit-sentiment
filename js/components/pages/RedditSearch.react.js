/*
 * RedditSearch
 * This is the first thing users see of our App
 */

import React, { Component } from 'react';
import { Link } from 'react-router';

//Assistant Libraries
var $ =require('jquery');
var _ = require("lodash");
var sentiment = require("sentiment");


var SearchResults = React.createClass({
    render : function() {
        console.log('results sent', this.props.results);

        if (_.isEmpty(this.props.results)) {
            var loader = [];
            if (this.props.loading) {
                loader.push(<div className="loading"><img src="img/default.gif" /></div>);
            }
            return (<div id="results" className="search-results">{loader}</div>);
        }
        var results = [];
        var avg = 0;
        var numResults = this.props.results.length;
        var i = 1;
        _.forEach(this.props.results, function(result){
            console.log();
            var sentimentScore = sentiment(result.body);
            console.log("Sentiment Score " + i + ":",sentimentScore);
            results.push(<div className="result" key={"result_" + i}><p className="comment-score"><strong>Sentiment score:</strong> {sentimentScore.score}</p><p className="comment">{result.body}</p><p className="comment-meta"><strong>Comment by:</strong> {result.author} | <strong>Subreddit:</strong> {result.subreddit}</p></div>);
            results.push();
            avg += sentimentScore.score;
            i++;
        });

        console.log('Average: ', avg, 'Num Results', numResults);
        var average = avg/numResults;

        var color = "";
        if (average > 10)   {color = "darkgreen";}
        else if (average > 5)    {color = "green";}
        else if (average > 0)    {color = "lightgreen";}
        else if (average === 0)  {color = "skyblue";}
        else if (average < -10 )   {color = "red";}
        else if (average < -5)    {color = "orange";}
        else if (average < 0)   {color = "yellow";}

        return(<div className="search-results">
            <div className="overall-sentiment" style={{borderColor : color}}>Overall sentiment for {this.props.company}: <strong>{average}</strong></div>
            <h3>Comment Results:</h3>
            {results}
        </div>);
    }
});

var RedditSearch = React.createClass({
    getInitialState : function(){
      return({
          searchTerm : "",
          searchResults : {},
          loading : false
      });
    },
    handleChange : function(e) {
        console.log('term updated.');
        var term = e.target.value;
        this.setState({
            searchTerm : term,
            searchResults : {}
        });
        console.log('Search term:', this.state.searchTerm);
    },
    handleSubmit : function(e) {
        e.preventDefault();
        if (!_.isEmpty(this.state.searchTerm)) {
            console.log('fetching results for "' + this.state.searchTerm + '"');
            this.setState({loading : true});
            var url = "https://api.pushshift.io/reddit/search?q=" + this.state.searchTerm;
            $.ajax({
                url: url,
                context: this
            }).done(function (response) {
                console.log('data fetched');
                var data = response.data;
                this.setState({
                    searchResults: data,
                    loading: false
                });
                console.log('Search Results:', this.state.searchResults);
            }, this);
        } else {

        }
    },
    render : function () {
        return (<div className="app-wrap">
            <h1>Reddit Sentiment Analyser</h1>
            <p>This is a simple little tool that searches the latest Reddit comments for a given company. It returns all comments referencing the company as well as an indication of how positive or negative each comment is and an overall sentiment on that company.</p>
            <div className="search-form">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Search for a company, eg Microsoft" className="search-form-entry" onChange={this.handleChange} />
                    <button type="submit">Check Sentiment</button>
                </form>
            </div>
            <SearchResults results={this.state.searchResults} company={this.state.searchTerm} loading={this.state.loading} />
        </div>);
    }
});

module.exports = RedditSearch;