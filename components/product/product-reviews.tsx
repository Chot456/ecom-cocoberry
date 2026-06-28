"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { reviewSchema, type ReviewInput } from "@/lib/validations/review";
import { useReviews, useCreateReview } from "@/lib/hooks/use-reviews";
import { useUser } from "@/lib/hooks/use-user";
import { summarizeRatings } from "@/services/reviews";
import { RatingStars } from "@/components/ui/rating-stars";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useUser();
  const { data: reviews, isLoading } = useReviews(productId);
  const createReview = useCreateReview(productId);
  const [showForm, setShowForm] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  const { average, count } = summarizeRatings(reviews ?? []);
  const alreadyReviewed = reviews?.some((r) => r.user_id === user?.id);

  function onSubmit(data: ReviewInput) {
    if (!user) {
      toast.error("Sign in to write a review.");
      return;
    }
    createReview.mutate(
      { userId: user.id, rating: data.rating, comment: data.comment },
      {
        onSuccess: () => {
          toast.success("Thanks for your review!");
          reset({ rating: 0, comment: "" });
          setShowForm(false);
        },
        onError: () => toast.error("Couldn't submit your review. Please try again."),
      }
    );
  }

  return (
    <div className="mt-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-charcoal dark:text-beige">Customer Reviews</h2>
          {count > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <RatingStars rating={average} />
              <span className="text-sm text-charcoal/60 dark:text-beige/60">
                {average.toFixed(1)} out of 5 ({count} review{count === 1 ? "" : "s"})
              </span>
            </div>
          )}
        </div>
        {user && !alreadyReviewed && (
          <Button variant="outline" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "Write a Review"}
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-xl space-y-4 rounded-2xl bg-blush/40 dark:bg-white/5 p-6">
          <div>
            <p className="mb-1.5 text-sm font-medium text-charcoal dark:text-beige">Your rating</p>
            <Controller
              control={control}
              name="rating"
              render={({ field }) => (
                <RatingStars rating={field.value} size={24} interactive onChange={field.onChange} />
              )}
            />
            {errors.rating && <p className="mt-1 text-xs text-rose-500">{errors.rating.message}</p>}
          </div>
          <div>
            <Textarea placeholder="Share your experience with this product..." {...register("comment")} />
          </div>
          <Button type="submit" disabled={createReview.isPending}>
            {createReview.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}

      <div className="mt-8 space-y-6">
        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}

        {!isLoading && reviews?.length === 0 && (
          <p className="text-sm text-charcoal/60 dark:text-beige/60">
            No reviews yet. Be the first to share your thoughts!
          </p>
        )}

        {reviews?.map((review) => (
          <div key={review.id} className="border-b border-rose-100 dark:border-white/10 pb-6">
            <div className="flex items-center justify-between">
              <p className="font-medium text-charcoal dark:text-beige">
                {review.profiles?.full_name ?? "Cocoberry Customer"}
              </p>
              <span className="text-xs text-charcoal/50 dark:text-beige/50">
                {formatDate(review.created_at)}
              </span>
            </div>
            <RatingStars rating={review.rating} size={14} className="mt-1" />
            {review.comment && (
              <p className="mt-2 text-sm text-charcoal/80 dark:text-beige/80">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
