<?php
/**
 * Main template file
 * 
 * @package YouTuneAI
 */

get_header(); ?>

<!-- Deployment Test Indicator -->
<div style="position: fixed; top: 10px; right: 10px; background: #28a745; color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; z-index: 9999; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
    ✅ Auto-Deploy Working - <?php echo date('M d, Y H:i'); ?>
</div>

<main id="main" class="site-main">
    <div class="container">
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <header class="entry-header">
                        <?php the_title('<h1 class="entry-title">', '</h1>'); ?>
                    </header>
                    
                    <div class="entry-content">
                        <?php the_content(); ?>
                    </div>
                </article>
            <?php endwhile; ?>
        <?php else : ?>
            <div class="no-content">
                <h1><?php esc_html_e('Nothing Found', 'youtuneai'); ?></h1>
                <p><?php esc_html_e('It seems we can\'t find what you\'re looking for.', 'youtuneai'); ?></p>
            </div>
        <?php endif; ?>
    </div>
</main>

<?php get_footer(); ?>