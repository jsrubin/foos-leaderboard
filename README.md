# foos-leaderboard
Classic Arcade Style Foosball Leaderboard

# Build
npm install

# Run
npm start

# Post to /leaderboard
curl -i -X POST -H "Content-Type:application/json" -d '{"payload":[{"wins":5,"losses":10,"name":"bendy"},{"wins":8,"losses":7,"name":"foosy"},{"wins":8,"losses":7,"name":"lazy"},{"wins":9,"losses":6,"name":"roddy"}]}' http://foos-leaderboard.appspot.com/leaderboard