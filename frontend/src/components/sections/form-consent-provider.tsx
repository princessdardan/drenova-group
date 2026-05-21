"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PortableTextBlock } from "@portabletext/types";

const FormConsentContext = createContext<PortableTextBlock[] | undefined>(undefined);

interface FormConsentProviderProps {
  children: ReactNode;
  consentText?: PortableTextBlock[];
}

export function FormConsentProvider({ children, consentText }: FormConsentProviderProps) {
  return (
    <FormConsentContext.Provider value={consentText}>
      {children}
    </FormConsentContext.Provider>
  );
}

export function useFormConsentText() {
  return useContext(FormConsentContext);
}
