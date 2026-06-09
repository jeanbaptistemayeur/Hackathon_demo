"use client";

import { useState } from "react";
import { PTF_SECTIONS, type PtfNavItem } from "./ptf/sections";

function NavLeaf({ item, depth }: { item: PtfNavItem; depth: number }) {
  return (
    <li>
      <a
        href={`#${item.id}`}
        className={
          depth === 0
            ? "block rounded-md px-2 py-1 font-semibold text-brand transition-colors hover:bg-brand/5"
            : "block rounded-md px-2 py-1 text-muted transition-colors hover:bg-brand/5 hover:text-brand"
        }
      >
        {item.label}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="mt-1 ml-3 space-y-1 border-l border-line pl-3">
          {item.children.map((child) => (
            <NavLeaf key={child.id} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function NavDropdown({ item }: { item: PtfNavItem }) {
  const [open, setOpen] = useState(false);

  return (
    <li>
      <div className="flex items-center justify-between gap-2">
        <a
          href={`#${item.id}`}
          className="block flex-1 rounded-md px-2 py-1 font-semibold text-brand transition-colors hover:bg-brand/5"
        >
          {item.label}
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Réduire" : "Développer"}
          className="shrink-0 text-muted transition-colors hover:text-brand"
        >
          <span
            className={`inline-block transition-transform ${
              open ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>
        </button>
      </div>
      {open && item.children && (
        <ul className="mt-1 ml-3 space-y-1 border-l border-line pl-3">
          {item.children.map((child) => (
            <NavLeaf key={child.id} item={child} depth={1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function SectionNav() {
  return (
    <nav className="akk-card sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-4">
      <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-accent-dark">
        Sommaire
      </p>
      <ul className="space-y-1 text-xs">
        {PTF_SECTIONS.map((section) =>
          section.children && section.children.length > 0 ? (
            <NavDropdown key={section.id} item={section} />
          ) : (
            <NavLeaf key={section.id} item={section} depth={0} />
          ),
        )}
      </ul>
    </nav>
  );
}
