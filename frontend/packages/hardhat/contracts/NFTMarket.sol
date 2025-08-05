//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Address for address payable;

    uint256 private _tokenIds;
    uint256 private _itemsSold;
    uint256 public listPrice = 0.01 ether;
    uint256[] private listedTokenIds;

    struct ListedToken {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    event TokenListedSuccess(uint256 indexed tokenId, address seller, uint256 price, bool currentlyListed);

    event TokenSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);

    event TokenUnlisted(uint256 indexed tokenId, address seller);

    mapping(uint256 => ListedToken) private idToListedToken;

    constructor() Ownable(msg.sender) ERC721("NFTMarketplace", "NFTM") {}

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function updateListPrice(uint256 _listPrice) public onlyOwner {
        require(_listPrice > 0, "List price must be positive");
        listPrice = _listPrice;
    }

    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 latestTokenId = listedTokenIds.length > 0 ? listedTokenIds[listedTokenIds.length - 1] : 0;
        return idToListedToken[latestTokenId];
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds;
    }

    function createToken(string memory tokenURI, uint256 price) public payable nonReentrant returns (uint256) {
        require(msg.value == listPrice, "Must send exact listing price");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        require(price > 0, "Price must be positive");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        createListedToken(newTokenId, price);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId, uint256 price) private {
        idToListedToken[tokenId] = ListedToken(tokenId, payable(msg.sender), price, true);

        listedTokenIds.push(tokenId);

        _transfer(msg.sender, address(this), tokenId);

        emit TokenListedSuccess(tokenId, msg.sender, price, true);
    }

    function unListToken(uint256 tokenId) public nonReentrant {
        require(idToListedToken[tokenId].seller == msg.sender, "Only seller can unlist");
        require(idToListedToken[tokenId].currentlyListed, "Token not listed");

        idToListedToken[tokenId].currentlyListed = false;

        for (uint256 i = 0; i < listedTokenIds.length; i++) {
            if (listedTokenIds[i] == tokenId) {
                listedTokenIds[i] = listedTokenIds[listedTokenIds.length - 1];
                listedTokenIds.pop();
                break;
            }
        }

        _transfer(address(this), msg.sender, tokenId);

        emit TokenUnlisted(tokenId, msg.sender);
    }

    function getAllNFTs() public view returns (ListedToken[] memory) {
        ListedToken[] memory tokens = new ListedToken[](listedTokenIds.length);
        for (uint256 i = 0; i < listedTokenIds.length; i++) {
            tokens[i] = idToListedToken[listedTokenIds[i]];
        }
        return tokens;
    }

    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint256 itemCount = 0;
        for (uint256 i = 0; i < listedTokenIds.length; i++) {
            uint256 tokenId = listedTokenIds[i];
            if (idToListedToken[tokenId].seller == msg.sender || ownerOf(tokenId) == msg.sender) {
                itemCount++;
            }
        }

        ListedToken[] memory items = new ListedToken[](itemCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < listedTokenIds.length; i++) {
            uint256 tokenId = listedTokenIds[i];
            if (idToListedToken[tokenId].seller == msg.sender || ownerOf(tokenId) == msg.sender) {
                items[currentIndex] = idToListedToken[tokenId];
                currentIndex++;
            }
        }
        return items;
    }

    function executeSale(uint256 tokenId) public payable nonReentrant {
        ListedToken memory listedToken = idToListedToken[tokenId];
        require(listedToken.currentlyListed, "Token not listed");
        require(msg.value == listedToken.price, "Please submit the asking price");

        idToListedToken[tokenId].currentlyListed = false;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold++;

        for (uint256 i = 0; i < listedTokenIds.length; i++) {
            if (listedTokenIds[i] == tokenId) {
                listedTokenIds[i] = listedTokenIds[listedTokenIds.length - 1];
                listedTokenIds.pop();
                break;
            }
        }

        _transfer(address(this), msg.sender, tokenId);

        payable(owner()).sendValue(listPrice);
        payable(listedToken.seller).sendValue(msg.value);

        emit TokenSold(tokenId, msg.sender, listedToken.seller, listedToken.price);
    }

    function withdraw() public onlyOwner nonReentrant {
        payable(owner()).sendValue(address(this).balance);
    }
}
