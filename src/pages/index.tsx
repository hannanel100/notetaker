import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

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
  return (
    <>
      <div className="mx-auto mt-5 grid max-w-screen-2xl grid-cols-2 place-content-center gap-4 px-5 md:grid-cols-4">
        <div className="col-span-2 px-2 md:col-span-1">
          <h2 className="text-3xl font-bold">Topics</h2>
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
        <div className="col-span-3 flex flex-col gap-4">
          <h2 className="text-3xl font-bold">Notes</h2>
          <h3 className="text-xl font-bold">
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
