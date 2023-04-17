import styled from "styled-components";
import { GroupLabel } from "./GroupLabel";

export interface Confession {
  id: string;
  createdAt: string;
  updatedAt: string;
  semaphoreGroupUrl: string;
  body: string;
  proof: string;
  proofHash: string;
}

export function SingleConfession({ confession }: { confession: Confession }) {
  return (
    <ConfessionContainer>
      <LabelContainer>
        <GroupLabel groupUrl={confession.semaphoreGroupUrl} /> <br />{" "}
      </LabelContainer>
      {confession.body}
    </ConfessionContainer>
  );
}

const LabelContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: -1px;
`;

const ConfessionContainer = styled.div`
  padding: 8px;
  margin: 16px 8px;
  border: 1px solid black;
  border-radius: 0px 8px 8px 8px;
  display: inline-block;
  width: 200px;
  height: 150px;
  position: relative;
`;
