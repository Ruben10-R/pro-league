import { Container, Center } from "@mantine/core";
import { LoginForm } from "@frontend/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Container size="xs" py={60}>
      <Center>
        <LoginForm />
      </Center>
    </Container>
  );
}
