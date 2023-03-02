import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { api, type RouterOutputs } from "~/utils/api";
import { Header } from "~/components/Header";
import { useState } from "react";
import { NoteEditor } from "~/components/NoteEditor";
import { NoteCard } from "~/components/NoteCard";
import { Modal } from "~/components/Modal";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Notetaker</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <Content />
      </main>
    </>
  );
};

export default Home;

type Topic = RouterOutputs["topic"]["getAll"][0];

const Content: React.FC = () => {
  const { data: sessionData } = useSession();
  const [open, setOpen] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );
  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });
  const deleteTopic = api.topic.delete.useMutation({
    onSuccess: () => {
      void refetchTopics();
      void refetchNotes();
      setSelectedTopic(null);
    },
  });

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? "",
    },

    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    }
  );
  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });
  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });
  if (!sessionData?.user)
    return (
      <div className="container mx-auto mt-24 border border-solid  border-red-500 text-center text-2xl font-bold">
        <div className="flex flex-col gap-4">
          Please sign in to continue
          <div>
            <button className="btn-primary btn" onClick={() => void signIn()}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  return (
    <>
      <div className="mx-5 mt-5 grid grid-cols-4 gap-4">
        <div className="px-2">
          <ul className="bg-bas-100 menu rounded-box my-0 w-full py-2">
            {topics?.map((topic) => (
              <li key={topic.id}>
                <a
                  href="#"
                  className="menu-item flex justify-between px-0"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTopic(topic);
                  }}
                >
                  <span className="title">{topic.title} </span>

                  <label
                    htmlFor="my-modal"
                    className={`btn-error btn-xs btn `}
                    onClick={() => setOpen(!open)}
                  >
                    Delete
                  </label>
                </a>
              </li>
            ))}
          </ul>
          <input
            type="text"
            className="input-bordered input input-sm w-full"
            placeholder="Enter New Topic"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createTopic.mutate({ title: e.currentTarget.value });
                e.currentTarget.value = "";
              }
            }}
          />
        </div>
        <div className="col-span-3">
          <h3 className="text-2xl font-bold">
            {selectedTopic?.title ?? "Select a topic"}
          </h3>
          <div>
            {notes?.map((note) => (
              <div key={note.id} className="mt-5">
                <NoteCard
                  note={note}
                  onDelete={() => {
                    void deleteNote.mutate({ id: note.id });
                  }}
                />
              </div>
            ))}
          </div>
          <NoteEditor
            onSave={({ title, content }) =>
              void createNote.mutate({
                title,
                content,
                topicId: selectedTopic?.id ?? "",
              })
            }
          />
        </div>
      </div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={selectedTopic?.title ?? ""}
        deleteTopic={() => {
          void deleteTopic.mutate({ id: selectedTopic?.id ?? "" });
        }}
      />
    </>
  );
};
