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
	    	newTopThree: [],
	    	topThree: [],
	    	humor: [],
	    	trash: []
	    };
	},

    /***
     * initial load components from server, write to file, short poll interval on file
     *
     */
    componentDidMount: function() {
        this.loadCommentsFromServer();
        //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },


    loadCommentsFromServer: function() {
     	var url = this.state.url || this.props.url;
	    $.ajax({
	      url: url,
	      dataType: 'json',
	      cache: false,
	      success: function(data) {
	              console.log(data.payload);
	              console.log(data.humor);
	              var newTopThree = _.filter(data.payload, function (top) {
	              	return top.rank == 1 || top.rank == 2 || top.rank == 3;
	              });
console.dir(data.change);
	              this.setState({
			    	ranking: data.payload,
			    	newTopThree: newTopThree,
			    	humor: data.humor,
			    	trash: data.change
	              });

	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	  },

	renderHumor: function () {
		return (
		    React.createElement(HumorModule, {
		    	newTopThree: this.state.newTopThree,
		    	topThree: this.state.topThree,
	    		humor: this.state.humor,
	    		trash: this.state.trash
		    	})
		);
    },

	renderLeaderboard: function () {
		return (
		    React.createElement(Leaderboard, {
	    		ranking: this.state.ranking,
	    		newTopThree: this.state.newTopThree,
		    	topThree: this.state.topThree,
	    		renderHumor: this.renderHumor()
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

var HumorModule = React.createClass({
	render: function () {
		var humor = this.props.humor;
		var trash = this.props.trash;
		var newTop = this.props.newTopThree;
		var top = this.props.topThree;

		if (humor.length > 0) {
			var leaderChange = _.difference(top, newTop).length > 0 ? true : false;
			if (leaderChange) {
				humor = trash;
			}

			var r = Math.floor(Math.random() * (humor.length));

			var humorText = [];
			humorText.push(humor[r].text);
			var cls = humor[r].style;
	    	var rowClass = cx({
							triangle: true,
							right: cls == 'right' ? true : false,
							left: cls == 'left' ? true : false,
							top: cls == 'top' ? true : false,
						});
			return (
		  		<p className={rowClass}><i className="humor">"{humorText}"</i></p>
		  		);
		}
		return (
			<p></p>
			);
	}
})

var Leaderboard = React.createClass({

	leaderRowsTop: function (ranking) {
		return ranking.map(function(leader) {
		    	var isPrimary = (leader.rank % 2 === 1) ? true : false;
		    	var rank = leader.rank;
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
		    	if (rank == 1 || rank == 2 || rank == 3) {
			        return (
							<tr>
								<th scope="row"
								className={cx({ 
									row: true,
									primary: {isPrimary} 
								})}>
								{leader.rank}</th><td 
								className={rowClass}>
								{leader.name}</td><td>{metal}</td>
							</tr>
				     );
			    }
			});
	},

	leaderRowsUpcoming: function (ranking) {
		return ranking.map(function(leader) {
		    	var isPrimary = (leader.rank % 2 === 1) ? true : false;
		    	var rank = leader.rank;
		    	var rowClass = cx({
								rank: true,
								primary: {isPrimary} 
							});
		    	if (rank == 4 || rank == 5 || rank == 6) {
			        return (
							<tr className="rowChallenger">
								<th scope="row"
								className={cx({ 
									row: true,
									primary: {isPrimary}
								})}>
								</th><td 
								className={rowClass}>
								{leader.name}</td><td></td>
							</tr>
				     );
			    }
			});
	},

	render: function() {
		console.log(this.props.ranking);
		var newTopThree = this.props.newTopThree;
		var topThree = this.props.topThree;

		var leaderRows = [];
		var upcomingLeaderRows = [];
		var renderHumor = this.props.renderHumor;
		if (this.props.ranking) {
			leaderRows = this.leaderRowsTop(this.props.ranking);
			upcomingLeaderRows = this.leaderRowsUpcoming(this.props.ranking);
	    }
	    return (
			<div className="top6">
			<table className="table">
				<thead>
					<tr>
						<th scope="row" className="row">Rank</th><th>Leaders</th><th></th>
					</tr>
				</thead>
				<tbody>
	            	{leaderRows}
	    		</tbody>
	    	</table>
	    	{renderHumor}
	    	<div className="tableChallengers">
				<table className="table challengers">
					<thead>
						<tr>
							<th scope="row" className="row"></th><th>Attacking The Throne</th><th></th>
						</tr>
					</thead>
					<tbody>
		            	{upcomingLeaderRows}
		    		</tbody>
		    	</table>
	    	</div>
	    	</div>
		);
	}
});

ReactDom.render(<Board url="/leaderboard" pollInterval={20000} />, document.getElementById('leaderboard'));