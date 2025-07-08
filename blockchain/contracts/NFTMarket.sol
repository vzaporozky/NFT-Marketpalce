// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract NFTMarketplace is ERC721URIStorage, Ownable {
	uint256 private _tokenIdCounter;

	struct Listing {
		uint256 price;
		address seller;
		bool active;
	}

	mapping(uint256 => Listing) public listings;
	uint256 public marketplaceFee;

	event NFTMinted(
		uint256 indexed tokenId,
		address indexed creator,
		string tokenURI
	);
	event NFTListed(
		uint256 indexed tokenId,
		uint256 price,
		address indexed seller
	);
	event NFTSold(
		uint256 indexed tokenId,
		uint256 price,
		address indexed buyer,
		address indexed seller
	);
	event NFTCancelled(uint256 indexed tokenId, address indexed seller);

	constructor(
		string memory name,
		string memory symbol,
		uint256 _marketplaceFee
	) ERC721(name, symbol) Ownable(msg.sender) {
		marketplaceFee = _marketplaceFee;
		_tokenIdCounter = 0;
	}

	function mintNFT(string memory tokenURI) public returns (uint256) {
		_tokenIdCounter++;
		uint256 newTokenId = _tokenIdCounter;

		_safeMint(msg.sender, newTokenId);
		_setTokenURI(newTokenId, tokenURI);

		emit NFTMinted(newTokenId, msg.sender, tokenURI);
		return newTokenId;
	}

	function listNFT(uint256 tokenId, uint256 price) public {
		require(ownerOf(tokenId) == msg.sender, 'Not the owner');
		require(price > 0, 'Price must be greater than 0');
		require(!listings[tokenId].active, 'NFT already listed');

		_transfer(msg.sender, address(this), tokenId);

		listings[tokenId] = Listing({
			price: price,
			seller: msg.sender,
			active: true
		});

		emit NFTListed(tokenId, price, msg.sender);
	}

	function buyNFT(uint256 tokenId) public payable {
		Listing memory listing = listings[tokenId];
		require(listing.active, 'NFT not listed for sale');
		require(msg.value >= listing.price, 'Insufficient payment');

		uint256 fee = (listing.price * marketplaceFee) / 1000;
		uint256 sellerProceeds = listing.price - fee;

		listings[tokenId].active = false;

		payable(listing.seller).transfer(sellerProceeds);
		_transfer(address(this), msg.sender, tokenId);

		emit NFTSold(tokenId, listing.price, msg.sender, listing.seller);
	}

	function cancelListing(uint256 tokenId) public {
		Listing memory listing = listings[tokenId];
		require(listing.active, 'NFT not listed');
		require(listing.seller == msg.sender, 'Not the seller');

		listings[tokenId].active = false;
		_transfer(address(this), msg.sender, tokenId);

		emit NFTCancelled(tokenId, msg.sender);
	}

	function setMarketplaceFee(uint256 _newFee) public onlyOwner {
		require(_newFee <= 1000, 'Fee cannot exceed 100%');
		marketplaceFee = _newFee;
	}

	function withdrawFees() public onlyOwner {
		uint256 balance = address(this).balance;
		require(balance > 0, 'No fees to withdraw');
		payable(owner()).transfer(balance);
	}
}
