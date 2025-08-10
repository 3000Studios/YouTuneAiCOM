    </div><!-- #content -->

    <footer id="colophon" class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. 
                       <?php esc_html_e('All rights reserved.', 'youtuneai'); ?>
                    </p>
                </div>

                <?php if (has_nav_menu('footer')) : ?>
                    <nav class="footer-navigation">
                        <?php
                        wp_nav_menu([
                            'theme_location' => 'footer',
                            'container'      => false,
                            'menu_class'     => 'footer-menu',
                            'depth'          => 1,
                        ]);
                        ?>
                    </nav>
                <?php endif; ?>
            </div>
        </div>
    </footer>
</div><!-- #page -->

<!-- 3D Avatar Chat Bubble (placeholder) -->
<div id="avatar-chat-bubble" class="avatar-chat-bubble" style="display: none;">
    <div class="avatar-container">
        <canvas id="avatar-canvas" width="200" height="200"></canvas>
    </div>
    <div class="chat-container">
        <div id="chat-messages" class="chat-messages"></div>
        <div class="chat-input">
            <input type="text" id="chat-input-field" placeholder="<?php esc_attr_e('Type a message...', 'youtuneai'); ?>">
            <button id="chat-send-btn"><?php esc_html_e('Send', 'youtuneai'); ?></button>
        </div>
    </div>
</div>

<?php wp_footer(); ?>

</body>
</html>