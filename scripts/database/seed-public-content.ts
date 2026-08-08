import { config } from "dotenv";
import { Pool } from "pg";
import { mockBlogArticles } from "../../src/infrastructure/data/mock-blog-articles";
import { mockStatistics } from "../../src/infrastructure/data/mock-statistics";
import { mockProperties } from "../../src/infrastructure/data/mock-properties";
import { createMockPropertyDetail } from "../../src/infrastructure/data/mock-property-details";
import { SERVICE_CATALOG_SEED } from "../../src/infrastructure/data/service-catalog-seed";
import { SUPPORT_CATEGORIES_SEED, SUPPORT_FAQS_SEED } from "../../src/infrastructure/data/support-content-seed";
import {
  INVESTASI_AREA_ANALYSIS,
  INVESTASI_BROKER,
  INVESTASI_CATEGORIES,
  INVESTASI_FEATURES,
  INVESTASI_INFRASTRUCTURE,
  INVESTASI_LISTINGS,
  INVESTASI_OPPORTUNITIES,
  INVESTASI_SCORE_METRICS,
  INVESTASI_SIMILAR,
} from "../../src/infrastructure/data/investasi-content-seed";

config({ path: ".env.local", quiet: true });
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required.");
const databaseHost = new URL(connectionString).hostname;
const isLocalDatabase = ["localhost", "127.0.0.1", "::1"].includes(databaseHost);
if (!isLocalDatabase && process.env.ALLOW_REMOTE_DEMO_SEED !== "true") {
  throw new Error("Remote content seed blocked. Set ALLOW_REMOTE_DEMO_SEED=true only for an intentional demo seed.");
}

const pool = new Pool({ connectionString });

const GALLERY_FALLBACK = [
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200&h=900&fit=crop",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=900&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop",
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const [index, statistic] of mockStatistics.entries()) {
      await client.query(`INSERT INTO content.site_statistics (id,label,value,icon,display_order) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO UPDATE SET label=EXCLUDED.label,value=EXCLUDED.value,icon=EXCLUDED.icon,display_order=EXCLUDED.display_order,updated_at=now()`, [statistic.id, statistic.label, statistic.value, statistic.icon, index]);
    }

    for (const article of mockBlogArticles) {
      await client.query(`INSERT INTO content.blog_articles (slug,title,excerpt,category,author,published_at,reading_minutes,cover_image_url,cover_image_alt,is_featured) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title,excerpt=EXCLUDED.excerpt,category=EXCLUDED.category,author=EXCLUDED.author,published_at=EXCLUDED.published_at,reading_minutes=EXCLUDED.reading_minutes,cover_image_url=EXCLUDED.cover_image_url,cover_image_alt=EXCLUDED.cover_image_alt,is_featured=EXCLUDED.is_featured`, [article.slug,article.title,article.excerpt,article.category,article.author,article.publishedAt,article.readingMinutes,article.coverImageUrl,article.coverImageAlt,article.isFeatured]);
    }
    for (const article of mockBlogArticles) {
      await client.query("DELETE FROM content.blog_sections WHERE article_slug=$1", [article.slug]);
      await client.query("DELETE FROM content.blog_related_articles WHERE article_slug=$1", [article.slug]);
      for (const [position, section] of article.sections.entries()) await client.query(`INSERT INTO content.blog_sections (article_slug,position,heading,paragraphs,points,callout) VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6)`, [article.slug,position,section.heading,JSON.stringify(section.paragraphs),section.points ? JSON.stringify(section.points) : null,section.callout ?? null]);
      for (const [position, relatedSlug] of article.relatedSlugs.entries()) await client.query(`INSERT INTO content.blog_related_articles (article_slug,related_slug,position) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`, [article.slug,relatedSlug,position]);
    }

    for (const property of mockProperties) {
      const detail = createMockPropertyDetail(property);
      const gallery = Array.from(new Set([property.imageUrl, ...GALLERY_FALLBACK])).slice(0, 3);

      await client.query(
        `INSERT INTO content.properties (id,title,city,province,price_amount,area_sqm,certificate,badge,image_url,is_favorited,description,dimensions,zoning,road_access,legal_status,address,facilities,listed_at,contact_label,is_published)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17::jsonb,$18,$19,true)
         ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,city=EXCLUDED.city,province=EXCLUDED.province,price_amount=EXCLUDED.price_amount,area_sqm=EXCLUDED.area_sqm,certificate=EXCLUDED.certificate,badge=EXCLUDED.badge,image_url=EXCLUDED.image_url,description=EXCLUDED.description,dimensions=EXCLUDED.dimensions,zoning=EXCLUDED.zoning,road_access=EXCLUDED.road_access,legal_status=EXCLUDED.legal_status,address=EXCLUDED.address,facilities=EXCLUDED.facilities,listed_at=EXCLUDED.listed_at,contact_label=EXCLUDED.contact_label,updated_at=now()`,
        [
          property.id,
          property.title,
          property.location.city,
          property.location.province,
          property.price.toNumber(),
          property.area.toNumber(),
          property.certificate,
          property.badge,
          property.imageUrl,
          property.isFavorited,
          detail.description,
          detail.dimensions,
          detail.zoning,
          detail.roadAccess,
          detail.legalStatus,
          detail.address,
          JSON.stringify(detail.facilities),
          detail.listedAt,
          detail.contactLabel,
        ],
      );

      await client.query("DELETE FROM content.property_images WHERE property_id=$1", [property.id]);
      for (const [position, imageUrl] of gallery.entries()) {
        await client.query(`INSERT INTO content.property_images (property_id,image_url,position) VALUES ($1,$2,$3)`, [property.id, imageUrl, position]);
      }
    }

    const demoUserResult = await client.query(`SELECT id FROM auth.users WHERE email='demo.user@kurata.test'`);
    if ((demoUserResult.rowCount ?? 0) > 0) {
      const demoUserId = demoUserResult.rows[0].id;
      await client.query("DELETE FROM content.user_favorites WHERE user_id=$1", [demoUserId]);
      for (const propertyId of ["prop-001", "prop-006"]) {
        await client.query(`INSERT INTO content.user_favorites (user_id,property_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [demoUserId, propertyId]);
      }
    }

    const demoBrokerResult = await client.query(`SELECT id FROM auth.users WHERE email='broker.user@kurata.test'`);
    if ((demoBrokerResult.rowCount ?? 0) > 0) {
      const demoBrokerId = demoBrokerResult.rows[0].id;
      await client.query(`UPDATE content.properties SET listed_by=$1 WHERE badge='broker'`, [demoBrokerId]);
    }

    const sections: Array<{ id: string; section: string; content: unknown; position: number }> = [
      ...SERVICE_CATALOG_SEED.map((service, index) => ({
        id: `service-${service.id}`,
        section: "services",
        content: service,
        position: index,
      })),
      ...SUPPORT_CATEGORIES_SEED.map((category, index) => ({
        id: `faq-category-${category.id}`,
        section: "faq-categories",
        content: category,
        position: index,
      })),
      ...SUPPORT_FAQS_SEED.map((faq, index) => ({
        id: `faq-${faq.id}`,
        section: "faqs",
        content: faq,
        position: index,
      })),
      { id: "investasi-categories", section: "investasi", content: INVESTASI_CATEGORIES, position: 0 },
      { id: "investasi-listings", section: "investasi", content: INVESTASI_LISTINGS, position: 1 },
      { id: "investasi-features", section: "investasi", content: INVESTASI_FEATURES, position: 2 },
      { id: "investasi-opportunities", section: "investasi", content: INVESTASI_OPPORTUNITIES, position: 3 },
      { id: "investasi-area-analysis", section: "investasi", content: INVESTASI_AREA_ANALYSIS, position: 4 },
      { id: "investasi-infrastructure", section: "investasi", content: INVESTASI_INFRASTRUCTURE, position: 5 },
      { id: "investasi-similar", section: "investasi", content: INVESTASI_SIMILAR, position: 6 },
      { id: "investasi-score-metrics", section: "investasi", content: INVESTASI_SCORE_METRICS, position: 7 },
      { id: "investasi-broker", section: "investasi", content: INVESTASI_BROKER, position: 8 },
    ];

    for (const section of sections) {
      await client.query(
        `INSERT INTO content.content_sections (id,section,content,position,is_published) VALUES ($1,$2,$3::jsonb,$4,true)
         ON CONFLICT (id) DO UPDATE SET section=EXCLUDED.section,content=EXCLUDED.content,position=EXCLUDED.position,is_published=true,updated_at=now()`,
        [section.id, section.section, JSON.stringify(section.content), section.position],
      );
    }

    await client.query("COMMIT");
    console.log(`Seeded ${mockStatistics.length} statistics, ${mockBlogArticles.length} blog articles, ${mockProperties.length} properties, and ${sections.length} content sections.`);
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
}

void seed()
  .finally(() => pool.end())
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
