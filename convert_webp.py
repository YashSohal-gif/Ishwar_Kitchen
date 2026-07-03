import os
from PIL import Image
import re

directories = ['images', 'Logo']
image_extensions = ('.png', '.jpg', '.jpeg')

# 1. Convert Images to WebP
converted_files = 0
saved_bytes = 0

for directory in directories:
    if not os.path.exists(directory):
        continue
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(image_extensions):
                file_path = os.path.join(root, file)
                
                # Check if it's already a webp file (just in case)
                if file.lower().endswith('.webp'):
                    continue
                    
                # Create the new filename with .webp
                file_base = os.path.splitext(file_path)[0]
                webp_path = file_base + '.webp'
                
                try:
                    # Open the image
                    img = Image.open(file_path)
                    # Convert RGBA to RGB for JPEG-like webp saving if needed, but WebP supports alpha natively
                    # Save as WebP
                    original_size = os.path.getsize(file_path)
                    img.save(webp_path, 'webp', quality=80)
                    new_size = os.path.getsize(webp_path)
                    
                    saved_bytes += (original_size - new_size)
                    converted_files += 1
                    
                    # Optionally delete the original file to save space, but let's keep it for now as a backup.
                except Exception as e:
                    print(f"Error converting {file_path}: {e}")

print(f"Converted {converted_files} images to WebP.")
print(f"Total space saved: {saved_bytes / (1024 * 1024):.2f} MB")

# 2. Update index.html to use the new .webp extensions
if os.path.exists('index.html'):
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # We will replace any instance of images/xxx.png or images/xxx.jpg with images/xxx.webp
    # We will also do it for Logo/xxx.png and Logo/xxx.jpg
    
    def replace_extension(match):
        path = match.group(0)
        return re.sub(r'\.(png|jpg|jpeg)$', '.webp', path, flags=re.IGNORECASE)

    # Regex to match paths starting with 'images/' or 'Logo/' and ending with image extensions
    pattern = r"(images|Logo)/[^\"\'\s]+\.(png|jpg|jpeg)"
    
    new_html = re.sub(pattern, replace_extension, html, flags=re.IGNORECASE)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Updated index.html to use WebP images.")
