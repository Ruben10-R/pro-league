"use client";

import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Anchor,
  Paper,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconMail, IconLock, IconCheck, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@frontend/i18n/routing";
import { authService } from "@frontend/lib/api/auth";
import type { ILoginCredentials } from "@pro-league/shared";

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ILoginCredentials>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => {
        if (!value) {
          return t("validation.required", { field: t("common.email") });
        }
        return /^\S+@\S+$/.test(value) ? null : t("validation.email");
      },
      password: (value) => {
        if (!value) {
          return t("validation.required", { field: t("common.password") });
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values: ILoginCredentials) => {
    setLoading(true);

    try {
      const response = await authService.login(values);

      if (response.success) {
        notifications.show({
          title: t("common.login"),
          message: t("auth.login.success"),
          color: "green",
          icon: <IconCheck size={16} />,
        });

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        // Show error from API (translation key)
        notifications.show({
          title: t("common.login"),
          message: t(response.message.key, response.message.params),
          color: "red",
          icon: <IconX size={16} />,
        });
      }
    } catch (error) {
      notifications.show({
        title: t("common.login"),
        message: t("auth.login.failed"),
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper withBorder shadow="md" p={30} radius="md">
      <Stack gap="lg">
        <div>
          <Text size="xl" fw={700}>
            {t("auth.login.title")}
          </Text>
          <Text size="sm" c="dimmed">
            {t("auth.login.subtitle")}
          </Text>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
          <Stack gap="md">
            <TextInput
              label={t("common.email")}
              placeholder="your@email.com"
              leftSection={<IconMail size={16} />}
              required
              autoComplete="email"
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label={t("common.password")}
              placeholder={t("common.password")}
              leftSection={<IconLock size={16} />}
              required
              autoComplete="current-password"
              {...form.getInputProps("password")}
            />

            <Button type="submit" fullWidth loading={loading} mt="md">
              {t("common.login")}
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center">
          {t("auth.login.noAccount")}{" "}
          <Anchor component={Link} href="/register" fw={500}>
            {t("common.register")}
          </Anchor>
        </Text>
      </Stack>
    </Paper>
  );
}
