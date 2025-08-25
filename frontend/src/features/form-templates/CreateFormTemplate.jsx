import React from "react";
import { useParams } from "react-router-dom";
import FormBuilder from "../../components/FormBuilder/FormBuilder";

export default function CreateFormTemplate() {
  const { templateId } = useParams();

  return (
    <>
      <FormBuilder templateId={templateId} />
    </>
  );
}


