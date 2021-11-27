// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.9.0;

contract StructDemo {

    enum TaskStatus {Pending, Running, Completed}

    struct Task {
        address assignee;
        TaskStatus status;
        string taskDesc;
    }     
    Task[] private _taskList;

    address owner;

    constructor(){
        owner = msg.sender;
    }

    modifier checkAmount(){
        require( msg.value >= 0.1 ether, "insufficent money");
        _;
    }

    modifier onlyOwner(){
        require( msg.sender == owner, "Access Denied");
        _;
    }

    function createTask(address _assignee, string memory _taskDesc) payable public checkAmount() {
        _taskList.push(Task({assignee: _assignee, taskDesc: _taskDesc, status: TaskStatus.Pending}));
    }

    function withdrawbalance() external onlyOwner(){
        payable(owner).transfer(address(this).balance);
    }

}
