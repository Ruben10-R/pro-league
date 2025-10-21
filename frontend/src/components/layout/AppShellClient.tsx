"use client";
import React from "react";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Navbar } from "@frontend/components/layout/Navbar";
import { ChronoIcon } from "@frontend/components/icons/ChronoIcon";

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
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <ChronoIcon width={60} height={60} />
                </div>
            </AppShell.Header>

            <AppShell.Navbar>
                <Navbar />
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
