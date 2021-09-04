// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Election {

    // Model a candidate using a structure type.
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store candidates using a mapping.
    mapping(uint => Candidate) public candidates;

    // Variable to store the number of candidates.
    uint public candidatesCount;

    // Constructor.
    constructor() public {
        addCandidate('Candidate 1');
        addCandidate('Candidate 2');
    }

    function addCandidate(string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
}