import { getExtensionURL } from "../Common/utilities";

export default function Logo(props) {
  return (
    <img
      src={getExtensionURL("/images/logo.png")}
      alt="Slate logo"
      height={16}
      width={16}
      {...props}
    />
  );
}
