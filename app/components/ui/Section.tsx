interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-lg font-semibold border-b pb-2 mb-4">{title}</h2>
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
    <section id={id} className="scroll-mt-8 mt-8">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
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
      <h3 className="text-sm font-medium mt-6 mb-3">{title}</h3>
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
      className="text-xs text-blue-600 hover:underline"
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
      className="text-xs text-red-600 hover:underline pb-2"
    >
      Supprimer
    </button>
  );
}
