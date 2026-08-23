"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/modules/shared/lib/query-client";
import { GlobalRequestFeedback } from "@/components/providers/GlobalRequestFeedback";

export function AppProviders({ children }: PropsWithChildren) {
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      <GlobalRequestFeedback />
    </QueryClientProvider>
  );
}
