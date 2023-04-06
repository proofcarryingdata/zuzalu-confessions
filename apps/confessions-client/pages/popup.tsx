import { useEffect, useState } from "react";

/**
 * This page is necessary to receive PCDs from the passport after requesting
 * a PCD from the passport. It uses the window messaging API to communicate
 * the PCD it received back to the requesting tab.
 */
export default function AuthPopup() {
  useEffect(() => {
    if (window.opener == null) {
      setErr("Not a popup window");
      return;
    }

    const search = window.location.search;
    const params = new URLSearchParams(search);

    // First, this page is window.open()-ed. Redirect to the Passport app.
    if (params.get("proofUrl") != null) {
      window.location.href = decodeURIComponent(params.get("proofUrl")!);
    } else if (params.get("proof") != null) {
      console.log('the proof is', params.get("proof"));
      // Later, the Passport redirects back with a proof. Send it to our parent.
      window.opener.postMessage({ encodedPCD: params.get("proof")! }, "*");
      window.close();
    }
  }, []);

  // In the happy case, this page redirects immediately.
  // If not, show an error.
  const [err, setErr] = useState<string | undefined>();

  return <div>{err}</div>;
}
