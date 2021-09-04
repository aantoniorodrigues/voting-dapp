// Create an abstraction of the contract.
var Election = artifacts.require('./Election.sol');

// Declare the contract (using Mocha testing frame).
contract('Election', function(accounts) {
    // Test to see if the contract initializes with the correct number of candidates.
    it('initializes with two candidates', function() {
        return Election.deployed().then(function(instance) {
            return instance.candidatesCount();
        }).then(function(count) {
            // Got 'assert' using Chai (included in truffle framework).
            assert.equal(count, 2);
        });
    });

    // Initialize electionInstance variable to use it on the next test.
    let electionInstance;
    // Test to see if the candidates are initialized with the correct data.
    it('it initializes the candidates with the correct values', function() {
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate) {
            assert.equal(candidate[0], 1, 'contains the correct id');
            assert.equal(candidate[1], 'Candidate 1', 'contains the correct name');
            assert.equal(candidate[2], 0, 'contains the correct votes count');
            return electionInstance.candidates(2);
        }).then(function(candidate) {
            assert.equal(candidate[0], 2, 'contains the correct id');
            assert.equal(candidate[1], 'Candidate 2', 'contains the correct name');
            assert.equal(candidate[2], 0, 'contains the correct votes count');
        });
    });
});