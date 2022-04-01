import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Spacer,
  Spinner,
  Text,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { load } from '../src/web3';

const Home: NextPage = () => {
  const [input, setInput] = React.useState<string>('');
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [address, setAddress] = React.useState<any>('');
  const [contract, setContract] = React.useState<any>(null);
  const [tasks, setTasks] = React.useState<any[]>([]);

  const handleMetamaskLogin = async () => {
    const { account, contract, tasks } = await load();
    setAddress(account);
    setContract(contract);
    setTasks(tasks);
    setRefresh(true);
  };

  const handleInput = (e: any) => {
    setInput(e.target.value);
  };

  const handleAdd = async () => {
    await contract.createTask(input, { from: address });
    setInput('');
    setRefresh(true);
  };

  const handleDoneToggle = async (id: number) => {
    await contract.toggleCompleted(id, { from: address });
    setRefresh(true);
  };

  React.useEffect(() => {
    if (!refresh) return;
    setRefresh(false);
    load().then(eth => {
      setTasks(eth.tasks);
    });
  }, [refresh]);

  return (
    <VStack>
      <Head>
        <title>To-do Dapp</title>
        <meta name="description" content="To-do List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!address ? (
        <Center h="100vh">
          <Button bgColor="green.200" onClick={handleMetamaskLogin}>
            Login with
            <Box role="img" aria-label="fox" paddingX="1">
              🦊
            </Box>
            Metamask
          </Button>
        </Center>
      ) : (
        <HStack w="full">
          <Spacer />
          <VStack>
            <Heading>To-do List</Heading>
            <Box h="30px" />
            <HStack w="md">
              <Input
                type="text"
                size="md"
                placeholder="New task"
                value={input}
                onChange={handleInput}
              />
              <Button onClick={handleAdd} bg="green.200">
                Add
              </Button>
            </HStack>
            <Box h="30px" />
            <Text>To-do</Text>
            {tasks ? (
              tasks.map((task: any) =>
                task[2] ? null : (
                  <HStack
                    w="md"
                    bg="gray.100"
                    borderRadius={7}
                    key={task[0].toNumber()}
                  >
                    <Box w="5px" />
                    <Text>{task[1]}</Text>
                    <Box w="15px" />
                    <Spacer />
                    <Button
                      bg="green.300"
                      onClick={() => handleDoneToggle(task[0].toNumber())}
                    >
                      Done
                    </Button>
                  </HStack>
                )
              )
            ) : (
              <Spinner />
            )}
            <Box h="10px" />
            <Text>Finished</Text>
            {!tasks ? (
              <Spinner />
            ) : (
              tasks.map((task: any) =>
                !task[2] ? null : (
                  <HStack
                    w="md"
                    bg="gray.100"
                    borderRadius={7}
                    key={task[0].toNumber()}
                  >
                    <Box w="5px" />
                    <Text>{task[1]}</Text>
                    <Box w="15px" />
                    <Spacer />
                    <Button
                      bg="red.300"
                      onClick={() => handleDoneToggle(task[0].toNumber())}
                    >
                      Undo
                    </Button>
                  </HStack>
                )
              )
            )}
          </VStack>
          <Spacer />
        </HStack>
      )}
    </VStack>
  );
};

export default Home;
