import { IconSearch } from './icons';

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="sw">
      <div className="sb2">
        <IconSearch size={15} className="icon-muted" />
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
