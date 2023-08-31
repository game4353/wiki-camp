import { Bars3Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import LocaleSwitcher from "./locale-switcher";

type Props = {
  onMenuButtonClick(): void;
}

export default function Navbar(props: Props) {
  return (
    <nav
      className={classNames({
        "bg-white text-zinc-500": true, // colors
        "flex items-center": true, // layout
        "w-full fixed z-10 px-4 shadow-sm h-16": true, //positioning & styling
      })}
    >
      <div className="font-bold text-lg">My Logo</div>
      <div className="flex-grow"></div> {/** spacer */}
      <button className="md:hidden" onClick={props.onMenuButtonClick}>
        <Bars3Icon className="h-6 w-6" />
      </button>
      {/* <LocaleSwitcher/> */}
    </nav>
  );
};
