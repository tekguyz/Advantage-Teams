import { redirect } from 'next/navigation';

/**
 * Immediate root layout handling that provides clean server-side redirection 
 * straight into the high-density operational overview panel (/dashboard).
 */
export default function RootPage() {
  redirect('/dashboard');
}
