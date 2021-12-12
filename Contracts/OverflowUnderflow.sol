// SPDX-License-Identifier: MIT
pragma solidity <0.8.0;

contract OverflowUnderflow {
    // Variable Declaration
    uint8 over = 255;
    uint8 under = 0; 

    // Overflow Test

    function overflowTest1() public view returns(uint8) {
        return over; //returns 255
    }

    function overflowTest2() public view returns(uint8) {
        return over + 1; //returns 0 
    }

    // Underflow Test

    function underflowTest1() public view returns(uint8) {
        return under; //returns 0
    }

    function underflowTest2() public view returns(uint8) {
        return under - 1; //returns 255 
    }

    // To avoid this we were using SafeMath library from OpenZepplin
    // From version 0.8.0 Solidity has inbuilt system to throw error on 
    // Overflow and Underflow scenarios. We no longer need SafeMath Library
    // to use uint and int variables safely.
    // In rare scenarios where you would want uint and int variables to overflow/underflow
    // and not throw errow "checked" keyword is used.  
}
