"use server";

import { del, put } from "@vercel/blob";

export const uploadAvatar = async (formData: FormData) => {
  const file = formData.get("file") as File;
  const filename = file.name;
  const blob = await put(`avatar/${filename}`, file, {
    access: "public",
  });
  return blob.url;
};

export const uploadPdfFile = async (formData: FormData) => {
  try {
    const response = await fetch("http://localhost:8000/upload-pdf/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }
    const grades = await response.json();
    return grades as { studentNumber: string; value: number }[];
  } catch (error) {
    throw new Error("Failed to upload file");
  }
};

export const deleteAvatar = async (userId: string, avatarUrl: string) => {
  await del(avatarUrl);
};
