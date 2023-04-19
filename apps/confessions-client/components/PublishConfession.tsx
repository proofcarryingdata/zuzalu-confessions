import {
  openZuzaluMembershipPopup,
  usePassportPopupMessages,
  useSemaphoreGroupProof,
} from "@pcd/passport-interface";
import { generateMessageHash } from "@pcd/semaphore-group-pcd";
import {
  SemaphoreSignaturePCD,
  SemaphoreSignaturePCDPackage,
} from "@pcd/semaphore-signature-pcd";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { postConfession } from "../src/api";
import { ALL_GROUPS, PASSPORT_URL, SGroup } from "../src/util";
import { ChooseEthereumAddress } from "./ChooseEthereumAddress";
import { SelectGroup } from "./SelectGroup";
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

  const [group, setGroup] = useState<SGroup>(ALL_GROUPS[0]);
  const [signaturePCD, setSignaturePCD] = useState<
    SemaphoreSignaturePCD | undefined
  >();
  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();

  useEffect(() => {
    if (signaturePCD) {
      setGroup(ALL_GROUPS[0]);
    }
  }, [signaturePCD]);

  const onVerified = useCallback(
    (valid: boolean) => {
      if (createState.current !== CreateState.RECEIVED) return;

      createState.current = CreateState.DEFAULT;

      if (!valid) {
        const err = {
          title: "Publish confession failed",
          message: "Proof is invalid.",
        } as ConfessionsError;
        setError(err);
        return;
      }

      const sendConfession = async () => {
        let signaturePCDStr: string | undefined = undefined;
        if (signaturePCD) {
          signaturePCDStr = JSON.stringify(
            await SemaphoreSignaturePCDPackage.serialize(signaturePCD)
          );
        }
        const res = await postConfession(
          group.url,
          confession,
          pcdStr,
          signaturePCDStr
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
    [signaturePCD, group.url, confession, pcdStr, onPublished]
  );

  const { proof, error: proofError } = useSemaphoreGroupProof(
    pcdStr,
    group.url,
    "zuzalu-confessions",
    onVerified
  );

  useEffect(() => {
    if (proofError) {
      console.error("error using semaphore passport proof: ", proofError);
      const err = {
        title: "Publish confession failed",
        message: "There's an error in generating proof.",
      } as ConfessionsError;
      setError(err);
      return;
    }
  }, [proofError]);

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
      {signaturePCD === undefined && (
        <>
          <SelectGroup group={group} setGroup={setGroup} /> <br />
          <br />
          {"or "}
          <br />
          <br />
        </>
      )}
      <ChooseEthereumAddress pcd={signaturePCD} setPCD={setSignaturePCD} />{" "}
      <br />
      <br />
      <button
        onClick={useCallback(() => {
          setConfession(confessionInput);
          openZuzaluMembershipPopup(
            PASSPORT_URL,
            window.location.origin + "/popup",
            group.url,
            "zuzalu-confessions",
            generateMessageHash(confessionInput).toString()
          );
          createState.current = CreateState.REQUESTING;
        }, [setConfession, confessionInput, group.url])}
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
