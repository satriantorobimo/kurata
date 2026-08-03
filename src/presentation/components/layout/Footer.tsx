import Link from "next/link";
import Image from "next/image";

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const FOOTER_GROUPS: FooterLinkGroup[] = [
  {
    title: "Platform",
    links: [
      { label: "Cari Properti", href: "/cari-tanah" },
      { label: "Investasi", href: "/investasi" },
      { label: "Estimasi Harga", href: "/estimasi" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang Kami", href: "/tentang" },
      { label: "Karir", href: "/karir" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Dukungan",
    links: [
      { label: "Pusat Bantuan", href: "/bantuan" },
      { label: "Kontak", href: "/kontak" },
      { label: "Privasi", href: "/privasi" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-primary-container py-section-gap">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-stack-md mb-4">
              <Image
src="/logo-footer.png"
                alt="Kurata Logo"
                width={130}
                height={130}
              />
            </div>
            <p className="text-body-md text-on-primary/80">
              Investasi tanah masa depan dengan transparansi dan keamanan
              legalitas yang terjamin.
            </p>
          </div>

          {/* Link Groups */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-gutter">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col gap-stack-md">
                <span className="font-label-sm text-label-sm text-on-primary uppercase tracking-wider opacity-60">
                  {group.title}
                </span>
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-body-md text-on-primary hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-on-primary/10 text-center text-label-sm text-on-primary/60">
          © {new Date().getFullYear()} Kurata Land Investment. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
