import os
from PIL import Image

directories = ['images', 'Logo']
image_extensions = ('.png', '.jpg', '.jpeg')

saved_bytes = 0
processed_files = 0

for directory in directories:
    if not os.path.exists(directory):
        continue
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(image_extensions):
                file_path = os.path.join(root, file)
                
                try:
                    original_size = os.path.getsize(file_path)
                    
                    with Image.open(file_path) as img:
                        # Resize if image is larger than 800px wide (perfect for menu cards)
                        if img.width > 800:
                            ratio = 800.0 / img.width
                            new_height = int(img.height * ratio)
                            img = img.resize((800, new_height), Image.Resampling.LANCZOS)
                        
                        # Save in original format
                        if file.lower().endswith('.png'):
                            img.save(file_path, 'PNG', optimize=True)
                        else:
                            # For JPG, use quality 75 for good compression
                            img.save(file_path, 'JPEG', quality=75, optimize=True)
                            
                    new_size = os.path.getsize(file_path)
                    
                    if new_size < original_size:
                        saved_bytes += (original_size - new_size)
                        
                    processed_files += 1
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

print(f"Successfully optimized {processed_files} images in place!")
print(f"Total space saved: {saved_bytes / (1024 * 1024):.2f} MB")
