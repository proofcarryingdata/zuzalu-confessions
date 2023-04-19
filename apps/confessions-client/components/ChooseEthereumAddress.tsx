import {
  constructPassportPcdGetRequestUrl,
  getWithoutProvingUrl,
  usePassportPopupMessages,
} from "@pcd/passport-interface";
import {
  SemaphoreSignaturePCD,
  SemaphoreSignaturePCDPackage,
} from "@pcd/semaphore-signature-pcd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { PASSPORT_URL } from "../src/util";

console.log(constructPassportPcdGetRequestUrl, getWithoutProvingUrl);

export function ChooseEthereumAddress() {
  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();
  const [pcd, setPcd] = useState<SemaphoreSignaturePCD | undefined>();

  useEffect(() => {
    if (pcdStr !== "") {
      const parsed = JSON.parse(pcdStr);
      const type = parsed.type;

      if (type === SemaphoreSignaturePCDPackage.name)
        SemaphoreSignaturePCDPackage.deserialize(parsed.pcd).then(setPcd);
    }
  }, [pcdStr]);

  useEffect(() => {
    console.log(pcd);
  }, [pcd]);

  return (
    <>
      <button
        onClick={() => {
          getProofWithoutProving();
        }}
      >
        post as ethereum address
      </button>
      {pcd && <SelectedIdentity>{pcd?.id?.substring(0, 16)}</SelectedIdentity>}
    </>
  );
}

function getProofWithoutProving() {
  const url = getWithoutProvingUrl(
    PASSPORT_URL,
    window.location.origin + "/popup",
    SemaphoreSignaturePCDPackage.name
  );
  sendPassportRequest(url);
}

export function sendPassportRequest(proofUrl: string) {
  const popupUrl = `/popup?proofUrl=${encodeURIComponent(proofUrl)}`;
  window.open(popupUrl, "_blank", "width=360,height=480,top=100,popup");
}

const SelectedIdentity = styled.span`
  border: 1px solid green;
  padding: 1px 4px;
`;
