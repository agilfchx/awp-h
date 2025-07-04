import os
import re
import shutil
import zipfile
import time

PLUGIN_DIR = 'plugins'
EXTRACTED_DIR = 'extracted'

def get_clean_name(zip_filename):
    return re.sub(r'[-_.]v?\d+(\.\d+)*', '', zip_filename).replace('.zip', '')

def remove_version_from_name(name):
    return re.sub(r'[-_.]v?\d+(\.\d+)*', '', name)

def move_item_to_dest(item_path, extracted_path):
    dest_path = os.path.join(extracted_path, os.path.basename(item_path))

    if os.path.exists(dest_path):
        if os.path.isdir(item_path):
            for nested_item in os.listdir(item_path):
                nested_item_path = os.path.join(item_path, nested_item)
                move_item_to_dest(nested_item_path, extracted_path)
            # Use shutil.rmtree to remove the directory and its contents
            shutil.rmtree(item_path)
        else:
            print(f"Skipping {item_path}, destination {dest_path} already exists.")
    else:
        shutil.move(item_path, dest_path)

def safe_rename(item_path, new_item_path):
    if os.path.exists(new_item_path):
        base, ext = os.path.splitext(new_item_path)
        counter = 1
        while os.path.exists(new_item_path):
            new_item_path = f"{base}_{counter}{ext}"
            counter += 1
    os.rename(item_path, new_item_path)

def extract_zip(plugin_path, extracted_path):
    with zipfile.ZipFile(plugin_path, 'r') as zip_ref:
        for member in zip_ref.infolist():
            extracted_member_path = os.path.join(extracted_path, member.filename)

            if os.name == 'nt':
                extracted_member_path = r'\\?\\' + os.path.abspath(extracted_member_path)
            os.makedirs(os.path.dirname(extracted_member_path), exist_ok=True)

            if not member.is_dir():
                try:
                    with zip_ref.open(member) as source, open(extracted_member_path, 'wb') as target:
                        shutil.copyfileobj(source, target)
                except Exception as e:
                    print(f"Error extracting {member.filename}: {e}")

    for extracted_item in os.listdir(extracted_path):
        item_path = os.path.join(extracted_path, extracted_item)
        new_item_name = remove_version_from_name(extracted_item)

        if new_item_name != extracted_item:
            new_item_path = os.path.join(extracted_path, new_item_name)
            safe_rename(item_path, new_item_path)
            item_path = new_item_path

        if os.path.isdir(item_path):
            for nested_item in os.listdir(item_path):
                nested_item_path = os.path.join(item_path, nested_item)
                move_item_to_dest(nested_item_path, extracted_path)
            shutil.rmtree(item_path)


def process_plugins():
    start_time = time.time()
    all_plugins = []
    extracted_count = 0

    for zip_filename in os.listdir(PLUGIN_DIR):
        if zip_filename.endswith('.zip'):
            plugin_path = os.path.join(PLUGIN_DIR, zip_filename)
            clean_name = get_clean_name(zip_filename)
            extracted_path = os.path.join(EXTRACTED_DIR, clean_name)

            # Skip extraction if plugin already exists in extracted folder
            if not os.path.exists(extracted_path):
                os.makedirs(extracted_path, exist_ok=True)
                print(f"[i] Extracting {zip_filename} → {clean_name}")
                extract_zip(plugin_path, extracted_path)
                extracted_count += 1

            all_plugins.append(clean_name)
    
    elapsed = time.time() - start_time
    print(f"\n[✓] Extracted {extracted_count} plugin(s) in {elapsed:.2f} seconds.\n")
    return all_plugins

# Run the extraction once when the app starts
plugins = process_plugins()  # This will extract and list the plugins when the app starts
