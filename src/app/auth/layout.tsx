import { AuthTemplate } from '@/templates/auth';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthTemplate>{children}</AuthTemplate>;
}
