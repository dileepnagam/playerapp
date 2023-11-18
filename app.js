const express = require("express");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running");
    });
  } catch (e) {
    console.log(`DB:Error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
//GET Players API
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
  SELECT * FROM cricket_team ORDER BY player_id;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//POST player API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO cricket_team(player_name,jersey_number,role) VALUES ('${player_name}','${jersey_number}','${role}');`;
  await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//GET player API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//UPDATE player API
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const bookDetails = request.body;
  const { playerName, jerseyNumber, role } = bookDetails;
  const addPlayerQuery = `UPDATE cricket_team SET player_name='${playerName}',jersey_number='${jerseyNumber}',role='${role}' WHERE player_id=${playerId};`;
  await db.run(addPlayerQuery);
  response.send("Player Details Updated");
});

//DELETE Player API
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteBookQuery = `DELETE FROM cricket_team WHERE player_id=${playerId};`;
  await db.run(deleteBookQuery);
  response.send("Player Removed");
});

