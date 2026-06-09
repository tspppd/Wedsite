// import {
//   Heart,
//   Eye,
//   Edit3,
//   Users,
//   MessageSquare,
//   Settings,
// } from "lucide-react";

interface navbarItem {
  id: string;
  name: string;
  href: string;
  icon?: React.ReactNode;
  children?: navbarItem[];
}

export const navbarItems: navbarItem[] = [
  {
    id: "designs",
    name: "Designs",
    href: "/designs",
  },
  {
    id: "features",
    name: "Features",
    href: "/features",
  },
  {
    id: "pricing",
    name: "Pricing",
    href: "/pricing",
  },
  {
    id: "signin",
    name: "Sign In",
    href: "/login",
  },
  {
    id: "messages",
    name: "Messages",
    href: "/dashboard/messages",
  },
  {
    id: "settings",
    name: "Settings",
    href: "/dashboard/settings",
    children: [
      {
        id: "language",
        name: "Language Settings",
        href: "/dashboard/settings/language",
      },
      {
        id: "theme",
        name: "Theme Settings",
        href: "/dashboard/settings/theme",
      },
      {
        id: "logout",
        name: "Logout",
        href: "",
      },
    ],
  },
];
