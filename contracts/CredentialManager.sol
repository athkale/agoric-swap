// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CredentialManager is Ownable {
    struct Credential {
        string issuer;
        string holder;
        string schema;
        string data;
        bool isValid;
        uint256 timestamp;
    }

    mapping(bytes32 => Credential) public credentials;
    mapping(address => bool) public issuers;

    event CredentialIssued(
        bytes32 indexed id,
        string issuer,
        string holder,
        uint256 timestamp
    );
    event CredentialRevoked(bytes32 indexed id, uint256 timestamp);
    event IssuerAdded(address indexed issuer);
    event IssuerRemoved(address indexed issuer);

    constructor() Ownable(msg.sender) {
        // Add deployer as initial issuer
        issuers[msg.sender] = true;
        emit IssuerAdded(msg.sender);
    }

    modifier onlyIssuer() {
        require(issuers[msg.sender], "Not authorized to issue credentials");
        _;
    }

    function addIssuer(address issuer) external onlyOwner {
        require(!issuers[issuer], "Already an issuer");
        issuers[issuer] = true;
        emit IssuerAdded(issuer);
    }

    function removeIssuer(address issuer) external onlyOwner {
        require(issuers[issuer], "Not an issuer");
        require(issuer != owner(), "Cannot remove owner as issuer");
        issuers[issuer] = false;
        emit IssuerRemoved(issuer);
    }

    function issueCredential(
        string memory issuer,
        string memory holder,
        string memory schema,
        string memory data
    ) external onlyIssuer returns (bytes32) {
        bytes32 id = keccak256(
            abi.encodePacked(issuer, holder, schema, data, block.timestamp)
        );

        require(credentials[id].timestamp == 0, "Credential ID already exists");

        credentials[id] = Credential({
            issuer: issuer,
            holder: holder,
            schema: schema,
            data: data,
            isValid: true,
            timestamp: block.timestamp
        });

        emit CredentialIssued(id, issuer, holder, block.timestamp);
        return id;
    }

    function revokeCredential(bytes32 id) external onlyIssuer {
        require(credentials[id].timestamp != 0, "Credential does not exist");
        require(credentials[id].isValid, "Credential already revoked");

        credentials[id].isValid = false;
        emit CredentialRevoked(id, block.timestamp);
    }

    function verifyCredential(bytes32 id)
        external
        view
        returns (
            bool isValid,
            string memory issuer,
            string memory holder,
            string memory schema,
            string memory data,
            uint256 timestamp
        )
    {
        require(credentials[id].timestamp != 0, "Credential does not exist");

        Credential memory credential = credentials[id];
        return (
            credential.isValid,
            credential.issuer,
            credential.holder,
            credential.schema,
            credential.data,
            credential.timestamp
        );
    }

    function isIssuer(address account) external view returns (bool) {
        return issuers[account];
    }
}
