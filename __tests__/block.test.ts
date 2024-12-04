import Block from "../src/lib/block";

describe("Block", () => {
  it("should be valid", () => {
    const block = new Block(2, "abc");
    expect(block.isValid()).toBe(true);
  });

  it("should be invalid (index)", () => {
    const block = new Block(-1, "");
    expect(block.isValid()).toBe(false);
  });

  it("should be invalid (hash)", () => {
    const block = new Block(0, "");
    expect(block.isValid()).toBe(false);
  });
});
