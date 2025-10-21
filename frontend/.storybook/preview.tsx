import "@mantine/core/styles.css";

import { useEffect } from "react";
import { addons } from "@storybook/addons";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";
import { MantineProvider, useMantineColorScheme } from "@mantine/core";
import { theme } from "../src/theme";
import type { Decorator } from "@storybook/react";

const channel = addons.getChannel();

function ColorSchemeWrapper({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useMantineColorScheme();
  const handleColorScheme = (value: boolean) =>
    setColorScheme(value ? "dark" : "light");

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
    return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  }, [channel]);

  return <>{children}</>;
}

export const decorators: Decorator[] = [
  (Story) => (
    <ColorSchemeWrapper>
      <Story />
    </ColorSchemeWrapper>
  ),
  (Story) => (
    <MantineProvider theme={theme}>
      <Story />
    </MantineProvider>
  ),
];
