'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormStatus } from 'react-dom';
import { Loader2, UserPlus } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { signUpAction } from '@/app/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <UserPlus className="mr-2" />}
      Create an account
    </Button>
  );
}

const initialState = {
  success: false,
  error: null,
};

export default function SignupPage() {
  const [state, formAction] = useActionState(signUpAction, initialState);
  const router = useRouter();

  if (state.success) {
    router.push('/profile');
    return null;
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account and join the Reloop community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" name="firstName" placeholder="Max" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" name="lastName" placeholder="Robinson" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label>I am a...</Label>
              <RadioGroup name="userType" defaultValue="Giver" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Giver" id="r1" />
                  <Label htmlFor="r1">Giver</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Maker" id="r2" />
                  <Label htmlFor="r2">Maker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Buyer" id="r3" />
                  <Label htmlFor="r3">Buyer</Label>
                </div>
              </RadioGroup>
            </div>
             {state.error && (
              <Alert variant="destructive">
                <AlertTitle>Signup Failed</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <SubmitButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
