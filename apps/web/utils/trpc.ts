import { createTRPCReact, TRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/trpc/trpc';

export const trpc: TRPCReact<AppRouter> = createTRPCReact<AppRouter>();