import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Hero Section
html = html.replace(
    'Authentic North Indian &nbsp;•&nbsp; Punjabi &nbsp;•&nbsp; Chinese',
    'Authentic North Indian &nbsp;•&nbsp; Punjabi &nbsp;•&nbsp; Chinese - The best food in Nakodar'
)

# 2. About Section
html = html.replace(
    'celebrated as the top <strong>family restaurant</strong> in the city.',
    'celebrated as the top <strong>family restaurant</strong> in the city, serving the <strong>best food in Nakodar</strong>.'
)

# 3. Menu Section Header
html = html.replace(
    'Add items to your cart, then choose how you want to order',
    'Add items to your cart, then choose how you want to order the best food in Nakodar'
)

# 4. Footer Section (Adding a small SEO blurb below the contact info)
html = html.replace(
    '<p>📍 <a href="https://wa.me/918699081813">WhatsApp Us</a></p></div>',
    '<p>📍 <a href="https://wa.me/918699081813">WhatsApp Us</a></p><p style="margin-top:10px; font-size:0.85rem; color:#bbb;">Proudly serving the best food in Nakodar.</p></div>'
)

# 5. Review Section Subtitle (if it exists)
html = html.replace(
    'See what our customers are saying',
    'See what our customers are saying about the best food in Nakodar'
)

# 6. Order Section Subtitle (if it exists)
html = html.replace(
    'Choose your preferred way to enjoy our food',
    'Choose your preferred way to enjoy the best food in Nakodar'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Text SEO optimization complete.")
