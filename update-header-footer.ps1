# PowerShell Script to Update Navbar and Footer in All HTML Files

Write-Host "`n=== NAVBAR AND FOOTER UPDATE SCRIPT ===" -ForegroundColor Cyan
Write-Host "Updating all HTML files with new navbar and footer from index.html`n" -ForegroundColor Green

# Read the navbar and footer from index.html
$indexPath = "index.html"
$indexContent = Get-Content $indexPath -Raw

# Extract navbar (from <!-- Navbar --> to </nav>)
$navbarPattern = '(?s)(\s*<!-- Navbar -->.*?</nav>)'
$navbarMatch = [regex]::Match($indexContent, $navbarPattern)
if ($navbarMatch.Success) {
    $newNavbar = $navbarMatch.Value
    Write-Host "Extracted navbar from index.html" -ForegroundColor Green
} else {
    Write-Host "Failed to extract navbar" -ForegroundColor Red
    exit 1
}

# Extract footer (from <!-- Footer --> to </footer>)
$footerPattern = '(?s)(\s*<!-- Footer -->.*?</footer>)'
$footerMatch = [regex]::Match($indexContent, $footerPattern)
if ($footerMatch.Success) {
    $newFooter = $footerMatch.Value
    Write-Host "Extracted footer from index.html`n" -ForegroundColor Green
} else {
    Write-Host "Failed to extract footer" -ForegroundColor Red
    exit 1
}

# List of files to update (excluding index.html and auth folder files)
$filesToUpdate = @(
    "about.html",
    "admin-dashboard.html",
    "article1.html",
    "article2.html",
    "article3.html",
    "blog-details.html",
    "blog.html",
    "category1.html",
    "category2.html",
    "category3.html",
    "category4.html",
    "category5.html",
    "category6.html",
    "category7.html",
    "contact.html",
    "faq.html",
    "featured.html",
    "latest.html",
    "privacy-policy.html",
    "tos.html",
    "user-dashboard.html"
)

$updatedCount = 0
$errorCount = 0

foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        try {
            $content = Get-Content $file -Raw -Encoding UTF8
            
            # Replace navbar
            $content = $content -replace '(?s)\s*<!-- Navbar -->.*?</nav>', $newNavbar
            
            # Replace footer
            $content = $content -replace '(?s)\s*<!-- Footer -->.*?</footer>', $newFooter
            
            # Write back to file
            $content | Set-Content $file -Encoding UTF8 -NoNewline
            
            Write-Host "Updated: $file" -ForegroundColor Green
            $updatedCount++
        }
        catch {
            Write-Host "Error updating $file : $_" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "`n=== UPDATE COMPLETE ===" -ForegroundColor Cyan
Write-Host "Files updated: $updatedCount" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "Errors: $errorCount" -ForegroundColor Red
}
Write-Host "All pages now have the updated navbar and footer!" -ForegroundColor Green
