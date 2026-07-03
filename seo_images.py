import re

def optimize_images():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    def replacer(match):
        img_tag = match.group(0)
        
        # Don't touch SVGs or external logos if we can help it, but standard imgs are fine.
        if 'alt=' not in img_tag:
            return img_tag
            
        alt_match = re.search(r'alt="([^"]*)"', img_tag)
        if not alt_match:
            return img_tag
            
        alt_text = alt_match.group(1)
        
        # If the image is one of the main gallery images, inject the keyword
        gallery_images = ['unnamed.jpg', 'punjabi.jpg', 'chinese.jpg', 'interior.jpg', 'snacks.jpg']
        is_gallery = any(g in img_tag for g in gallery_images)
        
        new_alt = alt_text
        if is_gallery and "best food in nakodar" not in alt_text.lower():
            new_alt = f"{alt_text} - Best food in Nakodar"
            img_tag = img_tag.replace(f'alt="{alt_text}"', f'alt="{new_alt}"')
        
        # Add title attribute if missing
        if 'title=' not in img_tag:
            # Insert title right after alt
            img_tag = img_tag.replace(f'alt="{new_alt}"', f'alt="{new_alt}" title="{new_alt}"')
            
        return img_tag

    optimized_html = re.sub(r'<img\s+[^>]*>', replacer, html)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(optimized_html)

    print("Image SEO optimization complete.")

if __name__ == "__main__":
    optimize_images()
