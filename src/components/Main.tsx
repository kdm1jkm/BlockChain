import React, { useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js";
import styled from "styled-components";
import BlockChain from "../scripts/BlockChain";
import Content from "../scripts/Content";

const Header = styled.h1`
  text-align: center;
`;

const OutBox = styled.div`
  display: flex;
  border: 1px solid black;
  margin: 10px auto;
  padding: 10px;
  border-radius: 15px;
  flex-direction: column;
  width: 70vw;
  min-width: 635px;
`;

const InvisibleBox = styled.div`
  display: flex;
`;

const Box = styled.div<{ flexGrow?: number; width?: number }>`
  display: flex;
  border: 1px solid gray;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  flex-grow: ${(p) => (p.flexGrow !== undefined ? p.flexGrow : 1)};
  flex-shrink: 1;
  width: ${(p) => (p.width ? `${p.width}px` : `auto`)};
`;

const Label = styled.p``;

const Input = styled.input<{ flexGrow: number }>`
  display: block;
  margin: 10px;
  border: 1px solid gray;
  border-radius: 5px;
  flex-grow: ${(p) => p.flexGrow};
  flex-shrink: 1;
  width: 35px;
`;

const Button = styled.button<{ width?: number; flexGrow: number }>`
  flex-grow: ${(p) => p.flexGrow};
  margin: 10px;
  padding: 5px;
  width: ${(p) => (p.width === undefined ? `auto` : `${p.width}px`)};
  background-color: white;
  border: 1px solid grey;
  height: 75px;
  border-radius: 10px;
  font-size: large;
  :hover {
    background-color: #eee;
  }
  :active {
    background-color: #ddd;
  }
`;

function useRangedNum(
  initialState: number,
  range?: { min?: number; max?: number }
): [number, React.Dispatch<React.SetStateAction<number>>] {
  const [num, setNum] = useState(initialState);

  useEffect(() => {
    if (!range) return;
    if (range.max !== undefined) setNum(Math.min(range.max, num));
    if (range.min !== undefined) setNum(Math.max(range.min, num));
  }, [num]);

  return [num, setNum];
}

const Main = () => {
  const [prevHash, setPrevHash] = useState("");
  const [content, setContent] = useState("");
  const [nonce, setNonce] = useState(0);
  const [hash, setHash] = useState("");
  const [difficulty, setDifficulty] = useRangedNum(0, { min: 0, max: 64 });

  const blockChain = useRef(new BlockChain(undefined));

  // Update Value in instance
  useEffect(() => {
    const lastBlock = blockChain.current.lastBlock;
    lastBlock.content = new Content(content);
    lastBlock.nonce = nonce;
    blockChain.current.difficulty = difficulty;
    setHash(blockChain.current.lastBlock.hash);
  }, [content, nonce, difficulty]);

  return (
    <>
      <Header>BlockChain Simulator</Header>
      <OutBox>
        <Box>
          <Label>Previous Hash: {prevHash}</Label>
        </Box>
        <InvisibleBox>
          <Box flexGrow={20}>
            <Label>Content: </Label>
            <Input
              type="text"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              flexGrow={1}
            />
          </Box>
          <Box flexGrow={0} width={100}>
            <Label>Nonce: </Label>
            <Input
              type="number"
              value={nonce}
              onChange={(e) => {
                setNonce(parseInt(e.target.value));
              }}
              flexGrow={0}
            />
          </Box>
          <Box flexGrow={0} width={115}>
            <Label>Difficulty: </Label>
            <Input
              type="number"
              value={difficulty}
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
              flexGrow={0}
            />
          </Box>
        </InvisibleBox>
        <Box>
          <Label>Hash: {hash}</Label>
        </Box>
        <InvisibleBox>
          <Button flexGrow={1}>Mine</Button>
          <Button flexGrow={0} width={150}>
            Find Nonce
          </Button>
        </InvisibleBox>
      </OutBox>
    </>
  );
};
export default Main;
