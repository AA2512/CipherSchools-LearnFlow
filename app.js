const express = require("express");
const morgan = require("morgan");
const ejs = require("ejs");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
//Database
const connectDB = require("./config/db");

require("./config/passport")(passport);

//Connecting to Database
connectDB();
const app = express();
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Setting Up View Engine
app.set("view engine", "ejs");

//Express Session
app.use(
  session({
    secret: "algozenith bootcamp",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Public Folder
app.use(express.static(path.join(__dirname, "public")));

//Routes

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/post", require("./routes/post"));
app.use("/comment", require("./routes/comment"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/stream"));
app.use("/upload", require("./routes/upload"));

app.get("/*", (req, res) => {
  res.render("error-404");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
