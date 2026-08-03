import { config } from "dotenv";
import { Pool } from "pg";
import { mockBlogArticles } from "../../src/infrastructure/data/mock-blog-articles";
import { mockStatistics } from "../../src/infrastructure/data/mock-statistics";

config({ path: ".env.local", quiet: true });
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required.");
const databaseHost = new URL(connectionString).hostname;
const isLocalDatabase = ["localhost", "127.0.0.1", "::1"].includes(databaseHost);
if (!isLocalDatabase && process.env.ALLOW_REMOTE_DEMO_SEED !== "true") {
  throw new Error("Remote content seed blocked. Set ALLOW_REMOTE_DEMO_SEED=true only for an intentional demo seed.");
}

const pool = new Pool({ connectionString });
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
    await client.query("COMMIT");
    console.log(`Seeded ${mockStatistics.length} statistics and ${mockBlogArticles.length} blog articles.`);
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
}

void seed()
  .finally(() => pool.end())
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
