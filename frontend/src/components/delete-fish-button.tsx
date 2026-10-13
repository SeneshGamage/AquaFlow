"use client";

import { Trash2 } from "lucide-react";
import { deleteFishAction } from "@/app/actions/fish";

export function DeleteFishButton({ id, name }: { id: number; name: string }) {
  return (
    <form
      action={deleteFishAction}
      onSubmit={(e) => {
        if (!window.confirm(`Remove "${name}" from the catalog?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        aria-label={`Delete ${name}`}
        className="rounded-lg border border-red-200 p-2 text-red-700 transition hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}