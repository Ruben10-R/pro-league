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
import {
  IconMail,
  IconLock,
  IconUser,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@frontend/i18n/routing";
import { authService } from "@frontend/lib/api/auth";
import type { IRegisterData } from "@pro-league/shared";

export function RegisterForm() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<IRegisterData>({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validate: {
      fullName: (value) => {
        if (!value) {
          return null;
        } // Optional field
        return value.length < 2
          ? t("validation.minLength", { field: t("common.fullName"), min: 2 })
          : null;
      },
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
        return value.length < 8
          ? t("validation.minLength", { field: t("common.password"), min: 8 })
          : null;
      },
    },
  });

  const handleSubmit = async (values: IRegisterData) => {
    setLoading(true);

    try {
      const response = await authService.register(values);

      if (response.success) {
        notifications.show({
          title: t("common.register"),
          message: t("auth.register.success"),
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
          title: t("common.register"),
          message: t(response.message.key, response.message.params),
          color: "red",
          icon: <IconX size={16} />,
        });
      }
    } catch (error) {
      notifications.show({
        title: t("common.register"),
        message: t("auth.register.failed"),
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
            {t("auth.register.title")}
          </Text>
          <Text size="sm" c="dimmed">
            {t("auth.register.subtitle")}
          </Text>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
          <Stack gap="md">
            <TextInput
              label={t("common.fullName")}
              placeholder={t("common.fullName")}
              leftSection={<IconUser size={16} />}
              autoComplete="name"
              {...form.getInputProps("fullName")}
            />

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
              autoComplete="new-password"
              {...form.getInputProps("password")}
            />

            <Button type="submit" fullWidth loading={loading} mt="md">
              {t("common.register")}
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center">
          {t("auth.register.hasAccount")}{" "}
          <Anchor component={Link} href="/login" fw={500}>
            {t("common.login")}
          </Anchor>
        </Text>
      </Stack>
    </Paper>
  );
}
