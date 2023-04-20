import express from "express";
import mongoose from "mongoose";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import flash from "express-flash";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import dotenv from "dotenv";
import bycrypt from "bcrypt";

// locals imports
import getUser from "./routes/users.js";
import registerUser, {
  checkAuthenticated,
  checkNotAuthenticated,
} from "./routes/auth.js";
import getHome from "./routes/home.js";
import createStatement from "./routes/statement.js";
import Case from "./models/Case.js";
import assTask from "./routes/assign.js";
import Assign from "./models/Assigned.js";
// import initialize from "./passport-config.js";
import User from "./models/Users.js";

// initialise the app
const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.set("view engine", "ejs");
// Set the directory for views
// app.set("views", __dirname + "/views");
app.set('views', 'C:/Users/ASHIE/Desktop/police-management-system-main/views');

// app.set("views", path.join(__dirname, "views"));
dotenv.config();
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// passport local strategy

passport.use(
  new LocalStrategy(
    {
      usernameField: "regNo",
      passwordField: "password",
    },
    async function (regNo, password, done) {
      try {
        const user = await User.findOne({ regNo:regNo });
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        const isMatch = await bycrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (error) {
        return done(null, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});


// middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));


// middleware to check authorisation
function requireRegNoA(req, res, next) {
  const user = req.user;
  if (user && user.regNo && user.regNo.startsWith('A')) {
    next();
  } else {
    alert("UnAuthorise")
    res.redirect('/login');
  }
}

// routes endpoints
app.use("/users", getUser);
app.use("/auth", registerUser);
app.use("/home",checkNotAuthenticated, getHome);
app.use("/statement", createStatement);
app.use("/assign", requireRegNoA, assTask);

app.get("/", checkNotAuthenticated, function (req, res) {
  res.render('index')
});

app.post("/auth/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed, redirect to the login page
      req.flash('error', "No user with the provided logins")
      return res.redirect("/login");
    }
    if (user.regNo.startsWith("A")) {
      // Redirect to the admin panel if regNo starts with 'A'
      req.login(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/admin");
      });
    } else {
      // Redirect to the user dashboard if regNo does not start with 'A'
      req.login(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/dashboard");
      });
    }
  })(req, res, next);
});


app.get("/login",checkNotAuthenticated, function (req, res) {
  if (!res.headersSent) {
    res.render("login",{ errorMessage: req.flash('error') });
  }
});

app.get("/register", function (req, res) {
  if (!res.headersSent){
  res.render("register", { errorMessage: req.flash('error') });
  }
});

app.get("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    // Successful logout
    res.redirect('/');
    // redirects to home page
  });
});
app.get("/tables", checkAuthenticated, function (req, res) {
  res.render("tables");
});

app.get("/dashboard", checkAuthenticated, function (req, res) {
  res.render("dashboard", { name: req.user.name });
});

app.get("/forms", checkAuthenticated, function (req, res) {
  res.render("forms");
});
app.get("/policeofficers", checkAuthenticated, function (req, res) {
  res.render("policeOfficers");
});

app.get("/assign", checkAuthenticated, requireRegNoA, function (req, res) {
  res.render("assign");
});

app.get("/admin", checkAuthenticated, requireRegNoA, (req, res) => {
  res.render("admin");
});

app.get("/a-tables", checkAuthenticated, requireRegNoA, (req, res) => {
  res.render("a-tables")
})

// api fetching endpoints
app.get("/api/statements", async (req, res) => {
  const data = await Case.find();
  res.json(data);
});

app.get("/api/open", async (req, res) => {
  const data = await Assign.find();
  if(data.length > 0){
    const caseIdList = data.map(item=>item.caseId)
    // console.log(caseIdList)
    const dataPromises = caseIdList.map(item=>Case.find({caseId: item}))
    const dataArray = await Promise.all(dataPromises)
    const caseData= dataArray.flat().reduce((acc, val) => acc.concat(val),[])
    res.json(caseData)
  }else{
    res.status(404).json({error: "No case assigned to this police officer"});
  }
});

app.get("/api/task", async (req, res) => {
  const caseAssigned = await Assign.find({ policeNumber: req.user.regNo });
  // console.log(caseAssigned);
  if (caseAssigned.length > 0) {
    const idList = caseAssigned.map(item => item.caseId);
    const dataPromises = idList.map(id => Case.find({ caseId: id }));
    const dataArray = await Promise.all(dataPromises);
    const data = dataArray.flat().reduce((acc, val) => acc.concat(val), []);
    res.json(data);
    // console.log(data);
    console.log("sent success");
  } else {
    res.status(404).json({error: "No case assigned to this police officer"});
  }
});

// PUT endpoint to update a case's isClosed property
app.put('/api/task/:id', async (req, res) => {
  try {
    const caseFile = await Case.findOne({ caseId: req.params.id });
    if (!caseFile) {
      return res.status(404).json({ message: 'File not found' });
    }
    const idd = caseFile._id;
    const updatedAssign = await Case.findByIdAndUpdate(idd, { isClosed: true }, { new: true });
    res.json(updatedAssign);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// police officers epi endpoint

app.get("/api/police", async (req, res) => {
  const data = await User.find();
  res.json(data);
});

// Route to handle the DELETE request to /api/close/:caseId
app.delete('/api/close/:caseId', async (req, res) => {
  const caseId = req.params.caseId;
    // Delete the document with the specified caseId
    try {
      const deletedStatus = await Assign.findOneAndDelete({ caseId })
      if (!deletedStatus) {
        // Return an error response if the document was not found
        return res.status(404).json({ error: `Case ${caseId} not found` });
      }
       // Return a success message
      res.json({ message: `Case ${caseId} has been closed` });
    } catch (error) {
      console.log(error)
      res.status(500).json({message: "Failed to delete the caseFile"})
    }
});


// mongodb connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
console.log("Connected to the Database");

// server listening port
const port = 3000;
app.listen(port, () => {
  console.log(`server started at ${port}`);
});
