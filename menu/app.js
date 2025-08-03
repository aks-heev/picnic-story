document.addEventListener('DOMContentLoaded', function () {
  // Navigation pills
  const pills = document.querySelectorAll('.nav-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', function () {
      // Remove active from all
      pills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      // Scroll to correct section
      const section = document.getElementById(this.dataset.section);
      if (section) {
        section.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const val = e.target.value.toLowerCase();
      document.querySelectorAll('.menu-section').forEach(section => {
        let anyVisible = false;
        section.querySelectorAll('.menu-item').forEach(item => {
          if (item.textContent.toLowerCase().includes(val)) {
            item.style.display = '';
            anyVisible = true;
          } else {
            item.style.display = 'none';
          }
        });
        // If no menu-item in this section matched, hide the section
        section.style.display = anyVisible ? '' : 'none';
      });

      // Show all sections if search is cleared
      if (!val) {
        document.querySelectorAll('.menu-section').forEach(section => section.style.display = '');
        document.querySelectorAll('.menu-item').forEach(item => item.style.display = '');
      }
    });
  }
});
