"use client";

import { Menu, Button, rem } from "@mantine/core";
import { IconLanguage, IconCheck } from "@tabler/icons-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@frontend/i18n/routing";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleLanguageChange = (code: string) => {
    router.replace(pathname, { locale: code });
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button variant="default" leftSection={<IconLanguage size={16} />}>
          {currentLanguage?.flag} {currentLanguage?.name}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Select Language</Menu.Label>
        {languages.map((language) => (
          <Menu.Item
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            leftSection={
              <span style={{ fontSize: "1.2rem" }}>{language.flag}</span>
            }
            rightSection={
              locale === language.code ? (
                <IconCheck style={{ width: rem(16), height: rem(16) }} />
              ) : null
            }
          >
            {language.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
