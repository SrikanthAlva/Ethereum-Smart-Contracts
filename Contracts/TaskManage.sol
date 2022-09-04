// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "openzeppelin/contracts/access/Ownable.sol";

contract StructDemo is Ownable {

    enum TaskStatus {Pending, Running, Completed}

    struct Task {
        address assignee;
        TaskStatus status;
        string taskDesc;
    }

    Task[] private _taskList; 

    modifier checkIndexRange(uint taskIndex) {
        require(taskIndex < _taskList.length, "Task Index out of range");
        _;
    }

    function createTask(address _assignee, string memory _taskDesc) public payable {
        require(msg.value >= 0.1 ether, "Insufficent Funds!!!");
        _taskList.push(Task({assignee: _assignee, taskDesc: _taskDesc, status: TaskStatus.Pending}));
    }

    function startTask(uint _taskIndex) public checkIndexRange(_taskIndex) {
        _taskList[_taskIndex].status = TaskStatus.Running;
    }

    function completeTask(uint _taskIndex) public checkIndexRange(_taskIndex) {
        _taskList[_taskIndex].status = TaskStatus.Completed;
    }

    function getTaskStatus(uint _taskIndex) public view checkIndexRange(_taskIndex) returns (TaskStatus) {
        return _taskList[_taskIndex].status;
    }

    function getTaskAssignee(uint _taskIndex) public view checkIndexRange(_taskIndex) returns (address) {
        return _taskList[_taskIndex].assignee;
    }

    function withdraw() public onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

}
