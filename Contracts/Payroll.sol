pragma solidity 0.8.4;

contract Payroll {
    
    event EmployeeAddedToPayroll(uint id, address addr);
    
    event EmployeeShareTransferred(address empAddr, uint amount);
    
    address payable[] employees;
    uint empCount;
    address employer;
    
    constructor() {
        employer = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == employer, "Access Denied for this function");
        _;
    }
    
    function addEmpToPyrll(address _empAddr) external onlyOwner {
        employees.push(payable(_empAddr));
        empCount++;
        emit EmployeeAddedToPayroll(empCount - 1, _empAddr);
    }
    
    function empsInPyrll() public view returns (address[] memory){
        address[] memory empList = new address[](empCount);
        for(uint i=0; i<empCount; i++) {
            empList[i] = employees[i];
        }
        return empList;
    }
    
    function addFunds() payable external onlyOwner {}
    
    function showFundsAvailable() external view returns(uint){
        return address(this).balance;
    }
    
    
    function disburseFunds() external onlyOwner {
        uint empShare = address(this).balance/empCount;
        
        for(uint i=0; i<empCount;i++){
            employees[i].transfer(empShare);
            emit EmployeeShareTransferred(employees[i], empShare);
        }
    }
}
