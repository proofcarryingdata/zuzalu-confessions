import { useEffect, useState } from "react";
import styled from "styled-components";
import { listConfessions } from "../src/api";
import { Confession, SingleConfession } from "./Confession";

/**
 * Shows the user with access token a list of confessions.
 * @param accessToken jwt used to authenticate to the server
 * @param newConfession the new confession string
 */
export function Confessions({
  accessToken,
  newConfession,
}: {
  accessToken: string | null;
  newConfession: string | undefined;
}) {
  const [confessions, setConfessions] = useState<any>(null);

  useEffect(() => {
    if (!accessToken) {
      setConfessions(null);
      return;
    }

    (async () => {
      // TODO: paging
      const conf = await listConfessions(accessToken, 1, 30);
      setConfessions(conf);
    })();
  }, [accessToken, newConfession]);

  return (
    <>
      <h2 style={{ marginBottom: "32px" }}>Confessions</h2>

      <ConfessionsContainer>
        {confessions != null &&
          confessions.confessions.map((confession: Confession) => (
            <SingleConfession key={confession.id} confession={confession} />
          ))}
      </ConfessionsContainer>
    </>
  );
}

const ConfessionsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`;
