import { Container, Center } from "@mantine/core";
import { RegisterForm } from "@frontend/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <Container size="xs" py={60}>
      <Center>
        <RegisterForm />
      </Center>
    </Container>
  );
}
