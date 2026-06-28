"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { newsletterSchema, type NewsletterInput } from "@/lib/validations/review";
import { useSubscribeNewsletter } from "@/lib/hooks/use-newsletter";
import { Button } from "@/components/ui/button";

export function NewsletterForm({ light = false }: { light?: boolean }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
  });
  const subscribe = useSubscribeNewsletter();

  function onSubmit(data: NewsletterInput) {
    subscribe.mutate(data.email, {
      onSuccess: () => {
        toast.success("You're on the list! Welcome to Cocoberry.");
        reset();
      },
      onError: () => toast.error("Something went wrong. Please try again."),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
      <div className="flex gap-2">
        <input
          {...register("email")}
          type="email"
          placeholder="Enter your email"
          className={
            light
              ? "flex-1 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              : "flex-1 rounded-full border border-rose-200 bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          }
        />
        <Button type="submit" variant={light ? "gold" : "primary"} disabled={subscribe.isPending}>
          Subscribe
        </Button>
      </div>
      {errors.email && <p className="mt-2 text-xs text-rose-300">{errors.email.message}</p>}
    </form>
  );
}
