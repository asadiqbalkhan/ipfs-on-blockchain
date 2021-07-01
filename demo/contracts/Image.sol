// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Image {
    string imageHash;

    //Write Function
    function setImageHash(string memory _imageHash) public {
        imageHash = _imageHash;
    }

    //Read Function
    function getImageHash() public view returns (string memory){
        return imageHash;
    }

}