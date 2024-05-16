const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");

const app = express();
const port = 3000;



const db = new pg.Client({
   user: "postgres",
   host: "localhost",
   database: "Alma-Deficiency tracking",
   password: "Alma1234",
   port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let sku_tracking = [];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM sku_tracking ORDER BY id ASC");
    sku_tracking = result.rows;

    res.render("index.ejs", {
      listsku: sku_tracking,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const sku_code = req.body.newSku;
  const date_added = new Date();
  try {
    await db.query("INSERT INTO sku_tracking (sku_code, date_added) VALUES ($1, $2)", [sku_code,date_added]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteskuId;
  try {
    await db.query("DELETE FROM sku_tracking WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/updateDateOrder", async (req, res) => {
   const ordered = req.body.dateOrderChecked;
   const  id = req.body.updatedskuId;
   const order_date = new Date();
   try {
     await db.query("UPDATE sku_tracking SET ordered = $1, order_date = $2 WHERE id = $3", [ordered,order_date, id,]);
     res.redirect("/");
   } catch (err) {
     console.log(err);
   }
});

app.post("/deleteDateOrder", async (req, res) => {
  const id = req.body.updatedskuId;
  try {
    await db.query("UPDATE sku_tracking SET ordered = false, order_date = NULL WHERE id = $1", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting order date.");
  }
});


app.post("/updateDateArrival", async (req, res) => {
  const arrived  = req.body.dateArrivalChecked;
  const  id = req.body.updatedskuId2;
  const arrival_date = new Date();
  try {
    await db.query("UPDATE sku_tracking SET arrived = $1, arrival_date = $2 WHERE id = $3", [arrived,arrival_date, id,]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/deleteDate", async (req, res) => {
  const id = req.body.updatedskuId2;
  try {
    await db.query("UPDATE sku_tracking SET arrived = false, arrival_date = NULL WHERE id = $1", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting date.");
  }
});

app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
