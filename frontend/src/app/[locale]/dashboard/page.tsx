"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Title,
  Text,
  Paper,
  SimpleGrid,
  Group,
} from "@mantine/core";
import { IconUser, IconTrophy, IconCalendar } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@frontend/i18n/routing";
import { authService } from "@frontend/lib/api/auth";
import { AuthenticatedLayout } from "@frontend/components/layout/AuthenticatedLayout";
import type { IUser } from "@pro-league/shared";

export default function DashboardPage() {
  const t = useTranslations();
  const router = useRouter();
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
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <AuthenticatedLayout>
      <Container size="lg" py={60}>
        <Stack gap="xl">
          <div>
            <Title order={1}>
              {t("common.home")} {user.fullName && `, ${user.fullName}`}
            </Title>
            <Text size="lg" c="dimmed">
              Welcome to Pro-League Tournament Management
            </Text>
          </div>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            <Paper withBorder shadow="sm" p="xl" radius="md">
              <Group>
                <IconUser size={32} color="blue" />
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Profile
                  </Text>
                  <Text size="lg" fw={500}>
                    {user.fullName || "Not set"}
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper withBorder shadow="sm" p="xl" radius="md">
              <Group>
                <IconTrophy size={32} color="gold" />
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Tournaments
                  </Text>
                  <Text size="lg" fw={500}>
                    0
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper withBorder shadow="sm" p="xl" radius="md">
              <Group>
                <IconCalendar size={32} color="green" />
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Upcoming Events
                  </Text>
                  <Text size="lg" fw={500}>
                    0
                  </Text>
                </div>
              </Group>
            </Paper>
          </SimpleGrid>

          <Paper withBorder shadow="sm" p="xl" radius="md">
            <Title order={3} mb="md">
              Getting Started
            </Title>
            <Text c="dimmed">
              Welcome to your dashboard! More features coming soon...
            </Text>
          </Paper>
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}
