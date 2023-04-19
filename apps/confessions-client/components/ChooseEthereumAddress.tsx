import {
  constructPassportPcdGetRequestUrl,
  getWithoutProvingUrl,
} from "@pcd/passport-interface";

console.log(constructPassportPcdGetRequestUrl, getWithoutProvingUrl);

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
  console.log("getWithoutProvingUrl", getWithoutProvingUrl);
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
