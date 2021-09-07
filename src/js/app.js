App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  // Initialize the app.
  init: function() {
    return App.initWeb3();
  },

  // Initialize connection of the client side application to the local blockchain.
  initWeb3: async function() {
    // TODO: refactor conditional.
    // If a web3 instance is already provided by Meta Mask.
    if (typeof web3 !== 'undefined') {
      // Set the web3 provider to the apps' web3 provider.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      // Request acess to the user account.
      await web3.currentProvider.enable();
    } // If no web3 instance is provided. 
    else {
      // Specify default instance.
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  // Initialize the contract.
  initContract: function() {
    // Load JSON file of the Election contract artifact.
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact.
      // The actual contract we can interact with inside the app.
      App.contracts.Election = TruffleContract(election);
      // Set the provider of the contract as the provider created on the previous function.
      App.contracts.Election.setProvider(App.web3Provider);
      // Render the app.
      return App.render();
    });
  },

  // Render the apps' content.
  render: function() {
    // Variable to store an instance of Election. 
    var electionInstance;
    // Variable to store the loader template.
    var loader = $("#loader");
    // Variable to store the content HTML element.
    var content = $("#content");

    loader.show();
    content.hide();

    // Load the account we're connected to the blockchain with.
    web3.eth.getAccounts(function(err, accounts) {
      if (err === null) {
        console.log('No errors getting the account.')
        console.log('Account:', accounts[0])
        // Set the fetched account to the current account in the app.
        App.account = accounts[0];
        // Display the account in the accounts' address section.
        $("#accountAddress").html("Your Account: " + accounts[0]);
      }
    });

    // Load contract data.
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      // Get the candidates count.
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      // For loop to through all the candidates.
      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          // Variables to store the ids, names and vote counts of each candidate.
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Template to render the candidates' data.
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          // Append the template to the table on the page.
          candidatesResults.append(candidateTemplate);
          // Render candidate ballot option.
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }

      loader.hide();
      content.show();
    }).cath(function(error) {
      console.warn(error);
    });
  }

  // castVote: function() {
  //   var candidateId = $('#candidatesSelect').val();
  //   App.contracts.Election.deployed().then(function(instance) {
  //     return instance.vote(candidateId, { from: App.account });
  //   }).then(function(result) {
  //     // Wait for votes to update.
  //     $("#content").hide();
  //     $("#loader").show();
  //   }).catch(function(err) {
  //     console.error(err);
  //   });
  // }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});