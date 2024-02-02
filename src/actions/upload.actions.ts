"use server";

import { put } from "@vercel/blob";

export const uploadAvatar = async (formData: FormData) => {
  const file = formData.get("file") as File;
  const filename = file.name;
  const blob = await put(filename, file, {
    access: "public",
  });

  return blob.url;
};
