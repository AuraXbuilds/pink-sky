import glob

for filepath in glob.glob('j:/pink sky/*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace('journal.html', 'community.html')
    new_content = new_content.replace('>Journal<', '>Community<')
    new_content = new_content.replace('JOURNAL', 'COMMUNITY')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('Updated ' + filepath)
