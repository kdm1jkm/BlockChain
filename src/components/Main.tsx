import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import styled from "styled-components";

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
`;

const InvisibleBox = styled.div`
  display: flex;
`;

const Box = styled.div`
  display: flex;
  border: 1px solid gray;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  flex-grow: 1;
`;

const Label = styled.p``;

const Input = styled.input`
  margin: 10px;
  border: 1px solid gray;
  border-radius: 5px;
  flex-grow: 1;
`;

const Main = () => {
  const [prevHash, setPrevHash] = useState("");
  const [content, setContent] = useState("");
  const [nonce, setNonce] = useState(0);
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(CryptoJS.SHA256(prevHash + content + nonce.toString()).toString());
  });

  return (
    <>
      <Header>BlockChain Simulator</Header>
      <OutBox>
        <Box>
          <Label>Previous Hash: {prevHash}</Label>
        </Box>
        <InvisibleBox>
          <Box>
            <Label>Content: </Label>
            <Input
              type="text"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </Box>
          <Box>
            <Label>Nonce: </Label>
            <Input
              type="number"
              value="0"
              onChange={(e) => {
                setNonce(parseInt(e.target.value));
              }}
            />
          </Box>
        </InvisibleBox>
        <Box>
          <Label>Hash: {hash}</Label>
        </Box>
      </OutBox>
    </>
  );
};
export default Main;
