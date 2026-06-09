interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="akk-card scroll-mt-24 p-6 akk-fade">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-brand">
        <span className="h-5 w-1.5 rounded-full bg-accent" />
        {title}
      </h2>
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
    <section id={id} className="mt-8 scroll-mt-24 first:mt-0">
      <h3 className="mb-3 border-b border-line pb-2 text-sm font-bold text-brand-medium">
        {title}
      </h3>
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
