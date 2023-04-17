export interface Confession {
  id: string;
  createdAt: string;
  updatedAt: string;
  sempahoreGroupUrl: string;
  body: string;
  proof: string;
  proofHash: string;
}

export function SingleConfession({ confession }: { confession: Confession }) {
  return <div>{confession.body}</div>;
}
