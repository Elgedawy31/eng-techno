"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import { FormField } from "@/components/ui/form-field";

export default function LoginForm() {
  const { login, loading, error: hookError } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-sm">
      <div>
        <h1 className="text-center text-2xl font-bold">Login</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Login to access the dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {hookError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {hookError}
          </div>
        )}

        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          error={errors.email}
          disabled={loading}
          required
          register={register("email")}
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          error={errors.password}
          disabled={loading}
          required
          register={register("password")}
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

