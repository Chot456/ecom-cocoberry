"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchInput({
  value,
  onSearch,
}: {
  value?: string;
  onSearch: (value: string) => void;
}) {
  const [term, setTerm] = useState(value ?? "");

  useEffect(() => {
    setTerm(value ?? "");
  }, [value]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(term.trim());
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-3 text-sm font-semibold text-charcoal dark:text-beige">Search</p>
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-beige/40"
        />
        <Input
          type="search"
          placeholder="Search products..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="h-10 pl-9"
        />
      </div>
    </form>
  );
}
