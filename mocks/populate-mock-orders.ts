import { createMockOrder } from "./create-mock-order";
import * as dotenv from "dotenv";
dotenv.config();

import Order from "../models/Order";
import dbConnection from "../shared/dbConnection";
const randomOrders = Array.from({ length: 1000 }, createMockOrder);

(async function () {
  const connection = await dbConnection();

  try {
    await Order.collection.insertMany(randomOrders);
    console.info("Orders inserted successfully");
  } catch (err) {
    console.error(err);
  } finally {
    connection.disconnect();
  }
})();
