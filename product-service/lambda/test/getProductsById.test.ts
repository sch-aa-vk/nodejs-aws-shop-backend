import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../getProductsById";

describe("getProductsById", () => {
  it("should return a success response with the product details when a valid product ID is provided", async () => {
    const event = {
      httpMethod: "GET",
      path: "/products/{productId}",
      pathParameters: {
        productId: "1",
      },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();

    expect(JSON.parse(response.body)).toEqual({
      id: 1,
      title: "Pie Shell - 5",
      description: "Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
      price: 25.79
    });
  });

  it("should return a not found response when an invalid product ID is provided", async () => {
    const event = {
      httpMethod: "GET",
      path: "/products/{productId}",
      pathParameters: {
        productId: "99999",
      },
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(event);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeDefined();

    expect(JSON.parse(response.body)).toEqual({
      message: "Product not found"
    });
  });
});