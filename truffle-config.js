module.exports = {

  networks: {
    development: 
    {
      host: "127.0.0.1", // Localhost
      port: 7545,
      network_id: "*",
    },
  },

  // Configure your compilers
  compilers: 
  {
    solc: 
    {
      version: "0.8.19",      // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
};
