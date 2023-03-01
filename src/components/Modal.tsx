import { type Dispatch, type SetStateAction } from "react";

interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  deleteTopic: () => void;
}
export const Modal = ({
  open,
  setOpen,
  title,
  deleteTopic,
}: IProps) => {
  const handleClose = () => {
    console.log("close");
    setOpen(false);
  };
  const handleDeleteTopic = () => {
    console.log("delete");
    deleteTopic();
    setOpen(false);
  };
  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div
        className={`modal modal-bottom sm:modal-middle ${
          open ? "modal-open" : ""
        }`}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            Are you sure you want to Delete {title}?
          </h3>
          <p className="py-4">
            This will also delete all notes associated with this topic.
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal">
              <button className="btn-success btn" onClick={handleDeleteTopic}>
                Yep
              </button>
            </label>
            <label htmlFor="my-modal">
              <button className="btn-warning btn" onClick={handleClose}>
                No way!
              </button>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
