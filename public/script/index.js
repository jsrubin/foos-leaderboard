/** @jsx React.DOM */
var React = require('react');
var ReactDom = require('react-dom');
var Modal = require('react-modal');
var _ = require('underscore');

Modal.setAppElement(document.getElementById('leaderboard'));
Modal.injectCSS();

var Board = React.createClass({
	getInitialState: function () {
  		return {
  			url: '',
	    	ranking: [],
	    	trash: []
	    };
	},

    /***
     * initial load components from server, write to file, short poll interval on file
     *
     */
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },


    loadCommentsFromServer: function() {
     	var url = this.state.url || this.props.url;
	    $.ajax({
	      url: url,
	      dataType: 'json',
	      cache: false,
	      success: function(data) {
	              this.setState({
			    	ranking: data.ranking,
			    	trash: data.change
	              });

	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},

	renderLeaderboard: function () {
		return (
		    React.createElement(Leaderboard, {
	    		ranking: this.state.ranking
		    	})
		);
    },

    render: function () {
	    return (
	        <nav >
	          <div role="board"> 

	              {this.renderLeaderboard()}

	          </div>
	       </nav>
	    );
  	}
});

function cx(map) {
  var className = [];
  Object.keys(map).forEach(function (key) {
    if (map[key]) {
      className.push(key);
    }
  });
  return className.join(' ');
}

var Leaderboard = React.createClass({

	score: function (wins, losses) {
		return Math.round((wins / (wins + losses)) * 100) / 100;
	},

	totalGames: function (wins, losses) {
		return wins + losses;
	},

	ranking: function (ranking) {
		var self = this;
		_.each(ranking, function (player) {
			player.score = self.score(player.wins, player.losses);
			player.total = self.totalGames(player.wins, player.losses);
		});

		return _.sortBy(ranking, function (player) {
			return player.score;
		}).reverse();
	},

	leaderRowsTop: function (ranking, displayCount) {
		return ranking.map(function(leader, index) {
				var rank = index + 1;
		    	var isPrimary = (rank % 2 === 1) ? true : false;
		    	var rowClass = cx({
								rank: true,
								primary: {isPrimary} 
							});
		    	var metal = [];

		    	if (rank == 1) {
		    		metal.push(<img src="resources/gold.png"/>);
		    	} if (rank == 2) {
		    		metal.push(<img src="resources/silver.png"/>);
		    	} if (rank == 3) {
		    		metal.push(<img src="resources/bronze.png"/>);
		    	}

		    	if (rank <= displayCount) {
			        return (
							<tr>
								<td>
								</td>
								<th scope="row"
								className={cx({ 
									row: true,
									primary: {isPrimary} 
								})}>
								{rank}</th>
								<td 
								className={rowClass}>
								{leader.name}</td>
								<td>
								{leader.score} %
								</td>
								<td>{metal}</td>
							</tr>
				     );
			    }
			});
	},

	render: function() {
		var leaderRows = [];
		var displayCount = 6;

		if (this.props.ranking && this.props.ranking.length > 0) {
			var ranking = this.ranking(this.props.ranking);
			leaderRows = this.leaderRowsTop(ranking, displayCount);
	    }
	    return (
			<div className="top6">
			<table className="table">
				<thead>
					<tr>
						<th></th><th scope="row" className="row">Rank</th><th>Leader</th><th>Score</th><th></th>
					</tr>
				</thead>
				<tbody>
	            	{leaderRows}
	    		</tbody>
	    	</table>
	    	</div>
		);
	}
});

ReactDom.render(<Board url="/leaderboard" pollInterval={300000} />, document.getElementById('leaderboard'));