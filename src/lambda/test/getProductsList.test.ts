const mockProducts: ProductType[] = [
  { id: "1", title: "Product 1", description: "", price: 10 },
  { id: "2", title: "Product 2", description: "", price: 20 },
  { id: "3", title: "Product 3", description: "", price: 30 },
];

import { handler } from "../getProductsList";
import { ProductType } from "../../utils/types";

jest.mock("../../database", () => ({
  DATABASE: mockProducts,
}));

describe("getProductsList", () => {
  it("should return a list of products", async () => {
    const response = await handler();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify(mockProducts));
  });
});