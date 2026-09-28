'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Avatar, Button, Card, Checkbox, Link, Spinner } from '@heroui/react';

import { PasswordField, TextField } from '@/components/composites';
import { useSignInMutation } from '@/store/services/auth';
import { AlternativeSign } from '@/widgets/auth';

import { signInSchema } from './sign-in.schema';
import type { SignInSchemaInput } from './sign-in.schema';

export default function SignInPage() {
  const [signIn, { isLoading }] = useSignInMutation();
  const form = useForm<SignInSchemaInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = (data: SignInSchemaInput) => {
    void signIn(data)
      .unwrap()
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-[400px]">
            <Card.Header className="flex flex-col items-center gap-2">
              <Avatar />
              <div className="flex flex-col items-center">
                <Card.Title>Entrar</Card.Title>
                <Card.Description>Digite seu email e senha para entrar no sistema</Card.Description>
              </div>
            </Card.Header>
            <Card.Content className="flex flex-col gap-4">
              <fieldset className="flex flex-col gap-2">
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      errorMessage={fieldState.error?.message}
                      label="Email"
                      placeholder="Digite seu email"
                      variant="secondary"
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <PasswordField
                      {...field}
                      errorMessage={fieldState.error?.message}
                      label="Senha"
                      placeholder="Digite sua senha"
                      variant="secondary"
                    />
                  )}
                />
                <div className="flex items-center justify-between">
                  <Checkbox id="remember-me" variant="secondary">
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Content className="text-sm">Lembrar-me</Checkbox.Content>
                  </Checkbox>
                  <Link
                    className="text-primary text-muted text-sm no-underline"
                    href="/forgot-password"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </fieldset>
              <Button fullWidth isPending={isLoading} type="submit">
                {isLoading ? <Spinner className="size-4" color="current" /> : 'Entrar'}
              </Button>

              <AlternativeSign />
            </Card.Content>
            <Card.Footer className="justify-center">
              <p className="text-muted text-center text-sm">
                © 2026 - Todos os direitos reservados
              </p>
            </Card.Footer>
          </Card>
        </form>
      </div>
    </div>
  );
}
