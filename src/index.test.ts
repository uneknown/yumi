import app from "./index";
import { generateColors } from "./index";

describe("Avatar generator API", () => {
  it("Should return 200 response", async () => {
    const username = "mygoodusername";

    const res = await app.request("http://localhost/" + username);

    expect(res.status).toBe(200);
  });

  it("Should return 404 response", async () => {
    const res = await app.request("http://localhost/");

    expect(res.status).toBe(404);
  });
});

describe("Color generator", () => {
  it("Should return 2 colors", () => {
    const hash = "7562a9e5b4a7784085432fde9dfb92cd00c793fe8866a697f69a390c853da8be";

    const [c1, c2] = generateColors(hash);

    expect(c1).toBeDefined();
    expect(c2).toBeDefined();
  });
  it("Should return 2 different colors", () => {
    const hash = "7562a9e5b4a7784085432fde9dfb92cd00c793fe8866a697f69a390c853da8be";

    const [c1, c2] = generateColors(hash);

    expect(c1).not.toBe(c2);
  });

  it("Should return the correct colors based on a hash", () => {
    const hash = "7562a9e5b4a7784085432fde9dfb92cd00c793fe8866a697f69a390c853da8be";

    const [c1, c2] = generateColors(hash);

    expect(c1).toBe("#3a784c");
    expect(c2).toBe("#1f5993");
  });
});
