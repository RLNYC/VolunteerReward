// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./ERC20Token.sol";

contract VolunteerNFT is ERC721URIStorage {  
  ERC20Token private doGoodToken;

  using Counters for Counters.Counter;
  Counters.Counter public nftIds;
  Counters.Counter public leaderboardTotal;
  Counters.Counter public startFrom;

  mapping(uint => VolunteerData) public volunteerDataList;
  mapping(uint => address) public idToAddress;
  mapping(address => uint) public leaderboardHours;

  struct VolunteerData {
    uint id;
    uint hour;
    string charity;
    string url;
    bool isRedeemed;
    address recipient;
  }

  event VolunteerRecorded (
    uint id,
    uint hour,
    string charity,
    string url,
    address recipient
  );

  constructor(ERC20Token _doGoodToken) ERC721("Volunteer To Earn", "VTE") {
     doGoodToken = _doGoodToken;
  }

  function batchMint(address[] memory _recipients, uint[] memory _hours, string memory _charity, string memory _url) public {
    uint len = _recipients.length;
    for (uint i = 0; i < len; i++) {
      mintVolunteerNFT(_hours[i], _charity, _recipients[i], _url);
    }
  }

  function mintVolunteerNFT(uint _hours, string memory _charity, address _recipient, string memory _url) public returns (uint) {
    nftIds.increment();
    uint256 newNFTId = nftIds.current();

    _mint(_recipient, newNFTId);
    _setTokenURI(newNFTId, _url);

    volunteerDataList[newNFTId] = VolunteerData(newNFTId, _hours, _charity, _url, false, _recipient);
    emit VolunteerRecorded(newNFTId, _hours, _charity, _url, _recipient);

    return newNFTId;
  }

  function redeemVolunteerNFT(uint _id) public payable {
    VolunteerData memory _volunteerNFT = volunteerDataList[_id];
    require(_volunteerNFT.recipient == msg.sender, "You do not own this NFT");
    require(_volunteerNFT.isRedeemed == false, "You already redeemed this NFT");

    doGoodToken.mint(msg.sender, _volunteerNFT.hour * 1e18);

    _volunteerNFT.isRedeemed = true;
    volunteerDataList[_id] = _volunteerNFT;
  }

  function fetchUserVolunteerNFTs(address _userAddress) public view returns (VolunteerData[] memory) {
    uint totalNFTCount = nftIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalNFTCount; i++) {
      if (volunteerDataList[i + 1].recipient == _userAddress) {
        itemCount += 1;
      }
    }

    VolunteerData[] memory items = new VolunteerData[](itemCount);

    for (uint i = 0; i < totalNFTCount; i++) {
      if (volunteerDataList[i + 1].recipient == _userAddress) {
        uint currentId = i + 1;
        VolunteerData storage currentNFT = volunteerDataList[currentId];
        items[currentIndex] = currentNFT;
        currentIndex += 1;
      }
    }

    return items;   
  }

  function updateLeaderboard() public {
    uint totalNFTCount = nftIds.current();
    uint start = startFrom.current();

    for (start + 1; start <= totalNFTCount; start++) {
      startFrom.increment();

      VolunteerData memory currentNFT = volunteerDataList[start];
      address _recipient = idToAddress[start];
      
      if(leaderboardHours[_recipient] != 0) {
        leaderboardHours[_recipient] += currentNFT.hour;
      }
      else {
        leaderboardTotal.increment();
        idToAddress[start] = currentNFT.recipient;
        leaderboardHours[currentNFT.recipient] += currentNFT.hour;
      }
    }
  }
}