// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <=0.8.4;

contract Temperature {
    
    int32 private currentTemperature;
    address private owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    function setTemp(int32 _temp) external onlyOwner {
        currentTemperature = _temp;
    }
    
    function getTemp() view external returns(int32){
        return currentTemperature;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "user has no access to this function");
        _;
    }
    
}