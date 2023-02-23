import { useEffect, type Dispatch, type SetStateAction } from "react";
import cn from "classnames";

interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
}
export const Modal = ({ open, setOpen, title }: IProps) => {
  let modalClass = "";
  useEffect(() => {
    modalClass = cn({
      "modal modal-bottom sm:modal-middle": true,
      "modal-open": open,
    });
  }, [open]);
  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className={modalClass}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            Are you sure you want to Delete {title}?
          </h3>
          <p className="py-4">
            This will also delete all notes associated with this topic.
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn-success btn">
              Yep
            </label>
            <label
              htmlFor="my-modal"
              className="btn-warning btn"
              onClick={() => setOpen(false)}
            >
              No way!
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
