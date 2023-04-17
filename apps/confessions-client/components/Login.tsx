import {
  openZuzaluMembershipPopup,
  usePassportPopupMessages,
  useSemaphoreGroupProof,
} from "@pcd/passport-interface";
import { useCallback, useEffect, useState } from "react";
import { login } from "../src/api";
import { PASSPORT_URL, SEMAPHORE_GROUP_URL } from "../src/util";
import { ConfessionsError, ErrorOverlay } from "./shared/ErrorOverlay";

/**
 * Login for the user who belongs to the specified semaphore group.
 * Generate a semaphore proof, calls the /login endpoint on the server, and
 * gets a jwt. The jwt can be used to make other requests to the server.
 * @param onLoggedIn a callback function which will be called after the user logged in
 * with the jwt
 */
export function Login({ onLoggedIn }: { onLoggedIn: (_: string) => void }) {
  const [error, setError] = useState<ConfessionsError>();
  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();
  const [valid, setValid] = useState<boolean | undefined>();
  const onVerified = useCallback((valid: boolean) => {
    setValid(valid);
  }, []);

  const { proof, error: proofError } = useSemaphoreGroupProof(
    pcdStr,
    SEMAPHORE_GROUP_URL,
    "zuzalu-confessions",
    onVerified
  );

  useEffect(() => {
    if (valid === undefined) return; // verifying

    if (proofError) {
      console.error("error using semaphore passport proof: ", proofError);
      const err = {
        title: "Login failed",
        message: "There's an error in generating proof.",
      } as ConfessionsError;
      setError(err);
      return;
    }

    if (!valid) {
      const err = {
        title: "Login failed",
        message: "Proof is invalid.",
      } as ConfessionsError;
      setError(err);
      return;
    }

    (async () => {
      const res = await login(SEMAPHORE_GROUP_URL, pcdStr);
      if (!res.ok) {
        const resErr = await res.text();
        console.error("error login to the server: ", resErr);
        const err = {
          title: "Login failed",
          message: "Fail to connect to the server, please try again later.",
        } as ConfessionsError;
        setError(err);
        return;
      }
      const token = await res.json();
      return token.accessToken;
    })().then((accessToken) => {
      onLoggedIn(accessToken);
    });
  }, [proof, valid, proofError, pcdStr, onLoggedIn]);

  return (
    <>
      <button
        onClick={() => {
          openZuzaluMembershipPopup(
            PASSPORT_URL,
            window.location.origin + "/popup",
            SEMAPHORE_GROUP_URL,
            "zuzalu-confessions"
          );
        }}
      >
        Login
      </button>
      {error && (
        <ErrorOverlay error={error} onClose={() => setError(undefined)} />
      )}
      <br />
      <br />
    </>
  );
}
