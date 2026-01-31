# Update Navbar Script
# This script updates all HTML files with the new left-side profile navbar

$navbarHTML = @'
  <!-- Navbar -->
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Profile Icon (Left Side) -->
      <div class="navbar-profile-left">
        <div class="profile-trigger">
          <div class="profile-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
        <div class="profile-dropdown">
          <!-- Before Login -->
          <a href="auth/user/login.html" class="dropdown-item auth-only">Login</a>
          <a href="auth/user/signup.html" class="dropdown-item auth-only">Sign Up</a>
          <!-- After Login (User) -->
          <a href="about.html" class="dropdown-item user-only" style="display: none;">Dashboard</a>
          <!-- After Login (Admin) -->
          <a href="about.html" class="dropdown-item admin-only" style="display: none;">Admin Dashboard</a>
          <!-- Logout (Both) -->
          <a href="#" class="dropdown-item logged-in-only" style="display: none;" onclick="handleLogout()">Logout</a>
        </div>
      </div>

      <a href="index.html" class="navbar-logo">
        Story<span>Grid</span>
      </a>

      <ul class="navbar-menu">
        <li><a href="index.html" class="navbar-link">Home</a></li>
        <li><a href="category1.html" class="navbar-link">Technology</a></li>
        <li><a href="category2.html" class="navbar-link">Culture</a></li>
        <li><a href="category3.html" class="navbar-link">Business</a></li>
        <li><a href="category4.html" class="navbar-link">Travel</a></li>
        <li><a href="category5.html" class="navbar-link">Health</a></li>
        <li><a href="category6.html" class="navbar-link">Design</a></li>
        <li><a href="featured.html" class="navbar-link">Featured</a></li>
        <li><a href="latest.html" class="navbar-link">Latest</a></li>
        <li><a href="blog.html" class="navbar-link">Blog</a></li>
        <li><a href="contact.html" class="navbar-link">Contact</a></li>
      </ul>

      <button class="navbar-toggle">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
'@

Write-Host "Navbar update template created successfully!" -ForegroundColor Green
Write-Host "Note: Manual update recommended for each page to preserve active states" -ForegroundColor Yellow
