"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Paper,
} from "@mantine/core";
import { IconLogin, IconUserPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@frontend/i18n/routing";
import { LanguageSwitcher } from "@frontend/components/ui/LanguageSwitcher";
import { authService } from "@frontend/lib/api/auth";

export default function HomePage() {
  const t = useTranslations();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);

    // If authenticated, redirect to dashboard
    if (authenticated) {
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading || isAuthenticated) {
    return null;
  }

  return (
    <Container size="md" py={60}>
      <Stack gap="xl">
        <Group justify="flex-end">
          <LanguageSwitcher />
        </Group>

        <Paper withBorder shadow="md" p={30} radius="md">
          <Stack gap="lg" align="center">
            <Title order={1}>Pro-League</Title>
            <Text size="lg" ta="center" c="dimmed">
              Welcome to Pro-League Tournament Management System
            </Text>

            <Group justify="center" mt="xl">
              <Button
                component={Link}
                href="/login"
                leftSection={<IconLogin size={16} />}
                variant="filled"
              >
                {t("common.login")}
              </Button>
              <Button
                component={Link}
                href="/register"
                leftSection={<IconUserPlus size={16} />}
                variant="light"
              >
                {t("common.register")}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
