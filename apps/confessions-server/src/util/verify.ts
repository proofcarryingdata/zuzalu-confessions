import {
  SemaphoreGroupPCDPackage,
  SerializedSemaphoreGroup,
} from "@pcd/semaphore-group-pcd";
import { generateMessageHash } from "@pcd/semaphore-signature-pcd";
import { Group } from "@semaphore-protocol/group";
import { SEMAPHORE_GROUP_URL } from "./auth";

export async function verifyGroupProof(
  semaphoreGroupUrl: string,
  proof: string,
  signal?: string
): Promise<Error | null> {
  // only allow Zuzalu group for now
  if (semaphoreGroupUrl !== SEMAPHORE_GROUP_URL) {
    return new Error(
      `only Zuzalu group is allowed. expected ${SEMAPHORE_GROUP_URL} actual: ${semaphoreGroupUrl}`
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
  const group = new Group(1, 16);
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
