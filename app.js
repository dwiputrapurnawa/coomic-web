require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const rootRoute = require("./routes/root");


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


app.use("/", rootRoute);




app.listen(process.env.PORT, () => {
    console.log("Server running on port", process.env.PORT);
})