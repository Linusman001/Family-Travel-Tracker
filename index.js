import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const log = console.log

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Bionjig001",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserColor = ""
let currentUserId = 1;


let users = ''


async function checkVisited() {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1", [currentUserId]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {
  const user_result = await db.query("SELECT * FROM users")
  users = user_result.rows
  log(users)
  const countries = await checkVisited();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: "teal"
  });
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );
    if (result.rows === 0) {
      const countries = await checkVisited()
      return res.render("index.ejs", {
        users: users,
        countries: countries,
        total: countries.length,
        color: currentUserColor,
        error: "Country does not exist, try again"
      })
    }

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      const countries = await checkVisited()
      res.render("index.ejs", {
        users: users,
        countries: countries,
        total: countries.length,
        color: currentUserColor
      })
    } catch (err) {
      console.error("Error adding country", err.stack)
      const countries = await checkVisited()
      res.render("index.ejs", {
        users: users,
        countries: countries,
        total: countries.length,
        color: currentUserColor,
        error: "Country already added, try again"
      })
    }
  } catch (err) {
    console.error("Error adding Country", err.stack)
    const countries = await checkVisited()
      res.render("index.ejs", {
        users: users,
        countries: countries,
        total: countries.length,
        color: currentUserColor,
        error: "Unexpected error occurred, try again"
      })
  }
});
app.post("/user", async (req, res) => {
  if (req.body.add === "new"){
    return res.render("new.ejs")
  }
  else {
    currentUserId = req.body.user
  }
  try {
    const result = await db.query("SELECT color FROM users WHERE id = $1", [currentUserId])
    currentUserColor = result.rows[0].color
    const countries = await checkVisited()
    log(currentUserColor)
    res.render("index.ejs", {
      users: users,
      countries: countries,
      total: countries.length,
      color: currentUserColor
    })

  } catch (error) {
    console.error(`Error Fetching User ID: ${currentUserId}`, error.stack)
    const countries = await checkVisited()
    res.render("index.ejs", {
      users: users,
      countries: countries,
      total: countries.length,
      color: "teal",
      error: 'An Error Occurred'
    })
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const name = req.body.name.trim()
  const color = req.body.color

  let result = await db.query("INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *", [name, color])
  log(result.rows)
  const user_result = await db.query("SELECT * FROM users")
  users = user_result.rows
  currentUserId = result.rows[0].id
  log(currentUserId)
  currentUserColor = result.rows[0].color
  const countries = await checkVisited();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUserColor,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
