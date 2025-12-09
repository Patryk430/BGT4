const bgt = artifacts.require("bgt");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("bgt", function (/* accounts */) {
  it("should assert true", async function () {
    await bgt.deployed();
    return assert.isTrue(true);
  });
});
