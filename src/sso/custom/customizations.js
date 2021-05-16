import * as FP from "./finisherpix/content";

export const getCustomContent = (parentName) => {
  if (parentName.toLowerCase().includes("finisherpix"))
    return FP.customContent;

  return null;
};
