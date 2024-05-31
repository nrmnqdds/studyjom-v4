"use client";

import { Input } from "@/components/default/input";
import SubjectsCombobox from "@/components/default/subjects-combobox";

export const NoteForm = () => {
  return (
    <form className="space-y-5 w-1/2">
      <div>
        <label htmlFor="title" className="text-black">
          Title
        </label>
        <Input
          type="text"
          id="title"
          className="w-full text-black"
          placeholder="Title for the post"
          // {...register(`notes.${index}.title`)}
        />
      </div>
      <div>
        <label htmlFor="desc" className="text-black">
          Description
        </label>
        <Input
          type="text"
          id="desc"
          className="w-full text-black"
          placeholder="Description for the post"
          // {...register(`notes.${index}.desc`)}
        />
      </div>
      <div>
        <SubjectsCombobox
          title="Select Subject"
          onChange={(value) => console.log(value)}
          // onChange={(value) =>
          //   setValue(`notes.${index}.subjectName`, value)
          // }
        />
      </div>
    </form>
  );
};
