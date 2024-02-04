"use client";

import { useForm } from "react-hook-form";
import SubmitButton from "@/components/submit-button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEventHandler, useState } from "react";
import { uploadPdfFile } from "@/actions/upload.actions";

const UploadPage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const formSchema = z.object({
    file: z.any(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const text = await uploadPdfFile(formData);
    console.log(text);
  };

  return (
    <>
      <h1>Téléverse ton fichier</h1>
      <form onSubmit={handleSubmit}>
        <input type={"file"} name={"file"} />
        <SubmitButton>Envoyer</SubmitButton>
      </form>
    </>
  );
};

export default UploadPage;
