let data = require('./jsonData.js')
const playersData = require('./index')



async function result(){
  const jsonData = await data.readJsonFile();
    const points = await CalculatePoints(jsonData)
    const players = await playersData.sampleCreate()

    players.forEach(player => {
      player.points = points[player.Player] || 0;
    });
  return players
}
async function  CalculatePoints(jsonData) {
  const playerPoints = {}; // Object to store player-wise points
  const playerCount ={}
  const playerRuns={}
  const playerCrossed30 = {}; // Object to track players who crossed 30 runs
  const playerCrossed50={}
  const playerCrossed100={}
  const playerCatchOuts = {};
  // Iterate through the JSON data
  for (const ball of jsonData) {
    const batsman = ball.batter;
    const bowler = ball.bowler;
    const fielder = ball.fielders_involved;

    // Update points for batsman
    if (!playerPoints[batsman]) {
      playerPoints[batsman] = 0;
    }
    if (!playerRuns[batsman]) {
      playerRuns[batsman] = 0;
    }

    playerRuns[batsman] += ball.batsman_run; // Increment runs for the batsman

    if (ball.batsman_run > 0) {
      playerPoints[batsman] += ball.batsman_run; // Runs
      if (ball.batsman_run === 4) {
        playerPoints[batsman] += 1; // Boundary Bonus
      } else if (ball.batsman_run === 6) {
        playerPoints[batsman] += 2; // Six Bonus
      }
      if (!playerCrossed30[batsman] && playerRuns[batsman] >= 30) {
        playerPoints[batsman] += 4; // 30 Run Bonus
        playerCrossed30[batsman] = true; // Mark player as crossed 30 runs

      }
      if (!playerCrossed50[batsman] && playerRuns[batsman] >= 50) {
        playerPoints[batsman] += 8; // 50 Run Bonus
        playerCrossed50[batsman] = true; // Mark player as crossed 50 runs

      }
      
      if (!playerCrossed100[batsman] && playerRuns[batsman] >= 100) {
        playerPoints[batsman] += 16; // 100 Run Bonus
        playerCrossed100[batsman] = true; // Mark player as crossed 100 runs

      }
      if (ball.isWicketDelivery === 1 && playerRuns[batsman] === 0) {
        playerPoints[batsman] -= 2; // Dismissal for a duck
      }
    }

    // Update points for bowler
    if (!playerPoints[bowler]) {
      playerPoints[bowler] = 0;
    }

    // Update count for bowler
    if (!playerCount[bowler]) {
      playerCount[bowler] = 0;
    }

    if (ball.isWicketDelivery === 1) {
      playerCount[bowler]++; // Increment the count for wicket delivery
    }
    // console.log(playerCount)

    if (ball.isWicketDelivery === 1 && ball.kind !='Run Out') {
      playerPoints[bowler] += 25; // Wicket
      if (ball.kind === 'lbw' || ball.kind === 'bowled') {
        playerPoints[bowler] += 8; // Bonus (LBW / Bowled)
      }
      // console.log(playerPoints)
      if (ball.kind == 'LBW'||ball.kind== 'Bowled') {
        playerPoints[bowler] += 8; // Wicket Bonus
      }
      // console.log("1",playerPoints)
      if (playerCount[bowler]===3) {
        playerPoints[bowler] += 4; // 3 Wicket Bonus
      }
      // console.log("2",playerPoints)
      if (playerCount[bowler]===4) {
        playerPoints[bowler] += 8; // 4 Wicket Bonus
      }
      // console.log("3",playerPoints)
      if (playerCount[bowler]===5) {
        playerPoints[bowler] += 16; // 5 Wicket Bonus
      }
      // console.log("4",playerPoints)
      // if (ball.maiden === 1) {
      //   playerPoints[bowler] += 12;
      // }
    }

    // Update points for fielder
    if (fielder !== 'NA' && !playerPoints[fielder]) {
      playerPoints[fielder] = 0;
    }
    if (!playerCatchOuts[fielder]) {
      playerCatchOuts[fielder] = 0;
    }

    playerCatchOuts[fielder] += ball.kind; // Increment runs for the batsman


    if (fielder !== 'NA') {
      playerCatchOuts[fielder] += 1
      playerPoints[fielder] += 8; // Catch
      if (playerCatchOuts[fielder] === 3 && !playerCatchOuts[fielder]) {
        playerPoints[fielder] += 4; // 3 Catch Bonus
        playerCatchOuts[fielder]=true
      }
    }
    if (ball.kind === 'stumped' && fielder !== 'NA') {
      playerPoints[fielder] += 12; // Stumping
    }
    if (ball.kind === 'run out' && fielder !== 'NA') {
      playerPoints[fielder] += 6; // Run out
    }
  }

  return playerPoints
}

module.exports=result
// const points =calculatePoints(jsonData)
// console.log(points,"final")