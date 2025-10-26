"use client";

import { useEffect, useState } from "react";
import { NavLink, Stack } from "@mantine/core";
import { IconHome2, IconUser, IconLayoutDashboard } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@frontend/i18n/routing";
import { authService } from "@frontend/lib/api/auth";

export function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  if (!isAuthenticated) {
    return (
      <Stack gap={0} p="md">
        <NavLink
          component={Link}
          href="/"
          label={t("common.home")}
          leftSection={<IconHome2 size={16} stroke={1.5} />}
          active={pathname === "/"}
        />
      </Stack>
    );
  }

  return (
    <Stack gap={0} p="md">
      <NavLink
        component={Link}
        href="/dashboard"
        label="Dashboard"
        leftSection={<IconLayoutDashboard size={16} stroke={1.5} />}
        active={pathname === "/dashboard"}
      />
      <NavLink
        component={Link}
        href="/profile"
        label={t("common.profile")}
        leftSection={<IconUser size={16} stroke={1.5} />}
        active={pathname === "/profile"}
      />
    </Stack>
  );
}
