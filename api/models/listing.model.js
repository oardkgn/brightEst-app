import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
    rooms: {
      bathrooms: {
        type: Number,
        required: true,
      },
      bedrooms: {
        type: Number,
        required: true,
      },
      kitchens: {
        type: Number,
        required: true,
      },
      livingrooms: {
        type: Number,
        required: true,
      },
    },
    attributes: {
      furnished: {
        type: Boolean,
        required: true,
      },
      security: {
        type: Boolean,
        required: true,
      },
      wifi: {
        type: Boolean,
        required: true,
      },
      parking: {
        type: Boolean,
        required: true,
      },
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
