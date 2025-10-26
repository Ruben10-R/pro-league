"use client";

import { useEffect, useState } from "react";
import { Container, Stack, Title, Text, Loader, Center } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useRouter } from "@frontend/i18n/routing";
import { profileService } from "@frontend/lib/api/profile";
import { authService } from "@frontend/lib/api/auth";
import { AuthenticatedLayout } from "@frontend/components/layout/AuthenticatedLayout";
import { UpdateProfileForm } from "@frontend/components/profile/UpdateProfileForm";
import { ChangePasswordForm } from "@frontend/components/profile/ChangePasswordForm";
import type { IUser } from "@pro-league/shared";

export default function ProfilePage() {
  const t = useTranslations();
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    // Check if authenticated
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    try {
      const response = await profileService.getProfile();

      if (response.success) {
        setUser(response.data);
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(response.data));
      } else {
        // Unauthorized, redirect to login
        router.push("/login");
      }
    } catch (error) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedUser: IUser) => {
    setUser(updatedUser);
    // Also update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <Container size="md" py={60}>
          <Center>
            <Loader size="lg" />
          </Center>
        </Container>
      </AuthenticatedLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuthenticatedLayout>
      <Container size="md" py={60}>
        <Stack gap="xl">
          <div>
            <Title order={1}>{t("profile.title")}</Title>
            <Text size="lg" c="dimmed">
              {t("profile.subtitle")}
            </Text>
          </div>

          <UpdateProfileForm user={user} onUpdate={handleProfileUpdate} />

          <ChangePasswordForm />
        </Stack>
      </Container>
    </AuthenticatedLayout>
  );
}
