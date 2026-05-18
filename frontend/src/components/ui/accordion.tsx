"use client";

import { useState } from "react";

interface AccordionItem {
  _key?: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const itemKey = item._key ?? `item-${i}`;
        const panelId = `accordion-panel-${itemKey}`;
        return (
          <div key={itemKey}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between py-5 text-left cursor-pointer"
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span className="text-base font-semibold pr-4">{item.question}</span>
              <span
                className="shrink-0 text-muted transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                aria-hidden="true"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              className="grid transition-[grid-template-rows] duration-200"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-muted leading-7">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
