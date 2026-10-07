export function TagList({ tags, label }: { tags: string[]; label: string }) {
  if (tags.length === 0) return null;

  return (
    <ul className="mt-3 flex flex-wrap gap-2" aria-label={label}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full bg-accent-soft px-3 py-1 text-xs leading-5 font-medium text-accent"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
