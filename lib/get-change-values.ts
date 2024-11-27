// export function getChangedValues<T extends Record<string, any>>(
//   original: T,
//   updated: T
// ): Partial<T> {
//   const changes: Partial<T> = {};

import { isEqual, pickBy } from "lodash";

//   for (const key in updated) {
//     if (updated.hasOwnProperty(key) && original[key] !== updated[key]) {
//       changes[key] = updated[key];
//     }
//   }

//   return changes;
// }

export const getChangedValues = <T extends object>(
  initialData: Partial<T>,
  updatedData: T
): Partial<T> => {
  return pickBy(
    updatedData,
    (value, key) => !isEqual(value, initialData[key as keyof T])
  ) as Partial<T>;
};
