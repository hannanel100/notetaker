import { useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

export const NoteEditor = ({
  onSave,
}: {
  onSave: (note: { title: string; content: string }) => void;
}) => {
  const [code, setCode] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  return (
    //daisyui card
    <div className="card mt-5 border border-gray-500 bg-base-200 shadow-2xl">
      <div className="card-body">
        <h2 className="card-title">
          <input
            className="input-bordered input-secondary input w-full"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </h2>
        <CodeMirror
          value={code}
          onChange={(value) => setCode(value)}
          width="500px"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          className="input-secondary border border-gray-300"
        />
        <div className="card-actions flex justify-end">
          <button
            className="btn-primary btn"
            onClick={() => {
              onSave({ title, content: code });
              setCode("");
              setTitle("");
            }}
            disabled={title === "" || code === ""}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
