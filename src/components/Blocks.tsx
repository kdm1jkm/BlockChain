import React from "react";
import styled from "styled-components";
import Block, { IBlock } from "./Block";

export interface IBlocks {
  blocks: Array<IBlock>;
}

export default function Blocks({ blocks }: IBlocks): JSX.Element {
  return (
    <>
      {blocks
        ? blocks.map((block) => <Block key={block.hash} {...block}></Block>)
        : ""}
    </>
  );
}
