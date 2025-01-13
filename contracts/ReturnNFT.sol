// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ReturnNFT is ERC721, ERC721URIStorage {
    uint256 private _tokenIdCount;

    constructor() ERC721("Return", "RTN") {}

    function mintNFT(address to) public {
        _safeMint(to, _tokenIdCount);
        _setTokenURI(
            _tokenIdCount,
            "https://gateway.pinata.cloud/ipfs/QmVAXbMhgsqRW1pkLeVY4bPewA5BcJN7KPtJhATt22gp8f"
        );
        _tokenIdCount++;
    }

    // following functions are override functions required

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
