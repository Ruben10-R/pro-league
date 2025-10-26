"use client";

import { useState } from "react";
import { useForm } from "@mantine/form";
import { PasswordInput, Button, Stack, Paper, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconLock, IconCheck, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { profileService } from "@frontend/lib/api/profile";
import type { IChangePassword } from "@pro-league/shared";

export function ChangePasswordForm() {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const form = useForm<IChangePassword>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    validate: {
      currentPassword: (value) =>
        !value
          ? t("validation.required", { field: t("common.currentPassword") })
          : null,
      newPassword: (value) => {
        if (!value) {
          return t("validation.required", { field: t("common.newPassword") });
        }
        return value.length < 8
          ? t("validation.minLength", {
              field: t("common.newPassword"),
              min: 8,
            })
          : null;
      },
    },
  });

  const handleSubmit = async (values: IChangePassword) => {
    setLoading(true);

    try {
      const response = await profileService.changePassword(values);

      if (response.success) {
        notifications.show({
          title: t("profile.changePassword"),
          message: t("profile.passwordChanged"),
          color: "green",
          icon: <IconCheck size={16} />,
        });

        // Reset form
        form.reset();
      } else {
        notifications.show({
          title: t("profile.changePassword"),
          message: t(response.message.key, response.message.params),
          color: "red",
          icon: <IconX size={16} />,
        });
      }
    } catch (error) {
      notifications.show({
        title: t("profile.changePassword"),
        message: t("profile.errors.updateFailed"),
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper withBorder shadow="sm" p="xl" radius="md">
      <Stack gap="lg">
        <Title order={3}>{t("profile.changePassword")}</Title>

        <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
          <Stack gap="md">
            <PasswordInput
              label={t("common.currentPassword")}
              placeholder={t("common.currentPassword")}
              leftSection={<IconLock size={16} />}
              required
              autoComplete="current-password"
              {...form.getInputProps("currentPassword")}
            />

            <PasswordInput
              label={t("common.newPassword")}
              placeholder={t("common.newPassword")}
              leftSection={<IconLock size={16} />}
              required
              autoComplete="new-password"
              {...form.getInputProps("newPassword")}
            />

            <Button type="submit" loading={loading} fullWidth>
              {t("common.save")}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
