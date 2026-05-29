import Link from "next/link";
type MenuItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  open: boolean;
  active?: boolean;
  danger?: boolean;
};

const MenuItem = ({
  href,
  icon,
  label,
  open,
  active,
  danger,
}: MenuItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
    ${
      danger
        ? "text-red-500 hover:bg-red-50"
        : active
        ? "bg-blue-50 text-blue-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {icon}
    {open && <span>{label}</span>}
  </Link>
);
