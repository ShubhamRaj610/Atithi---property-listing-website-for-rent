const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");


const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const User = require("./models/user.js");
const Listing = require("./models/listing.js"); 


const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// 1. Basic Settings
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2. Standard Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// 3. Session Configuration 
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// 4. Passport Configuration 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 5. Flash & Local Variables Middleware (MUST BE BEFORE ROUTES)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.current = req.user;
  
  next();
});

// 6. Routes
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

// app.get("/demouser", async (req, res) => {
//   try {
//     const fakeUser = new User({
//       email: "raman10@gmail.com",
//       username: "Raman10",
//     });
//     const registeredUser = await User.register(fakeUser, "Hello");
//     res.send(registeredUser);
//   } catch (err) {
//     res.send(err.message);
//   }
// });

// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username: "delta-student",
//   }) ;
  
//   let registeredUser = await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/", userRouter); 

// 7. Error Handling
// Use a named parameter (like 'path') with the wildcard
// Remove the string path entirely. 
// Express will apply this middleware to EVERY request that reaches this point.
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { message , err });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

























// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema} = require("./schema.js");
// const listings = require("./routes/listing.js");
// const session = require("express-session");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");
// const flash = require("connect-flash");

// const listingRouter = require("./routes/listing.js");
// const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine("ejs", ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));

// const sessionOptions = {
//   secret : "mysupersecretcode",
//   resave : false,
//   saveUninitialized : true,
//   cookie:{
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge :7 * 24 * 60 * 60 * 1000,
//     httpOnly : true,
//   },
// };

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });



// app.use("/listings",listings);

// app.use(session(sessionOptions));
// app.use(flash());



// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// /* ✅ ADDED MIDDLEWARE (only this part) */
// app.use((req,res,next)=>{
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currUser = req.user;
//   next();
// });

// app.get("/demouser", async (req, res, next) => {
//   try {
//     const fakeUser = new User({
//       email: "raman10@gmail.com",
//       username: "Raman10",
//     });

//     const registeredUser = await User.register(fakeUser, "Hello");
//     res.send(registeredUser);

//   } catch (err) {
//     res.send(err.message);
//   }
// });



// app.use("/listings",listingRouter);
// app.use("/",userRouter);

// // app.use((err,req,res,next)=>{
// //   console.log(err);
// //   res.send(err.message);
// // });

// app.use((err, req, res, next) => {
//     let { status = 500, message = "Something went wrong" } = err;
//     res.status(status).render("error.ejs", { err });
// });

// app.listen(8080, () => {
//   console.log("server is listening to port 8080");
// });









































