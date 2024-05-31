"use client";

import { Button } from "@/components/default/button";
import { FileInput, FileUploader } from "@/components/file-uploader";
import { IoCloudUpload } from "react-icons/io5";

const StepOne = ({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) => {
  return (
    <FileUploader
      value={files}
      onValueChange={setFiles}
      dropzoneOptions={{
        maxFiles: 5,
        accept: {
          "image/*": [".jpg", ".png", ".jpeg"],
          "application/pdf": [".pdf"],
        },
        // multiple: true,
        maxSize: 1024 * 1024 * 5,
      }}
      className="w-1/2 h-full flex flex-col items-center justify-center mt-10"
    >
      <FileInput className="bg-purple-300 hover:bg-purple-200 w-full h-fit py-10 flex flex-col items-center gap-2 justify-center cursor-pointer shadow-default-md border-2 border-solid border-black rounded-lg">
        <span className="text-5xl text-purple-900">
          <IoCloudUpload />
        </span>
        <p className="text-black text-3xl">Drag and drop files</p>
        <p className="text-purple-900 text-sm">Or if you prefer</p>
        <Button
          type="button"
          className="bg-cyan-300 hover:bg-cyan-400 active:bg-cyan-500 disabled:bg-cyan-900"
        >
          Browse My Files
        </Button>
        <p className="text-purple-900 text-sm mt-2">
          Supported files: jpg, png, pdf
        </p>
      </FileInput>
      {/* <FileUploaderContent className="flex flex-col items-center gap-2 w-full overflow-y-auto h-64 mt-10  scrollbar-thin scrollbar-track-pink-200 scrollbar-thumb-pink-400">
        {files && files.length > 0 && (
          <>
            <>
              {files.map((file, i) => (
                <FileUploaderItem
                  key={i}
                  index={i}
                  className="h-fit flex items-center gap-2 bg-purple-300 hover:bg-purple-200 p-2 rounded-lg shadow-default-md border-2 border-solid border-black w-1/2"
                >
                  <div>
                    <FaEye
                      className="text-2xl text-black cursor-pointer"
                      onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                    />
                    <h1 className="text-lg font-bold text-purple-900 line-clamp-2">
                      {file.name}
                    </h1>
                    <p className="text-sm text-purple-800">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </FileUploaderItem>
              ))}
            </>
          </>
        )}
      </FileUploaderContent>
      {
        files.length > 0 && (
          <Button
            className="bg-green-300 hover:bg-green-400 w-fit mx-auto"
            onClick={() => {
              if (files.length === 0) {
                toast.error("Please upload at least one file")
                return;
              }
              router.push("/upload?step=2")
            }}
          >
            Continue
          </Button>
        )
      } */}
    </FileUploader>
  );
};

export default StepOne;
