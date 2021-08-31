module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    compilers: {
      solc: {
        version: '^0.4.11', // A version or constraint - Ex. "^0.5.0". Can also be set to "native" to use a native solc.
      }
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    }
  }
};

