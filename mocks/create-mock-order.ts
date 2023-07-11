import { faker } from "@faker-js/faker";
import Order from "../models/Order";

export function createMockOrder() {
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 1);

  return new Order({
    customer: {
      fullName: faker.name.fullName(),
      email: faker.internet.email(),
    },
    items: Array.from(
      { length: faker.datatype.number({ min: 1, max: 10 }) },
      createMockItem
    ),
    date: faker.date.between(fiveYearsAgo, Date.now()),
  });
}

function createMockItem() {
  return {
    item: {
      name: faker.commerce.productName(),
      price: faker.commerce.price(1, 100),
    },
    quantity: faker.datatype.number({ min: 1, max: 10 }),
  };
}
