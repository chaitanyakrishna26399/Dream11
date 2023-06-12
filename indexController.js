let data = require('./jsonData.js')
const playersData = require('./index')
const result = require('./pointsCalculate.js')

const connectToDatabase = require('./db.js')

class indexControllers {
  static async playersList(req, res) {
    const players = await result()
    console.log(players);
    res.send(players)
  }
  static async selectPlayers(req, res) {
    let data = req.body
    // console.log(data)
    connectToDatabase()
      .then((db) => {
        
        const selectPlayersCollection = db.collection('selectPlayers');
   
        return selectPlayersCollection.insertOne(data);
      })
      .then((result) => {
        res.send('Document inserted successfully');
      })
      .catch((error) => {
        console.log('Error inserting document:', error);
      });


  }
  static async teamResult(req, res) {
    const SelectedPlayers = connectToDatabase()
      .then((db) => {
        const selectPlayers = db.collection('selectPlayers');
        return selectPlayers.find({}).toArray(function(err, documents) {
          if (err) {
            console.error('Failed to retrieve documents:', err);
            return;
          }
          return documents
        }
        )
      })

    const allTeams = await SelectedPlayers

    let fulldetails1 = []
    for (const selected_Players of allTeams) {
      const result = await allplayersData(selected_Players, fulldetails1)

    }
    // console.log(JSON.stringify(fulldetails1))
    let totalPointsList = fulldetails1.map((obj) => obj.totalpoints);
    // Step 2: Sort the data based on total points
    let sortedData = fulldetails1.sort((a, b) => b.totalpoints - a.totalpoints);
    // Step 3 & 4: Add ranks to each object
    let rank = 1;
    sortedData.forEach((obj, index) => {
      if (index > 0 && obj.totalpoints < sortedData[index - 1].totalpoints) {
        rank = rank + 1;
      }
      obj.rank = rank;
    });
    // Step 5: Update the data with ranks
    let updatedData = sortedData.map(({ rank, ...rest }) => ({ ...rest, rank }));
    console.log(updatedData);
    // res.send(JSON.stringify(updatedData))
    res.send(updatedData)
   
  }



}
async function allplayersData(selected_Players, fulldetails1) {
  const selectedPlayers = selected_Players.Players
  const players = await result()
  let fulldetails = []
  let totalPoints = 0;
  let captainId = selected_Players.Captain;
  let viceCaptainId = selected_Players.viceCaptain;
  let teamName=selected_Players.TeamName


  for (const player of players) {
    let StringPlayer = (player._id).toString()
    if (selectedPlayers.includes(StringPlayer)) {
      let Points = player.points;
      if (player._id === captainId) {
        Points *= 2;
      } else if (player._id === viceCaptainId) {
        Points *= 1.5;
      }
      totalPoints += Points;
      player.points = Points;
      fulldetails.push(player)

    }
  }

  var myObject = {}
  myObject.players = fulldetails;
  myObject.TeamName=teamName
  myObject.totalpoints = totalPoints

  fulldetails1.push(myObject)
 
}
module.exports = indexControllers
