import {
  openZuzaluMembershipPopup,
  usePassportPopupMessages,
  useSemaphoreGroupProof,
} from "@pcd/passport-interface";
import { generateMessageHash } from "@pcd/semaphore-group-pcd";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { postConfession } from "../src/api";
import { PASSPORT_URL, SEMAPHORE_GROUP_URL } from "../src/util";
import { ConfessionsError, ErrorOverlay } from "./shared/ErrorOverlay";

enum CreateState {
  DEFAULT,
  REQUESTING,
  RECEIVED,
}

/**
 * The use input a new confession, generate a semaphore proof for the confession.
 * Post the semaphore group url, confession and the proof to the /new-confession
 * endpoint on the server.
 * Because the proof already claims that the user belongs to the specified semaphore grorup,
 * jwt is not needed in this case.
 * @param onPublished a callback function which will be called after the new confession is
 * published to the server.
 */
export function PublishConfession({
  onPublished,
}: {
  onPublished: (newConfession: string) => void;
}) {
  const createState = useRef(CreateState.DEFAULT);
  const [error, setError] = useState<ConfessionsError>();
  const [confessionInput, setConfessionInput] = useState<string>("");
  const [confession, setConfession] = useState<string>("");

  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();

  const onVerified = useCallback(
    (valid: boolean) => {
      if (createState.current !== CreateState.RECEIVED) return;

      createState.current = CreateState.DEFAULT;

      if (proofError) {
        console.error("error using semaphore passport proof: ", proofError);
        const err = {
          title: "Publish confession failed",
          message: "There's an error in generating proof.",
        } as ConfessionsError;
        setError(err);
        return;
      }

      if (!valid) {
        const err = {
          title: "Publish confession failed",
          message: "Proof is invalid.",
        } as ConfessionsError;
        setError(err);
        return;
      }

      const sendConfession = async () => {
        const res = await postConfession(
          SEMAPHORE_GROUP_URL,
          confession,
          pcdStr
        );
        if (!res.ok) {
          const resErr = await res.text();
          console.error("error posting confession to the server: ", resErr);
          const err = {
            title: "Publish confession failed",
            message: "Fail to connect to the server, please try again later.",
          } as ConfessionsError;
          setError(err);
          return;
        }
        onPublished(confession);
      };

      sendConfession().then(() => {
        setConfessionInput("");
      });
    },
    [pcdStr]
  );

  const { proof, error: proofError } = useSemaphoreGroupProof(
    pcdStr,
    SEMAPHORE_GROUP_URL,
    "zuzalu-confessions",
    onVerified
  );

  useEffect(() => {
    if (createState.current == CreateState.REQUESTING && proof !== undefined) {
      createState.current = CreateState.RECEIVED;
    }
  }, [proof]);

  return (
    <>
      <h2>Publish confession</h2>
      <BigInput
        placeholder="Confession"
        type="text"
        value={confessionInput}
        onChange={(e) => setConfessionInput(e.target.value)}
      />
      <br />
      <br />
      <button
        onClick={useCallback(() => {
          setConfession(confessionInput);
          openZuzaluMembershipPopup(
            PASSPORT_URL,
            window.location.origin + "/popup",
            SEMAPHORE_GROUP_URL,
            "zuzalu-confessions",
            generateMessageHash(confessionInput).toString()
          );
          createState.current = CreateState.REQUESTING;
        }, [setConfession, confessionInput])}
      >
        Publish
      </button>
      {error && (
        <ErrorOverlay error={error} onClose={() => setError(undefined)} />
      )}
    </>
  );
}

const BigInput = styled.input`
  width: 80%;
  height: 46px;
  padding: 8px;
  font-size: 16px;
  font-weight: 300;
`;
