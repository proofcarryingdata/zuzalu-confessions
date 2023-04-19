import React, { useCallback } from "react";
import { ALL_GROUPS, SGroup } from "../src/util";

export function SelectGroup({
  group,
  setGroup,
}: {
  group: SGroup;
  setGroup: (group: SGroup) => void;
}) {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newGroupName = e.target.value;
      const correspondingGroup = ALL_GROUPS.find(
        (g) => g.name === newGroupName
      );
      if (!correspondingGroup) return;

      setGroup(correspondingGroup);
    },
    [setGroup]
  );

  return (
    <label>
      Posting as one of:{" "}
      <select value={group.name} onChange={onChange}>
        {ALL_GROUPS.map((g) => {
          return <option value={g.name}>{g.name}</option>;
        })}
      </select>
    </label>
  );
}
