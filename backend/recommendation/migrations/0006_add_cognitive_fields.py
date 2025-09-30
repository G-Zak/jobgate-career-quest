# Generated manually to add cognitive recommendation fields

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recommendation', '0005_merge_20250929_0118'),
    ]

    operations = [
        # Add missing fields to JobRecommendation using SQL to avoid conflicts
        migrations.RunSQL(
            """
            DO $$
            BEGIN
                -- Add technical_test_score if it doesn't exist
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_name='recommendation_jobrecommendation' AND column_name='technical_test_score') THEN
                    ALTER TABLE recommendation_jobrecommendation ADD COLUMN technical_test_score DOUBLE PRECISION DEFAULT 0.0;
                END IF;

                -- Add experience_score if it doesn't exist
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_name='recommendation_jobrecommendation' AND column_name='experience_score') THEN
                    ALTER TABLE recommendation_jobrecommendation ADD COLUMN experience_score DOUBLE PRECISION DEFAULT 0.0;
                END IF;

                -- Add salary_score if it doesn't exist
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_name='recommendation_jobrecommendation' AND column_name='salary_score') THEN
                    ALTER TABLE recommendation_jobrecommendation ADD COLUMN salary_score DOUBLE PRECISION DEFAULT 0.0;
                END IF;

                -- Add location_score if it doesn't exist
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_name='recommendation_jobrecommendation' AND column_name='location_score') THEN
                    ALTER TABLE recommendation_jobrecommendation ADD COLUMN location_score DOUBLE PRECISION DEFAULT 0.0;
                END IF;

                -- Add cluster_fit_score if it doesn't exist
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_name='recommendation_jobrecommendation' AND column_name='cluster_fit_score') THEN
                    ALTER TABLE recommendation_jobrecommendation ADD COLUMN cluster_fit_score DOUBLE PRECISION DEFAULT 0.0;
                END IF;

                -- Add breakdown if it doesn't exist
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_name='recommendation_jobrecommendation' AND column_name='breakdown') THEN
                    ALTER TABLE recommendation_jobrecommendation ADD COLUMN breakdown JSONB DEFAULT '{}';
                END IF;

                -- Add computed_at if it doesn't exist
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_name='recommendation_jobrecommendation' AND column_name='computed_at') THEN
                    ALTER TABLE recommendation_jobrecommendation ADD COLUMN computed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
                END IF;

                -- Add weights_snapshot_id if it doesn't exist
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_name='recommendation_jobrecommendation' AND column_name='weights_snapshot_id') THEN
                    ALTER TABLE recommendation_jobrecommendation ADD COLUMN weights_snapshot_id VARCHAR(50) NULL;
                END IF;

                -- Add source_snapshot_id if it doesn't exist
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_name='recommendation_jobrecommendation' AND column_name='source_snapshot_id') THEN
                    ALTER TABLE recommendation_jobrecommendation ADD COLUMN source_snapshot_id VARCHAR(50) NULL;
                END IF;

                -- Add missing fields to JobOffer
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_name='recommendation_joboffer' AND column_name='currency') THEN
                    ALTER TABLE recommendation_joboffer ADD COLUMN currency VARCHAR(3) DEFAULT 'MAD';
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_name='recommendation_joboffer' AND column_name='source_type') THEN
                    ALTER TABLE recommendation_joboffer ADD COLUMN source_type VARCHAR(50) DEFAULT 'manual';
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                              WHERE table_name='recommendation_joboffer' AND column_name='source_id') THEN
                    ALTER TABLE recommendation_joboffer ADD COLUMN source_id VARCHAR(100) NULL;
                END IF;
            END $$;
            """,
            reverse_sql="-- No reverse needed"
        ),
    ]
