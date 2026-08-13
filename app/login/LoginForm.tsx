"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { loginSchema, LoginInput } from "@/validations/auth.schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        toast.error(res.error.message || "Invalid email or password. Please try again.");
      } else {
        toast.success("Signed in successfully!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Email address"
        type="email"
        placeholder="admin@jobsorbit.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full"
      >
        Sign in
      </Button>
    </form>
  );
}
