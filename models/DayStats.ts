import mongoose from "mongoose";
import Order from "./Order";

const DAY_STATS_COLLECTION_NAME = "day_stats";

// Schema of the aggregate documents stored in materialized view.
const DayStats = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    date: { type: Date, required: true },
    revenue: { type: Number, required: true },
    orders: { type: Number, required: true },
    averageOrderRevenue: { type: Number, required: true },
  },
  { collection: DAY_STATS_COLLECTION_NAME, versionKey: false }
);

// Aggregation pipeline for the materialized view.
export async function calculateDayStats() {
  await Order.aggregate([
    // Flattens items array to calculate sums later.
    { $unwind: { path: "$items" } }, // Actual calculations for totals and averages.
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        revenue: {
          $sum: { $multiply: ["$items.quantity", "$items.item.price"] },
        },
        orders: { $sum: 1 },
        averageOrderRevenue: {
          $avg: { $multiply: ["$items.quantity", "$items.item.price"] },
        },
      },
    }, // Adding date object after grouping for querying // the materialized view in future (to use date comparison).
    {
      $addFields: {
        date: {
          $dateFromString: { dateString: "$_id", format: "%Y-%m-%d" },
        },
      },
    }, // Rounding calculated values.
    {
      $set: {
        revenue: { $round: ["$revenue", 5] },
        orders: { $round: ["$orders", 5] },
        averageOrderRevenue: { $round: ["$averageOrderRevenue", 5] },
      },
    },
    // Saving to materialized view (writing into collection).
    { $merge: { into: DAY_STATS_COLLECTION_NAME, whenMatched: "replace" } },
  ]);
}

// This prevents Mongoose from recompiling the model.
export default mongoose.models?.DayStats ||
  mongoose.model("DayStats", DayStats);
