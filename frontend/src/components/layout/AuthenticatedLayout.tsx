"use client";

import { useEffect, useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  Button,
  Menu,
  Avatar,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUser, IconLogout, IconChevronDown } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@frontend/i18n/routing";
import { ChronoIcon } from "@frontend/components/icons/ChronoIcon";
import { LanguageSwitcher } from "@frontend/components/ui/LanguageSwitcher";
import { Navbar } from "@frontend/components/layout/Navbar";
import { authService } from "@frontend/lib/api/auth";
import { notifications } from "@mantine/notifications";
import type { IUser } from "@pro-league/shared";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const t = useTranslations();
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure(false);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();

      notifications.show({
        title: t("common.logout"),
        message: t("auth.logout.success"),
        color: "blue",
      });

      router.push("/login");
    } catch (error) {
      notifications.show({
        title: t("common.logout"),
        message: t("auth.errors.logoutFailed"),
        color: "red",
      });
    }
  };

  if (!user) {
    return null;
  }

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
              href="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <ChronoIcon width={40} height={40} />
            </Link>
          </Group>

          <Group gap="md">
            <LanguageSwitcher />

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button
                  variant="subtle"
                  rightSection={<IconChevronDown size={14} />}
                >
                  <Group gap="xs">
                    <Avatar size={24} radius="xl" color="blue">
                      {user.fullName?.[0] || user.email[0].toUpperCase()}
                    </Avatar>
                    <Text size="sm" visibleFrom="sm">
                      {user.fullName || user.email}
                    </Text>
                  </Group>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>{user.email}</Menu.Label>
                <Menu.Item
                  component={Link}
                  href="/profile"
                  leftSection={<IconUser size={16} />}
                >
                  {t("common.profile")}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={16} />}
                  onClick={handleLogout}
                >
                  {t("common.logout")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
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
