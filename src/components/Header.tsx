import { signIn, signOut, useSession } from "next-auth/react";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1 pl-5 text-3xl font-bold">
        {session?.user?.name ? `Notes for ${session.user.name}` : ""}
      </div>
      <div className="dropdown-end dropdown">
        {session?.user ? (
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn-ghost btn-circle avatar  btn">
              <div className="w-10 rounded-full">
                <img
                  src={session?.user?.image ?? ""}
                  alt={session?.user?.name ?? ""}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <a
                  onClick={() => void signOut()}
                  className="hover-bordered text-primary hover:bg-primary hover:text-white "
                >
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <button
            className="btn-ghost rounded-btn btn"
            onClick={() => void signIn()}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
};
