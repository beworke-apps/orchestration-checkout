import z from 'zod';

export const signInSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
  password: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
  // .regex(/[A-Z]/, { message: 'Senha deve conter pelo menos uma letra maiúscula' })
  // .regex(/[a-z]/, { message: 'Senha deve conter pelo menos uma letra minúscula' })
  // .regex(/[0-9]/, { message: 'Senha deve conter pelo menos um número' })
  // .regex(/[!@#$%^&*]/, { message: 'Senha deve conter pelo menos um caractere especial' }),
});

export type SignInSchemaInput = z.input<typeof signInSchema>;
export type SignInSchemaOutput = z.output<typeof signInSchema>;
