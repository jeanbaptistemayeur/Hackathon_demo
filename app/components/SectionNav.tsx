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
            ? "block font-medium text-gray-700 hover:text-gray-900 transition-colors"
            : "block text-gray-500 hover:text-gray-900 transition-colors"
        }
      >
        {item.label}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="mt-1 ml-3 space-y-1 border-l border-gray-200 pl-3">
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
          className="block font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          {item.label}
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Réduire" : "Développer"}
          className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
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
        <ul className="mt-1 ml-3 space-y-1 border-l border-gray-200 pl-3">
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
    <nav className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <ul className="space-y-2 text-xs">
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
