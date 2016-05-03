# foos-leaderboard
Foosball Arcade Style Leaderboard

# Build
npm install

# Run
npm start

# Post to /leaderboard
curl -i -X POST -H "Content-Type:application/json" -d '{"payload":[{"name":"Alex","rank":1,"wins":13,"loses":1},{"name":"Justin","rank":2,"wins":10,"loses":9},{"name":"Charles","rank":9,"wins":7,"loses":7},{"name":"Sandeep","rank":4,"wins":6,"loses":5},{"name":"Jun","rank":5,"wins":6,"loses":5},{"name":"Shriram","rank":6,"wins":5,"loses":5}]}' https://foos-leaderboard.appspot.com/leaderboard