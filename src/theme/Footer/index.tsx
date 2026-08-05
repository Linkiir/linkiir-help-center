import type {ReactNode} from 'react';
import styles from './styles.module.css';

/**
 * Replaces the classic theme Footer so the help center carries the same footer
 * as linkiir.com (brand block, Solutions / Company / Legal, registration line).
 *
 * Column headings, links and the copyright line deliberately reuse the Infima
 * class names (`footer__title`, `footer__link-item`, `footer__copyright`) so the
 * Linkiir theme stylesheet keeps styling them — mono uppercase headings, light
 * grey links, mono uppercase registration line. Only layout lives in the CSS
 * module.
 *
 * Because this component supplies the footer, there is no `themeConfig.footer`
 * entry; editing the footer means editing this file.
 */

const SITE = 'https://linkiir.com';

/**
 * linkiir.com currently ships its LinkedIn icon as `href="#"`, so there is no
 * real URL to point at. Set this to the company page when one exists and the
 * icon renders itself; leaving it null keeps a dead link off the site.
 */
const LINKEDIN_URL: string | null = null;

const CONTACT_EMAIL = 'sales@linkiir.com';

type FooterColumn = {
  heading: string;
  links: {label: string; href: string}[];
};

const COLUMNS: FooterColumn[] = [
  {
    heading: 'Solutions',
    links: [
      {label: 'Linkiir Grid', href: `${SITE}/grid/`},
      {label: 'Linkiir Agent', href: `${SITE}/agent/`},
      {label: 'Linkiir Human', href: `${SITE}/human/`},
    ],
  },
  {
    heading: 'Company',
    links: [
      {label: 'About & founders', href: `${SITE}/about/`},
      {label: 'Contact', href: `${SITE}/contact/`},
    ],
  },
  {
    heading: 'Legal',
    links: [
      {label: 'Terms & Conditions', href: `${SITE}/terms/`},
      {label: 'Privacy', href: `${SITE}/terms/#personal-info`},
      {label: 'Security', href: `${SITE}/terms/#security`},
    ],
  },
];

function BrandMark() {
  return (
    <svg
      className={styles.mark}
      viewBox="0 0 32 24"
      fill="none"
      aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Footer(): ReactNode {
  return (
    <footer className={`footer ${styles.footer}`}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <a
              className={styles.brandLink}
              href={`${SITE}/`}
              aria-label="Linkiir home">
              <BrandMark />
              <span className={styles.wordmark}>linkiir&#174;</span>
            </a>
            <p className={styles.tagline}>
              Integration support &amp; services for healthcare and enterprise
              B2B.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div className={styles.col} key={column.heading}>
              <p className={`footer__title ${styles.colHead}`}>
                {column.heading}
              </p>
              {column.links.map((link) => (
                <a
                  className={`footer__link-item ${styles.colLink}`}
                  href={link.href}
                  key={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <span className={`footer__copyright ${styles.copyright}`}>
            &#169; Linkiir, Inc. &#8212; Registered in Ontario, Canada
          </span>
          <div className={styles.socials}>
            {LINKEDIN_URL && (
              <a
                className={styles.social}
                href={LINKEDIN_URL}
                aria-label="Linkiir on LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.06c.53-1 1.83-2 3.77-2 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.5c0-1.3-.02-3-1.85-3-1.86 0-2.14 1.45-2.14 2.9V21h-4z" />
                </svg>
              </a>
            )}
            <a
              className={styles.social}
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label={`Email ${CONTACT_EMAIL}`}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 7 9-7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
