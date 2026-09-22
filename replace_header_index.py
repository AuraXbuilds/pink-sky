import re

with open('j:/pink sky/temp_header.html', 'r', encoding='utf-8') as f:
    new_header = f.read()

with open('j:/pink sky/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'<header class="head" data-head>.*?</header>', new_header.replace('\\', '\\\\'), html, flags=re.DOTALL)

with open('j:/pink sky/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
