// Projects page - Category filtering functionality
(function() {
    'use strict';
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    function filterProjects(filter) {
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || filter === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update button states
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    function handleFilterClick(e) {
        const filter = e.target.dataset.filter;
        filterProjects(filter);
    }
    
    function initFilter() {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', handleFilterClick);
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFilter);
    } else {
        initFilter();
    }
})();