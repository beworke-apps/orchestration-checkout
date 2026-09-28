import { cookies } from 'next/headers';

import { appConfig } from '@/config/app-config';

export async function getServerAuthToken(): Promise<string | undefined> {
  return (await cookies()).get(appConfig.token)?.value;
}
