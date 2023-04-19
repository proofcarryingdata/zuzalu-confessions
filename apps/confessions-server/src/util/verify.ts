import {
  SemaphoreGroupPCDPackage,
  SerializedSemaphoreGroup,
} from "@pcd/semaphore-group-pcd";
import {
  generateMessageHash,
  SemaphoreSignaturePCDPackage,
} from "@pcd/semaphore-signature-pcd";
import { Group } from "@semaphore-protocol/group";
import { ALLOWED_GROUPS, isAllowedGroup } from "./auth";

export async function verifyEthProof(ethProof: string): Promise<boolean> {
  try {
    const deserialized = await SemaphoreSignaturePCDPackage.deserialize(
      ethProof
    );
    console.log(deserialized);
    const verified = await SemaphoreSignaturePCDPackage.verify(deserialized);
    return verified;
  } catch (e) {
    console.log(e);
    console.log("failed to verify");
  }
  return false;
}

export async function verifyGroupProof(
  semaphoreGroupUrl: string,
  proof: string,
  signal?: string
): Promise<Error | null> {
  // only allow Zuzalu group for now
  if (!isAllowedGroup(semaphoreGroupUrl)) {
    return new Error(
      `only Zuzalu groups are allowed. expected one of ${ALLOWED_GROUPS} actual: ${semaphoreGroupUrl}`
    );
  }

  const pcd = await SemaphoreGroupPCDPackage.deserialize(proof);

  const verified = await SemaphoreGroupPCDPackage.verify(pcd);
  if (!verified) {
    return new Error("invalid proof");
  }

  // check semaphoreGroupURL matches the claim
  const response = await fetch(semaphoreGroupUrl);
  const json = await response.text();
  const serializedGroup = JSON.parse(json) as SerializedSemaphoreGroup;
  const group = new Group(serializedGroup.id, 16);

  group.addMembers(serializedGroup.members);
  if (pcd.claim.merkleRoot !== group.root.toString()) {
    return new Error(
      "semaphoreGroupUrl doesn't match claim group merkletree root"
    );
  }

  if (signal && pcd.claim.signal !== generateMessageHash(signal).toString()) {
    throw new Error("signal doesn't match claim");
  }

  return null;
}
