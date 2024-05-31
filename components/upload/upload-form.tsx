"use client";

import StepOne from "@/components/upload/step-one";
import StepTwo from "@/components/upload/step-two";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UploadForm = () => {
  const searchParams = useSearchParams();
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (files.length === 0) {
      router.replace("/upload");
    }
    if (files.length > 0) {
      router.replace("/upload?step=2");
    }
  });

  switch (searchParams.get("step") || "1") {
    case "1":
      return <StepOne files={files} setFiles={setFiles} />;
    case "2": {
      if (files.length === 0) {
        router.replace("/upload");
        return <StepOne files={files} setFiles={setFiles} />;
      }
      return <StepTwo files={files} />;
    }
    default:
      router.replace("/upload");
      return <StepOne files={files} setFiles={setFiles} />;
  }
};

export default UploadForm;
