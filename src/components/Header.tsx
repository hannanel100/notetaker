import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import { themeChange } from "theme-change";

export const Header = () => {
  const { data: session } = useSession();
  const [firstName, lastName] = session?.user?.name?.split(" ") ?? [];
  const themeValues = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "winter",
    "emerald",
    "corporate",
    "forest",
    "halloween",
  ];
  useEffect(() => {
    themeChange(false);
  }, []);
  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1 truncate pl-5 text-3xl font-bold ">
        <span className="hidden md:inline-block">Notes for </span>
        <span className=" sm:hidden">
          {session?.user?.name
            ? `${firstName ? firstName?.charAt(0) : ""} ${
                lastName ? lastName?.charAt(0) : ""
              }`
            : ""}
        </span>
        {session?.user?.name ? `  ${session.user.name}` : ""}
      </div>
      <div className="dropdown-end dropdown">
        {session?.user ? (
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn-ghost btn-circle avatar  btn">
              <div className="w-10 rounded-full ring-2 ring-accent">
                <Image
                  src={session?.user?.image ?? ""}
                  alt={session?.user?.name ?? ""}
                  width={40}
                  height={40}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 text-secondary shadow"
            >
              <li>
                <select className="select w-full max-w-xs" data-choose-theme>
                  <option value="">Choose Theme</option>
                  {themeValues.map((theme) => (
                    <option
                      key={theme.toLocaleLowerCase()}
                      value={theme.toLocaleLowerCase()}
                      className="menu-item"
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                  ))}
                </select>
              </li>
              <li>
                <a
                  onClick={() => void signOut()}
                  className="hover-bordered  hover:bg-primary hover:text-white "
                >
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <button
            className="btn-primary rounded-btn btn"
            onClick={() => void signIn("github")}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
};
