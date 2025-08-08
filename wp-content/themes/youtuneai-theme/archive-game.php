<?php
/**
 * Template for Games Archive Page
 * 
 * @package YouTuneAI
 */

get_header(); ?>

<main id="main" class="site-main games-archive">
    <div class="container">
        <header class="page-header">
            <h1 class="page-title"><?php esc_html_e('Games Collection', 'youtuneai'); ?></h1>
            <p class="page-description"><?php esc_html_e('Discover our collection of interactive WebGL, HTML5, and Phaser games.', 'youtuneai'); ?></p>
        </header>

        <?php
        $games_query = new WP_Query([
            'post_type' => 'game',
            'posts_per_page' => 12,
            'post_status' => 'publish',
        ]);

        if ($games_query->have_posts()) : ?>
            <div class="games-grid">
                <?php while ($games_query->have_posts()) : $games_query->the_post(); 
                    $platform = get_post_meta(get_the_ID(), '_game_platform', true);
                    $play_url = get_post_meta(get_the_ID(), '_game_play_url', true);
                ?>
                    <article class="game-card" data-game-id="<?php the_ID(); ?>" data-platform="<?php echo esc_attr($platform); ?>">
                        <div class="game-thumbnail">
                            <?php if (has_post_thumbnail()) : ?>
                                <?php the_post_thumbnail('medium'); ?>
                            <?php else : ?>
                                <div class="placeholder-thumbnail">
                                    <span class="game-icon">🎮</span>
                                </div>
                            <?php endif; ?>
                            <div class="game-overlay">
                                <?php if ($play_url) : ?>
                                    <a href="<?php echo esc_url($play_url); ?>" class="play-button" target="_blank">
                                        <span class="play-icon">▶</span>
                                        <?php esc_html_e('Play Now', 'youtuneai'); ?>
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <div class="game-content">
                            <h3 class="game-title">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h3>
                            
                            <?php if ($platform) : ?>
                                <div class="game-platform">
                                    <span class="platform-badge platform-<?php echo esc_attr($platform); ?>">
                                        <?php echo esc_html(ucfirst($platform)); ?>
                                    </span>
                                </div>
                            <?php endif; ?>
                            
                            <div class="game-excerpt">
                                <?php the_excerpt(); ?>
                            </div>
                            
                            <div class="game-genres">
                                <?php
                                $genres = get_the_terms(get_the_ID(), 'game_genre');
                                if ($genres && !is_wp_error($genres)) {
                                    foreach ($genres as $genre) {
                                        echo '<span class="genre-tag">' . esc_html($genre->name) . '</span>';
                                    }
                                }
                                ?>
                            </div>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <?php
            // Pagination
            the_posts_pagination([
                'prev_text' => '← ' . __('Previous', 'youtuneai'),
                'next_text' => __('Next', 'youtuneai') . ' →',
            ]);
            ?>
        <?php else : ?>
            <div class="no-games-found">
                <h2><?php esc_html_e('No Games Found', 'youtuneai'); ?></h2>
                <p><?php esc_html_e('Check back soon for new games!', 'youtuneai'); ?></p>
            </div>
        <?php endif; 
        
        wp_reset_postdata();
        ?>
    </div>
</main>

<style>
.games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin: 40px 0;
}

.game-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.game-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.game-thumbnail {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
}

.game-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.placeholder-thumbnail {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #6C5CE7, #00D1B2);
    color: white;
    font-size: 48px;
}

.game-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.game-card:hover .game-overlay {
    opacity: 1;
}

.play-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #6C5CE7;
    color: white;
    padding: 12px 24px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.3s ease;
}

.play-button:hover {
    background: #5a48d4;
    color: white;
}

.game-content {
    padding: 20px;
}

.game-title {
    margin: 0 0 10px 0;
}

.game-title a {
    color: #2d3748;
    text-decoration: none;
}

.game-title a:hover {
    color: #6C5CE7;
}

.platform-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.platform-webgl { background: #e6fffa; color: #00b894; }
.platform-html5 { background: #fff5e6; color: #fd7900; }
.platform-phaser { background: #f0f8ff; color: #0071e3; }

.genre-tag {
    display: inline-block;
    padding: 2px 8px;
    background: #f1f5f9;
    color: #64748b;
    border-radius: 12px;
    font-size: 12px;
    margin-right: 5px;
    margin-top: 5px;
}
</style>

<?php get_footer(); ?>