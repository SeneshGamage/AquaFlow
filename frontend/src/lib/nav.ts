import type { Role } from "@/lib/types";

export interface NavLink {
  href: string;
  label: string;
}

/** Links shown in the navbar for each role. Add a link here when its page exists. */
export const NAV_LINKS: Record<Role, NavLink[]> = {
  ADMIN: [{ href: "/admin/users", label: "Users" }],
  OWNER: [{ href: "/owner/dashboard", label: "Dashboard" }],
  SUPPLIER: [{ href: "/supplier/orders", label: "Orders" }],
  BUYER: [{ href: "/buyer/catalog", label: "Fish Catalog" }],
};