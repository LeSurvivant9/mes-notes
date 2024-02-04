"use server";

import { put } from "@vercel/blob";
import { extractGrades } from "@/actions/admin/grade.actions";

export const uploadAvatar = async (formData: FormData) => {
  const file = formData.get("file") as File;
  const filename = file.name;
  const blob = await put(`avatar/${filename}`, file, {
    access: "public",
  });

  return blob.url;
};

export const uploadPdfFile = async (formData: FormData) => {
  const file = formData.get("file") as File;
  const gradesText = await extractGrades(file);
  // const filename = file.name;
  // const blob = await put(`file_grades/${filename}`, file, {
  //   access: "public",
  // });

  // return { url: blob.url, grades: gradesText };
  return { url: "", grades: gradesText };
};
