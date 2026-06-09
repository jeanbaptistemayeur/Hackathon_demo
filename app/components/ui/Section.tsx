interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="akk-doc-section scroll-mt-24">
      <h2 className="akk-doc-section-title">{title}</h2>
      {children}
    </section>
  );
}

interface SubSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function SubSection({ id, title, children }: SubSectionProps) {
  return (
    <section id={id} className="akk-doc-subsection scroll-mt-24">
      <h3 className="akk-doc-subsection-title">{title}</h3>
      {children}
    </section>
  );
}

interface SubGroupProps {
  title: string;
  children: React.ReactNode;
}

export function SubGroup({ title, children }: SubGroupProps) {
  return (
    <>
      <h3 className="mb-3 mt-6 text-sm font-semibold text-ink first:mt-0">
        {title}
      </h3>
      {children}
    </>
  );
}

interface AddButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function AddButton({ onClick, children }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-brand/20 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10"
    >
      {children}
    </button>
  );
}

interface RemoveButtonProps {
  onClick: () => void;
}

export function RemoveButton({ onClick }: RemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error/10"
    >
      Supprimer
    </button>
  );
}
