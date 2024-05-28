import { uuid } from "@supabase/supabase-js/dist/module/lib/helpers";
import { UploadedUppyFile } from "@uppy/core";
import { TOption, TUploadedFile, TUploadedVideo } from "@/types";

export const getTimeandDate = (
  timeStamp: string | number | null | undefined,
  showTime?: boolean
) => {
  if (timeStamp === undefined || timeStamp === null) return null;
  const td = new Date(timeStamp);
  const formattedDate = new Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
    timeStyle: showTime === true ? "medium" : undefined,
  }).format(td);

  return formattedDate;
};

export const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString("en-US", {
    month: "long",
  });
};

export const getFormattedUrls = <T extends TUploadedFile | TUploadedVideo>({
  files,
  uploadedFiles,
  filePath,
  initTags,
}: {
  files: UploadedUppyFile<Record<string, unknown>, Record<string, unknown>>[];
  uploadedFiles: T[];
  initTags: string[];
  filePath: string;
}): T[] => {
  const objectNames = [];

  for (const _file of files) {
    const objectUrl = filePath + "/" + _file.meta.objectName;

    let isPresent = false;
    for (const v of uploadedFiles) {
      if (v.url === objectUrl) {
        isPresent = true;
        break;
      }
    }

    const fileType = _file.type?.split("/")[0];
    if (!isPresent) {
      if (fileType !== "video")
        objectNames.push({
          id: uuid(),
          url: objectUrl,
          tags: initTags,
        });
      else
        objectNames.push({
          id: uuid(),
          url: objectUrl,
          tags: initTags,
          poster: "",
          type: _file.extension,
        });
    }
  }

  return objectNames as T[];
};

export const getFormattedHeading = (heading?: string) =>
  heading
    ? heading
        .split("_")
        .map(h => h[0].toUpperCase() + h.slice(1))
        .join(" ")
    : null;

export const getFormattedInput = (input: string) =>
  input
    .split(" ")
    .map(i => i.toLowerCase())
    .join("_");

export const sort = (arr: TOption[], order: "asc" | "desc" = "asc") =>
  arr.sort((a, b) =>
    order === "asc"
      ? Number(a.value.split(" ")[0]) - Number(b.value.split(" ")[0])
      : Number(b.value.split(" ")[0]) - Number(a.value.split(" ")[0])
  );
