"use client";

import { useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button, Stack, Paper, Title, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconUser, IconCheck, IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { profileService } from "@frontend/lib/api/profile";
import type { IUpdateProfile, IUser } from "@pro-league/shared";

interface UpdateProfileFormProps {
  user: IUser;
  onUpdate: (user: IUser) => void;
}

export function UpdateProfileForm({ user, onUpdate }: UpdateProfileFormProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const form = useForm<IUpdateProfile>({
    initialValues: {
      fullName: user.fullName || "",
    },
    validate: {
      fullName: (value) => {
        if (!value || value.trim() === "") {
          return null;
        } // Optional
        return value.length < 2
          ? t("validation.minLength", { field: t("common.fullName"), min: 2 })
          : null;
      },
    },
  });

  const handleSubmit = async (values: IUpdateProfile) => {
    setLoading(true);

    try {
      const response = await profileService.updateProfile(values);

      if (response.success) {
        notifications.show({
          title: t("profile.updateProfile"),
          message: t("profile.updated"),
          color: "green",
          icon: <IconCheck size={16} />,
        });

        // Update parent component
        onUpdate(response.data);
      } else {
        notifications.show({
          title: t("profile.updateProfile"),
          message: t(response.message.key, response.message.params),
          color: "red",
          icon: <IconX size={16} />,
        });
      }
    } catch (error) {
      notifications.show({
        title: t("profile.updateProfile"),
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
        <div>
          <Title order={3}>{t("profile.updateProfile")}</Title>
          <Text size="sm" c="dimmed">
            {t("common.email")}: {user.email}
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

            <Button type="submit" loading={loading} fullWidth>
              {t("common.save")}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
