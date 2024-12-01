// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CredentialContract is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    // Mapping from token ID to issuer address
    mapping(uint256 => address) public credentialIssuers;
    
    // Mapping from token ID to verification status
    mapping(uint256 => bool) public isVerified;
    
    // Events
    event CredentialIssued(uint256 indexed tokenId, address indexed issuer, string credentialType);
    event CredentialVerified(uint256 indexed tokenId, address indexed verifier);
    event CredentialRevoked(uint256 indexed tokenId, address indexed issuer);

    constructor() ERC721("VerifiableCredential", "VC") Ownable(msg.sender) {}

    function issueCredential(
        address to,
        string memory uri,
        string memory credentialType
    ) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        credentialIssuers[tokenId] = msg.sender;
        isVerified[tokenId] = false;
        
        emit CredentialIssued(tokenId, msg.sender, credentialType);
        return tokenId;
    }

    function verifyCredential(uint256 tokenId) public {
        require(_exists(tokenId), "Credential does not exist");
        require(!isVerified[tokenId], "Credential already verified");
        require(msg.sender != credentialIssuers[tokenId], "Issuer cannot verify their own credential");
        
        isVerified[tokenId] = true;
        emit CredentialVerified(tokenId, msg.sender);
    }

    function revokeCredential(uint256 tokenId) public {
        require(_exists(tokenId), "Credential does not exist");
        require(msg.sender == credentialIssuers[tokenId], "Only issuer can revoke");
        
        _burn(tokenId);
        emit CredentialRevoked(tokenId, msg.sender);
    }

    function getCredentialIssuer(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Credential does not exist");
        return credentialIssuers[tokenId];
    }

    function getVerificationStatus(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Credential does not exist");
        return isVerified[tokenId];
    }

    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage)
        returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage)
        returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
