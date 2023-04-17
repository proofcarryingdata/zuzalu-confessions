import styled from "styled-components";
import { ALL_GROUPS } from "../src/util";

export function GroupLabel({ groupUrl }: { groupUrl: string }) {
  return (
    <Label style={{ backgroundColor: LABELS[groupUrl].color }}>
      {LABELS[groupUrl].label}
    </Label>
  );
}

const Label = styled.div`
  border: 1px solid black;
  border-radius: 4px 4px 0px 0px;
  padding: 0px 4px;
  display: inline-block;
`;

const LABELS = {
  [ALL_GROUPS[0].url]: { color: "#59f042", label: "Participant" },
  [ALL_GROUPS[1].url]: { color: "#4296f0", label: "Resident" },
  [ALL_GROUPS[2].url]: { color: "#c2c2c2", label: "Visitor" },
  [ALL_GROUPS[3].url]: { color: "#f0e742", label: "Organizer" },
};
