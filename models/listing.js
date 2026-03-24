const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1766643676717-c6933a3ef596?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },

  price: Number,
  location: String,
  country: String,

  owner: {
    type:Schema.Types.ObjectId,
    ref:"User",
  }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;







// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const ListingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,

//   image: {
//     filename: String,
//     default:
//       "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
//     set: (v) =>
//       v === ""
//         ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
//         : v,
//   },

//   price: Number,
//   location: String,
//   country: String,
// });

// const Listing = mongoose.model("Listing", ListingSchema);
// module.exports = Listing;

