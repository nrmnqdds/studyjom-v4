import Navbar from "@/components/upload/navbar";
import UploadForm from "@/components/upload/upload-form";
import React from "react";

const Page = () => {
  return (
    <main className="bg-indigo-300 w-full min-h-screen flex flex-col items-center justify-start">
      <Navbar />
      <UploadForm />
    </main>
  );
};

export default Page;
