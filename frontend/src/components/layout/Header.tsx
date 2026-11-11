import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { useEvents } from "../../context/use-events";
import { findEventById } from "../../utils/filter-events";

interface PageInfo {
  path: string;
  title: string;
  text?: string;
}

const pages: PageInfo[] = [
  { path: "/", title: "Kampüs Etkinlikleri", text: "Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin." },
  { path: "/events", title: "Tüm Etkinlikler", text: "Ekim ayında kampüste düzenlenen etkinlikler." },
  { path: "/admin", title: "Etkinlik Yönetimi" },
  { path: "/admin/new", title: "Etkinlik Ekle" },
  { path: "/login", title: "Giriş Yap" },
  { path: "/register", title: "Kayıt Ol" },
  { path: "/forgot-password", title: "Şifremi Unuttum" },
];

export default function Header() {
  const { pathname } = useLocation();
  const { events } = useEvents();

  const detailMatch = matchPath("/events/:id", pathname);
  const editMatch = matchPath("/admin/:id/edit", pathname);
  const eventId = detailMatch?.params.id ?? editMatch?.params.id;
  const event = eventId ? findEventById(events, eventId) : undefined;
  const page = pages.find((p) => matchPath(p.path, pathname));

  let title = "Sayfa Bulunamadı";
  let text: string | undefined;

  if (page) {
    title = page.title;
    text = page.text;
  } else if (event && detailMatch) {
    title = event.title;
    text = `${event.category} · ${event.location}`;
  } else if (event && editMatch) {
    title = "Etkinlik Güncelle";
    text = event.title;
  }

  useEffect(() => {
    document.title = title === "Kampüs Etkinlikleri" ? title : `${title} — Kampüs Etkinlikleri`;
  }, [title]);

  return (
    <header className="site-baslik">
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </header>
  );
}
