import {IconHome2} from "@tabler/icons-react";
import {NavLink} from "@mantine/core";

export function Navbar() {
  return <NavLink
    href="/home"
    label="Home"
    leftSection={<IconHome2 size={16} stroke={1.5}/>}
  />;
}
