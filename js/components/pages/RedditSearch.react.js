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
            results.push(<p key={"author_" + i}><strong>{i}: Comment by:</strong> {result.author} | <strong>Sentiment score:</strong> {sentimentScore.score}</p>);
            results.push(<p key={"comment_" + i}>{result.body}</p>);
            avg += sentimentScore.score;
            i++;
        });

        console.log('Average: ', avg, 'Num Results', numResults);
        var average = avg/numResults;
        return(<div className="search-results">
            <h2>Overall sentiment for {this.props.company}: {average}</h2>
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
        console.log('fetching results for "' + this.state.searchTerm + '"');
        this.setState({loading : true});
        var url = "https://api.pushshift.io/reddit/search?q=" + this.state.searchTerm;
        $.ajax({
            url : url,
            context: this
        }).done(function(response) {
            console.log('data fetched');
            var data =	response.data;
            this.setState({
                searchResults : data,
                loading : false
            });
            console.log('Search Results:', this.state.searchResults);
        }, this);
    },
    render : function () {
        return (<div className="app-wrap">
            <h1>Reddit Sentiment Analyser</h1>
            <div className="search-form">
                <form onSubmit={this.handleSubmit}>
                    <label>Search for a company to analyse:</label>
                    <input type="text" placeholder="Search for a company, eg Microsoft" className="search-form-entry" onChange={this.handleChange} />
                    <button type="submit">Get Comments</button>
                </form>
            </div>
            <SearchResults results={this.state.searchResults} company={this.state.searchTerm} loading={this.state.loading} />
        </div>);
    }
});

module.exports = RedditSearch;