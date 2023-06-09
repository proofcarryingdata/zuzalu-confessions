import {
  EthereumOwnershipPCD,
  EthereumOwnershipPCDPackage,
} from "@pcd/ethereum-ownership-pcd";
import {
  constructPassportPcdGetRequestUrl,
  getWithoutProvingUrl,
  usePassportPopupMessages,
} from "@pcd/passport-interface";
import { useEffect } from "react";
import styled from "styled-components";
import { PASSPORT_URL } from "../src/util";

console.log(constructPassportPcdGetRequestUrl, getWithoutProvingUrl);

export function ChooseEthereumAddress({
  pcd,
  setPCD,
}: {
  pcd: EthereumOwnershipPCD | undefined;
  setPCD: (pcd: EthereumOwnershipPCD | undefined) => void;
}) {
  const [pcdStr, _passportPendingPCDStr] = usePassportPopupMessages();

  useEffect(() => {
    if (pcdStr !== "") {
      const parsed = JSON.parse(pcdStr);
      const type = parsed.type;

      if (type === EthereumOwnershipPCDPackage.name)
        EthereumOwnershipPCDPackage.deserialize(parsed.pcd).then(setPCD);
    }
  }, [pcdStr, setPCD]);

  useEffect(() => {
    console.log(pcd);
  }, [pcd]);

  return (
    <>
      {!pcd && (
        <button
          onClick={() => {
            getProofWithoutProving();
          }}
        >
          post as ethereum address
        </button>
      )}

      {pcd && (
        <>
          <button
            onClick={() => {
              setPCD(undefined);
            }}
          >
            clear
          </button>
          <SelectedIdentity>
            id: {pcd?.id?.substring(0, 16)}...
          </SelectedIdentity>
        </>
      )}
    </>
  );
}

function getProofWithoutProving() {
  const url = getWithoutProvingUrl(
    PASSPORT_URL,
    window.location.origin + "/popup",
    EthereumOwnershipPCDPackage.name
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
  margin: 4px;
  border-radius: 4px;
`;
