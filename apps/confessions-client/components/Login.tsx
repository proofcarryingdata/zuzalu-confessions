import {
  openZuzaluMembershipPopup,
  usePassportPopupMessages,
  useSemaphoreGroupProof,
} from "@pcd/passport-interface";
import { useState } from "react";
import { login } from "../src/api";
import { PARTICIPANTS_URL, PASSPORT_URL } from "../src/util";
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

  const onVerified = (valid: boolean) => {
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

    const sendLogin = async () => {
      const res = await login(PARTICIPANTS_URL, pcdStr);
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
    };

    sendLogin().then((accessToken) => {
      onLoggedIn(accessToken);
    });
  };

  const { proof: _proof, error: proofError } = useSemaphoreGroupProof(
    pcdStr,
    PARTICIPANTS_URL,
    "zuzalu-confessions",
    onVerified
  );

  return (
    <>
      <button
        onClick={() => {
          openZuzaluMembershipPopup(
            PASSPORT_URL,
            window.location.origin + "/popup",
            PARTICIPANTS_URL,
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
