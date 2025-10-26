"use client";
import React from "react";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Navbar } from "@frontend/components/layout/Navbar";
import { ChronoIcon } from "@frontend/components/icons/ChronoIcon";
import { LanguageSwitcher } from "@frontend/components/ui/LanguageSwitcher";
import { Link } from "@frontend/i18n/routing";

export default function AppShellClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <ChronoIcon width={40} height={40} />
            </Link>
          </Group>

          <Group gap="md" pr="md">
            <LanguageSwitcher />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
