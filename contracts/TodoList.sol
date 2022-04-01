// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    string public name = "brrianalexis";

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    event TaskCreated(uint256 id, string content, bool completed);

    event TaskCompleted(uint256 id, bool completed);

    mapping(address => mapping(uint256 => Task)) public tasks;
    mapping(address => uint256) public tasksCount;

    constructor() {
        createTask("Test task");
    }

    function createTask(string memory _content) public {
        uint256 taskCount = tasksCount[msg.sender];
        tasks[msg.sender][taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
        tasksCount[msg.sender]++;
    }

    function toggleCompleted(uint256 _id) public {
        Task memory task = tasks[msg.sender][_id];
        task.completed = !task.completed;
        tasks[msg.sender][_id] = task;
        emit TaskCompleted(_id, task.completed);
    }
}
