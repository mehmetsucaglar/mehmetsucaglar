import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/events", label: "Etkinlikler" },
  { to: "/admin", label: "Yönetim" },
  { to: "/login", label: "Giriş" },
];

export default function Navigation() {
  return (
    <nav className="menu">
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            {/* NavLink aktif sayfaya otomatik aria-current="page" ekler */}
            <NavLink to={link.to} end={link.to === "/"}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
