import mongoose from "mongoose";

const Order = new mongoose.Schema({
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
  },
  items: [
    {
      item: {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
      quantity: { type: Number, required: true },
    },
  ],
  date: { type: Date, required: true },
});

// This prevents Mongoose from recompiling the model.
export default mongoose.models?.Order || mongoose.model("Order", Order);
