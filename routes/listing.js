const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route
router.get("/", async (req, res) => {
  try {
    const search = req.query.search?.trim();
    let query = {};

    if (search && search.length > 0) {
      query = {
        $or: [
          { location: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } }
        ]
      };
    }

    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

// New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Create Route - FIXED: Injects logged-in user ID as the listing owner
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);
    
    // Associate the currently logged-in user as the owner
    newListing.owner = req.user._id;
    
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
}));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// Show Route - FIXED: Added .populate("owner") so show.ejs has access to the owner's _id
router.get("/:id", wrapAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.send("Invalid Listing ID");
  }

  // Populating the owner field is required for authorization checks in show.ejs
  const listing = await Listing.findById(id).populate("owner");
  
  if (!listing) {
    req.flash("error", "Listing you are looking for does not exist!");
    return res.redirect("/listings");
  }
  
  res.render("listings/show.ejs", { listing });
}));

// Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

module.exports = router;

























// const express = require("express");
// const router = express.Router();
// const Listing = require("../models/listing.js");




// //Index Route
// router.get("/", async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// });

// //New Route
// router.get("/new", (req, res) => {
//   res.render("listings/new.ejs");
// });

// //Show Route
// router.get("/:id", async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/show.ejs", { listing });
// });

// //Create Route
// router.post("/", async (req, res,next) => {
//   try{
//     const newListing = new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");
//   } catch(err){
//     next(err);
//   };
// });

// //Edit Route
// router.get("/:id/edit", async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// });

// //Update Route
// router.put("/:id", async (req, res) => {
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   res.redirect(`/listings/${id}`);
// });

// //Delete Route
// router.delete("/:id", async (req, res) => {
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   res.redirect("/listings");
// });

// module.exports = router;
