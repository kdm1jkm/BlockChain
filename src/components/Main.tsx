import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import BlockChain from "../scripts/BlockChain";
import Content from "../scripts/Content";
import { IBlock } from "./Block";
import Blocks from "./Blocks";

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

const OutBoxRow = styled(OutBox)`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const InvisibleBox = styled.div`
  display: flex;
`;

export const Box = styled.div<{
  flexGrow?: number;
  width?: [number, "px" | "%"];
  column?: boolean;
  includeMargin?: boolean;
  multiline?: boolean;
  cutOverflow?: boolean;
}>`
  display: flex;
  border: 1px solid gray;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  flex-grow: ${(p) => (p.flexGrow !== undefined ? p.flexGrow : 1)};
  flex-shrink: 1;
  flex-direction: ${(p) => (p.column ? "column" : "row")};
  width: ${(p) => (p.width ? `${p.width[0]}${p.width[1]}` : "auto")};
  box-sizing: ${(p) => (p.includeMargin ? "border-box" : "content-box")};
  flex-wrap: ${(p) => (p.multiline ? "wrap" : "nowrap")};
  ${(p) => (p.cutOverflow ? "overflow: clip;" : "")}
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
    if (range.max !== undefined && range.max < num) setNum(range.max);
    else if (range.min !== undefined && range.min > num) setNum(range.min);
  }, [num]);

  return [num, setNum];
}

function useToggleBoolean(
  initialValue: boolean
): [boolean, () => void, (boolean) => void] {
  const [value, setValue] = useState(initialValue);

  return [
    value,
    () => {
      setValue(!value);
    },
    (v) => {
      setValue(v);
    },
  ];
}

// From https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function Main() {
  const blockChain = useRef(new BlockChain(undefined));

  const [prevHash, setPrevHash] = useState("");
  const [content, setContent] = useState(
    blockChain.current.lastBlock.content.data
  );
  const [nonce, setNonce] = useState(0);
  const [hash, setHash] = useState("");
  const [difficulty, setDifficulty] = useRangedNum(3, { min: 0, max: 64 });
  const [isValidBlock, setValidBlock] = useState(true);
  const [blocks, setBlocks] = useState<IBlock[]>();

  const [isLookingForNonce, toggleLookingForNonce, setLookingForNonce] =
    useToggleBoolean(false);

  const [delay, setDelay] = useState<number | null>(null);
  useInterval(() => {
    if (!blockChain.current.checkLastHashValid()) {
      setNonce(nonce + 1);
    } else {
      setLookingForNonce(false);
    }
  }, delay);

  useEffect(() => {
    blockChain.current.lastBlock.content = new Content(content);
  }, [content]);

  useEffect(() => {
    blockChain.current.lastBlock.nonce = nonce;
  }, [nonce]);

  useEffect(() => {
    blockChain.current.difficulty = difficulty;
  }, [difficulty]);

  useEffect(() => {
    setHash(blockChain.current.lastBlock.hash);
  }, [prevHash, content, nonce]);

  useEffect(() => {
    setValidBlock(blockChain.current.checkLastHashValid());
  }, [hash, difficulty]);

  useEffect(() => {
    setDelay(isLookingForNonce === true ? 0 : null);
  }, [isLookingForNonce]);

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
          <Box flexGrow={0} width={[150, "px"]}>
            <Label>Nonce: </Label>
            <Input
              type="number"
              value={nonce}
              min={0}
              max={64}
              onChange={(e) => {
                setNonce(parseInt(e.target.value));
              }}
              flexGrow={1}
            />
          </Box>
          <Box flexGrow={0} width={[115, "px"]}>
            <Label>Difficulty: </Label>
            <Input
              type="number"
              value={difficulty}
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
              flexGrow={1}
            />
          </Box>
        </InvisibleBox>
        <Box>
          <Label>Hash: {hash}</Label>
        </Box>
        <InvisibleBox>
          <Button
            flexGrow={1}
            disabled={!isValidBlock}
            onClick={(e) => {
              if (!isValidBlock) return;

              blockChain.current.addBlock();
              setPrevHash(hash);
              setContent(blockChain.current.lastBlock.content.data);
              setNonce(0);

              const b: IBlock[] = [];
              blockChain.current.blocks.slice(0, -1).forEach((block) => {
                b.push({
                  content: block.content.data,
                  hash: block.hash,
                  nonce: block.nonce,
                  prevHash: block.prevHash,
                });
              });
              setBlocks(b);
            }}
          >
            Mine
          </Button>
          <Button
            flexGrow={0}
            width={150}
            onClick={() => {
              toggleLookingForNonce();
              if (isValidBlock) setLookingForNonce(false);
            }}
          >
            {isLookingForNonce ? "Stop Finding" : "Find Nonce"}
          </Button>
        </InvisibleBox>
      </OutBox>
      {blocks ? (
        <OutBoxRow>
          <Blocks blocks={blocks} />
        </OutBoxRow>
      ) : (
        ""
      )}
    </>
  );
}
