// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgriSupplyChain {
    address public owner;

    enum CropStatus {
        Uploaded,
        Approved,
        Sold
    }

    struct CropDetails {
        string name;
        string cropType;
        uint256 quantity; // in kilograms
        uint256 price; // per kg in wei
        string harvestDate;
        string fertilizerUsed;
        string pesticideUsed;
        string qualityGrade; // e.g., A, B, C
        string imageHash; // IPFS hash or similar
        string geoLocation; // e.g., "Lat:28.61, Long:77.20"
    }

    struct Crop {
        uint256 id;
        address farmer;
        CropDetails details;
        CropStatus status;
        address buyer;
    }

    uint256 public cropCount;
    mapping(uint256 => Crop) public crops;
    mapping(address => bool) public inspectors;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyInspector() {
        require(inspectors[msg.sender], "Not inspector");
        _;
    }
 
    constructor() {
        owner = msg.sender;
    }

    function addInspector(address _inspector) external onlyOwner {
        inspectors[_inspector] = true;
    }

    function uploadCrop(
        string memory _name,
        string memory _cropType,
        uint256 _quantity,
        uint256 _price,
        string memory _harvestDate,
        string memory _fertilizerUsed,
        string memory _pesticideUsed,
        string memory _qualityGrade,
        
        string memory _imageHash,
        string memory _geoLocation
    ) external {
        CropDetails memory details = CropDetails(
            _name,
            _cropType,
            _quantity,
            _price,
            _harvestDate,
            _fertilizerUsed,
            _pesticideUsed,
            _qualityGrade,
            _imageHash,
            _geoLocation
        );

        crops[cropCount] =
            Crop({id: cropCount, farmer: msg.sender, details: details, status: CropStatus.Uploaded, buyer: address(0)});

        cropCount++;
    }

    function approveCrop(uint256 _id) external onlyInspector {
        require(crops[_id].status == CropStatus.Uploaded, "Invalid crop status");
        crops[_id].status = CropStatus.Approved;
    }

    function buyCrop(uint256 _id) external payable {
        Crop storage crop = crops[_id];
        require(crop.status == CropStatus.Approved, "Not for sale");
        require(msg.value == crop.details.price * crop.details.quantity, "Incorrect payment");

        crop.status = CropStatus.Sold;
        crop.buyer = msg.sender;
        payable(crop.farmer).transfer(msg.value);
    }
}