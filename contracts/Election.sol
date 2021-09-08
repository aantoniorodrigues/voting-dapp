// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Election {

    // Model a candidate using a structure type.
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Mapping variable to store all the candidates.
    mapping(uint => Candidate) public candidates;
    // Mapping variable to store the accounts that already voted.
    mapping(address => bool) public voters;

    // Variable to store the number of candidates.
    uint public candidatesCount;

    // Constructor. Runs only once when contract is deployed.
    constructor() public {
        addCandidate('Candidate 1');
        addCandidate('Candidate 2');
    }

    function addCandidate(string memory _name) private {
        // Increase the candidates count whenever a new candidate is included.
        candidatesCount ++;
        // Add a new Candidate object to the candidates mapping.
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        // Get the voter account address.
        address voterAddress = msg.sender;
        // Require that the voter hasn't already voted.
        require(!voters[voterAddress]);
        // Require that the voter votes in a valid candidate.
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        // Any gas spent on calling the function up to this point
        // won't be returned to the user if the conditions fail.
        
        // Set the value in mapping to true, meaning the voter has voted.
        voters[voterAddress] = true;
        // Update the candidates' vote count.
        candidates[_candidateId].voteCount ++;
    }
}