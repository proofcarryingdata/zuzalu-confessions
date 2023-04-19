import {
  EthereumOwnershipPCD,
  EthereumOwnershipPCDPackage,
} from "@pcd/ethereum-ownership-pcd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { GroupLabel, LabelContainer } from "./GroupLabel";

export interface Confession {
  id: string;
  createdAt: string;
  updatedAt: string;
  semaphoreGroupUrl: string;
  body: string;
  proof: string;
  proofHash: string;
  ethProof: string;
}

export function SingleConfession({ confession }: { confession: Confession }) {
  const [ethPCD, setEthPCD] = useState<EthereumOwnershipPCD | undefined>();

  useEffect(() => {
    if (confession.ethProof) {
      EthereumOwnershipPCDPackage.deserialize(confession.ethProof)
        .then((pcd) => {
          setEthPCD(pcd);
        })
        .catch((e) => {
          console.log("error deserializing eth pcd");
        });
    }
  }, [confession.ethProof]);

  return (
    <ConfessionContainer>
      <LabelWrap>
        {ethPCD === undefined ? (
          <>
            <GroupLabel groupUrl={confession.semaphoreGroupUrl} /> <br />
          </>
        ) : (
          <LabelContainer>
            <EthereumAddressContainer>
              {ethPCD.claim.ethereumAddress}
            </EthereumAddressContainer>
          </LabelContainer>
        )}
      </LabelWrap>
      {confession.body}
    </ConfessionContainer>
  );
}

const EthereumAddressContainer = styled.div`
  max-width: 100%;
  overflow-wrap: anywhere;
  background-color: #eee;
  padding: 0px 4px;
`;

const LabelWrap = styled.div`
  max-width: 100%;
`;

const ConfessionContainer = styled.div`
  padding: 8px;
  margin: 16px 8px;
  border: 1px solid black;
  border-radius: 0px 8px 8px 8px;
  display: inline-block;
  width: 250px;
  height: 200px;
  position: relative;
`;
