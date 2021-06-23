import React from "react";
import { Box, InvisibleBox } from "./Main";

export interface IBlock {
  prevHash: string;
  content: string;
  nonce: number;
  hash: string;
}

export default function Block({
  prevHash,
  content,
  nonce,
  hash,
}: IBlock): JSX.Element {
  return (
    <Box column width={[40, "%"]} includeMargin>
      <Box cutOverflow>prevHash: {prevHash ? prevHash : "NONE"}</Box>
      <InvisibleBox>
        <Box flexGrow={1}>content: {content}</Box>
        <Box flexGrow={0}>nonce: {nonce}</Box>
      </InvisibleBox>
      <Box cutOverflow>hash: {hash}</Box>
    </Box>
  );
}
