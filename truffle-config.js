module.exports = {

  networks: {
    development: 
    {
      host: "127.0.0.1", // Localhost
      port: 8545,
      network_id: "*",
    },
  },

  // Configure your compilers
  compilers: 
  {
    solc: 
    {
      version: "0.8.21",      // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
};
