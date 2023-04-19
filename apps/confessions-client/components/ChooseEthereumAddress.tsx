import {
  constructPassportPcdGetRequestUrl,
  constructPassportPcdGetWithoutProvingRequestUrl,
} from "@pcd/passport-interface";

export function ChooseEthereumAddress() {
  return (
    <>
      <button
        onClick={() => {
          getProofWithoutProving();
        }}
      >
        post as ethereum address
      </button>
    </>
  );
}

function getProofWithoutProving() {
  console.log(
    "constructPassportPcdGetWithoutProvingRequestUrl",
    constructPassportPcdGetWithoutProvingRequestUrl
  );
  console.log(
    "constructPassportPcdGetRequestUrl",
    constructPassportPcdGetRequestUrl
  );

  // const url = constructPassportPcdGetWithoutProvingRequestUrl(
  //   PASSPORT_URL,
  //   window.location.origin + "/popup",
  //   EthereumOwnershipPCDPackage.name
  // );

  // sendPassportRequest(url);
}

export function sendPassportRequest(proofUrl: string) {
  const popupUrl = `/popup?proofUrl=${encodeURIComponent(proofUrl)}`;
  window.open(popupUrl, "_blank", "width=360,height=480,top=100,popup");
}
