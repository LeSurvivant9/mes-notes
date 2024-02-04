import React from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const AssessmentForm = ({
  mod,
  assessmentId,
}: {
  mod: "create" | "update";
  assessmentId?: string;
}) => {
  const form = useForm();
  return (
    <Form {...form}>
      <form></form>
    </Form>
  );
};

export default AssessmentForm;
