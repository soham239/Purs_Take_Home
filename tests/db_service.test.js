const AWS = require("aws-sdk");
const { createRDSDbService } = require("../dbService");

// Mock AWS.RDSDataService
jest.mock("aws-sdk", () => ({
  RDSDataService: jest.fn(),
}));

describe("createRDSDbService", () => {
  it("should return the same instance on consecutive calls", () => {
    // Call getInstance twice
    const firstInstance = createRDSDbService().getInstance();
    const secondInstance = createRDSDbService().getInstance();

    // Assert that both instances are the same
    expect(firstInstance).toStrictEqual(secondInstance);

    // Ensure RDSDataService constructor is called only once
    expect(AWS.RDSDataService).toHaveBeenCalledTimes(1);
  });
});
