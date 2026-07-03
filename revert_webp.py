import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

def revert_extension(match):
    # Match will be something like images/dishes/achari_chaap.webp
    path_webp = match.group(0)
    
    # Base path without extension
    base_path = path_webp.rsplit('.', 1)[0]
    
    # Check filesystem for .png or .jpg
    if os.path.exists(base_path + '.png'):
        return base_path + '.png'
    elif os.path.exists(base_path + '.jpg'):
        return base_path + '.jpg'
    elif os.path.exists(base_path + '.jpeg'):
        return base_path + '.jpeg'
    
    # Fallback to .png if neither found (shouldn't happen)
    return base_path + '.png'

# Regex to match paths starting with 'images/' or 'Logo/' ending in .webp
pattern = r"(images|Logo)/[^\"\'\s]+\.webp"

new_html = re.sub(pattern, revert_extension, html, flags=re.IGNORECASE)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Reverted WebP URLs to their original properties.")
