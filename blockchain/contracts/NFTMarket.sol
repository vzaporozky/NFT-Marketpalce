// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarket is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => uint256) public tokenPrices;
    mapping(uint256 => string) public tokenURIs;

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string tokenURI
    );
    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTSold(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );

    constructor() ERC721("MyNFT", "NFT") {}

    // Минтинг NFT
    function mintNFT(string memory tokenURI) external returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        tokenURIs[newTokenId] = tokenURI;
        emit NFTMinted(newTokenId, msg.sender, tokenURI);
        return newTokenId;
    }

    // Выставить NFT на продажу
    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than zero");
        tokenPrices[tokenId] = price;
        emit NFTListed(tokenId, price);
    }

    // Покупка NFT
    function buyNFT(uint256 tokenId) external payable {
        uint256 price = tokenPrices[tokenId];
        require(price > 0, "NFT not for sale");
        require(msg.value >= price, "Insufficient funds");
        address seller = ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);
        tokenPrices[tokenId] = 0; // Снимаем с продажи
        payable(seller).transfer(price);
        emit NFTSold(tokenId, msg.sender, price);
    }

    // Получение URI токена
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return tokenURIs[tokenId];
    }
}
