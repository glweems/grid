import { SelectProps } from "../components/Select";
import { GridTemplateEntry, GridState } from "../state";

export function replaceItemAtIndex<T = object>(
  arr: T[],
  index: number,
  newValue: T
) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

export function removeItemAtIndex<T = object>(arr: T[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export type TypeValue =
  | "array"
  | "object"
  | "function"
  | "string"
  | "number"
  | "asyncfunction"
  | "promise"
  | "undefined";

export const toType = (obj: unknown): TypeValue =>
  ({}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase());

export function templateGenerator<T extends object>(
  strings: TemplateStringsArray,
  ...keys: Array<keyof T>
) {
  return function (data: T) {
    let template = strings.slice();

    keys.forEach((key, i) => {
      template[i] = template[i] + data[key];
    });

    return template.join("");
  };
}

export function getAllowedEntry(
  name: string,
  value: GridUnit,
  entry: GridTemplateEntry
): GridTemplateEntry {
  switch (value) {
    case "fr": {
      return {
        ...entry,
        amount: 10,
        [name]: value,
        inputProps: { ...defaultInputProps, step: 0.1, max: 20 },
        selectProps: defaultSelectProps,
      };
    }
    case "%":
      return {
        ...entry,
        amount: 10,
        [name]: value,
        inputProps: defaultInputProps,
        selectProps: defaultSelectProps,
      };
    case "px":
      return {
        ...entry,
        amount: 100,
        [name]: value,
        inputProps: { ...entry.inputProps, max: 1000 },
        selectProps: defaultSelectProps,
      };
    case "vw":
      return {
        ...entry,
        amount: 10,
        [name]: value,
        inputProps: defaultInputProps,
        selectProps: defaultSelectProps,
      };
    case "vh":
      return {
        ...entry,
        amount: 10,
        [name]: value,
        inputProps: defaultInputProps,
        selectProps: defaultSelectProps,
      };
    case "em":
      return {
        ...entry,
        amount: 5,
        [name]: value,
        inputProps: defaultInputProps,
        selectProps: defaultSelectProps,
      };
    case "rem":
      return {
        ...entry,
        amount: 5,
        [name]: value,
        inputProps: defaultInputProps,
        selectProps: defaultSelectProps,
      };
    case "auto":
      return {
        ...entry,
        amount: "" as any,
        [name]: value,
        inputProps: {
          ...entry.inputProps,
          disabled: true,
          style: { display: "none" },
        },
        selectProps: { ...entry.selectProps, style: { gridColumn: "1 / 3" } },
      };

    default:
      return {
        ...entry,
        [name]: value,
      };
  }
}

/**
 * @param {string} name
 * @returns string
 * @example prettyName("gridTemplateRows") // returns "Grid Rows"
 */
export function prettyName(name: string): string {
  return name
    .split("Template")
    .join(" ")
    .replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
}

export const groupRepeatedUnits = (
  templateUnitArray: Pick<GridTemplateEntry, "amount" | "unit">[]
) => {
  const templateArray = templateUnitArray.map((i) => i["amount"] + i["unit"]);
  const groups = [[templateArray.shift() as string]];
  for (const templateUnit of templateArray) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup.indexOf(templateUnit) !== -1) {
      lastGroup.push(templateUnit);
    } else {
      groups.push([templateUnit]);
    }
  }
  return groups;
};

export const createRepetition = (groups: string[][], maxRepetition = 1) => {
  return groups
    .map((group) =>
      // If you want to add repetition only when a measure is repeated more than x times,
      // change maxRepetition value to x
      group.length === maxRepetition
        ? group.join(" ")
        : `repeat(${group.length}, ${group[0]})`
    )
    .join(" ");
};

export function repeatStr(
  entries: Pick<GridTemplateEntry, "amount" | "unit">[]
) {
  return createRepetition(groupRepeatedUnits(entries));
}

export type GridUnit = "fr" | "%" | "px" | "vw" | "vh" | "em" | "rem" | "auto";

export const gridUnits: GridUnit[] = [
  "fr",
  "%",
  "px",
  "vw",
  "vh",
  "em",
  "rem",
  "auto",
];

export type GridGapUnit = "px" | "rem" | "em" | "vh" | "vw";

export const gridGapUnits: GridGapUnit[] = ["px", "rem", "em", "vh", "vw"];

export const defaultInputProps = {
  name: "amount",
  min: 0,
  max: 20,
  step: 0.1,
  disabled: false,
  type: "number",
};

export const defaultSelectProps: SelectProps = {
  name: "unit",
  disabled: false,
  options: gridUnits,
};

export const initialGridTemplateRows: GridTemplateEntry[] = [
  {
    id: "row-1",
    amount: 1,
    unit: "fr",
    inputProps: defaultInputProps,
    selectProps: defaultSelectProps,
  },
  {
    id: "row-2",
    amount: 1,
    unit: "fr",
    inputProps: defaultInputProps,
    selectProps: defaultSelectProps,
  },
];

export const initialGridTemplateColumns: GridTemplateEntry[] = [
  {
    id: "column-1",
    amount: 1,
    unit: "fr",
    inputProps: defaultInputProps,
    selectProps: defaultSelectProps,
  },
  {
    id: "column-2",
    amount: 1,
    unit: "fr",
    inputProps: defaultInputProps,
    selectProps: defaultSelectProps,
  },
];

export function dataToCss(
  entries: Pick<GridTemplateEntry, "amount" | "unit">[]
) {
  return entries
    ?.map(({ amount, unit }) => `${amount}${unit}`)
    .toString()
    .split(",")
    .join(" ");
}

export function createCssString(
  entries: Pick<GridTemplateEntry, "amount" | "unit">[],
  repeat = false
): string {
  if (repeat) return repeatStr(entries);
  return dataToCss(entries);
}

export const defaultGridState: GridState = {
  gridContainerClassName: "grid-container",
  useCssRepeatFn: true,
  gridTemplateRows: initialGridTemplateRows,
  gridTemplateColumns: initialGridTemplateColumns,
  gridGap: [
    {
      id: "grid-gap",
      amount: 1,
      unit: "rem",
      inputProps: defaultInputProps,
      selectProps: { ...defaultSelectProps, options: gridGapUnits },
    },
    {
      id: "grid-gap1",
      amount: 1,
      unit: "rem",
      inputProps: defaultInputProps,
      selectProps: { ...defaultSelectProps, options: gridGapUnits },
    },
  ],
};
