// Create an abstraction of the contract.
var Election = artifacts.require('./Election.sol');

// Declare the contract (using Mocha testing frame).
contract('Election', function(accounts) {
    // Initialize electionInstance variable to use it on tests.
    let electionInstance;

    // Test to see if the contract initializes with the correct number of candidates.
    it('initializes with two candidates', function() {
        return Election.deployed().then(function(instance) {
            return instance.candidatesCount();
        }).then(function(count) {
            // Got 'assert' using Chai (included in truffle framework).
            assert.equal(count, 2);
        });
    });

    // Test to see if the candidates are initialized with the correct data.
    it('initializes the candidates with the correct values', function() {
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

    it('allows a voter to cast a vote', function() {
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, { from: accounts[0]});
        }).then(function(receipt) {
            return electionInstance.voters(accounts[0]);
        }).then(function(voted) {
            assert(voted, 'the voter was marked as voted');
            return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
            let voteCount = candidate[2];
            assert.equal(voteCount, 1, "increments the candidate's vote count");
        })
    });

    it('throws an exception for invalid candidates', function() {
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            // Try to vote for an candidate that doesn't exist.
            return electionInstance.vote(9, { from : accounts[1] });
        }).then(assert.fail).catch(function(error) {     // assert.fail to check for an error
            // Check if exception raised was a 'revert' exception.
            assert(error.message.indexOf('revert') >= 0, 'error message must contain "revert"');
            // Return candidate1 to check its vote count.
            return electionInstance.candidates(1);
        }).then(function(candidate1) {
            // Get the voute count of candidate1.
            let voteCount = candidate1[2]
            // Check if candidate1 received any votes.
            assert.equal(voteCount, 1, 'candidate 1 did not receive any votes');
            // Return candidate2 to check its vote count.
            return electionInstance.candidates(2);
        }).then(function(candidate2) {
            // Get the vote count of candidate2.
            let voteCount = candidate2[2];
            // Check if candidate1 received any votes.
            assert.equal(voteCount, 0, 'candidate 2 did not receive any votes');
        });
    });

    // it("throws an exception for double voting", function() {
    //     return Election.deployed().then(function(instance) {
    //         electionInstance = instance;
    //         candidateId = 1;
    //         electionInstance.vote(candidateId, { from: accounts[1] });
    //         return electionInstance.candidates(candidateId);
    //     }).then(function(candidate) {
    //         var voteCount = candidate[2];
    //         assert.equal(voteCount, 1, "accepts first vote");
    //         // Try to vote again
    //         return electionInstance.vote(candidateId, { from: accounts[1] });
    //     }).then(assert.fail).catch(function(error) {
    //         console.log('Error:\n', error, '\nNot error.');
    //         assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
    //         return electionInstance.candidates(1);
    //     }).then(function(candidate1) {
    //         var voteCount = candidate1[2];
    //         assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
    //         return electionInstance.candidates(2);    
    //     }).then(function(candidate2) {
    //         var voteCount = candidate2[2];
    //         assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
    //     });
    //   });
    

    // it('does not allow double voting', function() {
    //     return Election.deployed().then(function(instance) {
    //         electionInstance = instance;
    //         candidateId = 1;
    //         // Vote on candidate with the second account.
    //         electionInstance.vote(candidateId, { from : accounts[2] });
    //         console.log('Account voting:', accounts[2]);
    //         // Return candidate to check its data.
    //         return electionInstance.candidates(1);
    //     }).then(function(candidate1) {
    //         // Get candidates' vote count.
    //         let voteCount = candidate1[2];
    //         console.log('Vote count:', voteCount);
    //         // Check if first vote was accepted.
    //         assert.equal(voteCount, 1, 'first vote was accepted');
    //         // Vote again with the same account.
    //         return electionInstance.vote(candidateId, { from : accounts[2] });
    //     }).then(assert.fail).catch(function(error) {
    //         // Check if exception raised was a 'revert' exception.
    //         console.log('Error:\n', error, '\nNot error.');
    //         assert(error.message.indexOf('revert') >= 0, 'error message must contain "revert"');
    //         // Return candidate1 to check its vote count.
    //         return electionInstance.candidates(1);
    //     }).then(function(candidate1) {
    //         // Get the vote count of candidate1
    //         let voteCount = candidate1[2];
    //         console.log('Vote count:', voteCount);
    //         // Check if candidate1 received any votes.
    //         assert.equal(voteCount, 1, 'candidate 1 did not receive any votes');
    //         // Return candidate1 to check its vote count.
    //         return electionInstance.candidates(2);
    //     }).then(function(candidate2) {
    //         // Get the vote count of candidate1
    //         let voteCount = candidate2[2];
    //         // Check if candidate1 received any votes.
    //         assert.equal(voteCount, 1, 'candidate 2 did not receive any votes');
    //     });
    // });
});