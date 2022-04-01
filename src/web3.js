import Web3 from 'web3';
import truffleContract from '@truffle/contract';
import TodoList from '../build/contracts/TodoList.json';

const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
    } catch (err) {
      console.error(err);
    }
  } else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('Install Metamask in order to use the app');
  }
};

const loadAccount = async () => {
  const account = await web3.eth.getCoinbase();
  return account;
};

const loadTasks = async (contract, account) => {
  const tasksCount = await contract.tasksCount(account);
  const tasks = [];

  for (let i = 0; i < tasksCount; i++) {
    const task = await contract.tasks(account, i);
    tasks.push(task);
  }

  return tasks;
};

const loadContract = async account => {
  const todoContract = truffleContract(TodoList);
  todoContract.setProvider(web3.eth.currentProvider);

  const contract = await todoContract.deployed();
  const tasks = await loadTasks(contract, account);

  return {
    contract,
    tasks,
  };
};

export const load = async () => {
  await loadWeb3();
  const account = await loadAccount();
  const { contract, tasks } = await loadContract(account);

  return {
    account,
    contract,
    tasks,
  };
};
