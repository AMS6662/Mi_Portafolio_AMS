// Ultra simple carousel with video play button support
window.onload = function() {
    
    // Get all carousel containers
    var containers = document.querySelectorAll('.carousel-container');
    
    for (var c = 0; c < containers.length; c++) {
        var container = containers[c];
        var items = container.querySelectorAll('.carousel-item');
        var prev = container.querySelector('.prev');
        var next = container.querySelector('.next');
        var dots = container.querySelectorAll('.dot');
        var current = 0;
        
        
        // Hide all items first
        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('active');
        }
        
        // Show first item
        if (items.length > 0) {
            items[0].classList.add('active');
            if (dots.length > 0) dots[0].classList.add('active-dot');
        }
        
        // Function to update active slide
        function updateSlide(index) {
            // Remove active class from current item and dot
            items[current].classList.remove('active');
            if (dots.length > current) dots[current].classList.remove('active-dot');
            
            // Pause any video in current slide
            var currentVideo = items[current].querySelector('video');
            if (currentVideo) {
                currentVideo.pause();
            }
            
            // Show the play button again if it exists
            var currentPlayBtn = items[current].querySelector('.video-play-btn');
            if (currentPlayBtn) {
                currentPlayBtn.style.display = 'flex';
            }
            
            // Update current index
            current = index;
            
            // Add active class to new item and dot
            items[current].classList.add('active');
            if (dots.length > current) dots[current].classList.add('active-dot');
        }
        
        // Next button functionality
        if (next) {
            next.onclick = function(e) {
                e.preventDefault();
                var newIndex = (current + 1) % items.length;
                updateSlide(newIndex);
            };
        }
        
        // Previous button functionality
        if (prev) {
            prev.onclick = function(e) {
                e.preventDefault();
                var newIndex = (current - 1 + items.length) % items.length;
                updateSlide(newIndex);
            };
        }
        
        // Dot indicators functionality
        for (var d = 0; d < dots.length; d++) {
            dots[d].setAttribute('data-index', d);
            dots[d].onclick = function(e) {
                e.preventDefault();
                var newIndex = parseInt(this.getAttribute('data-index'));
                updateSlide(newIndex);
            };
        }
        
        // Initialize video play buttons for this carousel
        var playButtons = container.querySelectorAll('.video-play-btn');
        
        for (var p = 0; p < playButtons.length; p++) {
            playButtons[p].onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get the video in the same wrapper
                var video = this.parentElement.querySelector('video');
                if (video) {
                    video.play()
                        .then(function() {
                        });
                    this.style.display = 'none'; // Hide play button
                }
            };
        }
        
        // Handle video events
        var videos = container.querySelectorAll('video');
        for (var v = 0; v < videos.length; v++) {
            // When video ends, show play button again
            videos[v].onended = function() {
                var btn = this.parentElement.querySelector('.video-play-btn');
                if (btn) btn.style.display = 'flex';
            };
            
            // When video is paused (not ended), show play button
            videos[v].onpause = function() {
                var btn = this.parentElement.querySelector('.video-play-btn');
                if (btn && this.currentTime < this.duration) {
                    btn.style.display = 'flex';
                }
            };
            
            // When video starts playing, ensure play button is hidden
            videos[v].onplay = function() {
                var btn = this.parentElement.querySelector('.video-play-btn');
                if (btn) btn.style.display = 'none';
            };
        }
    }
    
    // Extra: Make sure videos don't play when not in active slide
    // This runs every time a slide changes
    function pauseInactiveVideos() {
        var allItems = document.querySelectorAll('.carousel-item');
        for (var i = 0; i < allItems.length; i++) {
            var video = allItems[i].querySelector('video');
            if (video && !allItems[i].classList.contains('active')) {
                video.pause();
                // Show play button if it exists
                var btn = allItems[i].querySelector('.video-play-btn');
                if (btn) btn.style.display = 'flex';
            }
        }
    }
    
    // Run every 100ms to catch any videos that might be playing in background
    setInterval(pauseInactiveVideos, 100);
};