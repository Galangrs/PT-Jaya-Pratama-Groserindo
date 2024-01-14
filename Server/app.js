require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const Controller = require("./Controllers/controller");
const Authentication = require("./Middlewares/authentication");
const hadleError = require("./Middlewares/handleError");

app.post("/register", Controller.Register);
app.post("/login", Controller.Login);

app.use(Authentication);

app.post("/createhistory", Controller.CreateHistory);
app.post("/report", Controller.GenerateSalesReport);

app.use(hadleError);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
