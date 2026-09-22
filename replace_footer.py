import re

with open('j:/pink sky/temp_footer.html', 'r', encoding='utf-8') as f:
    new_footer = f.read()

with open('j:/pink sky/shop.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'<footer class="foot">.*?</footer>', new_footer.replace('\\', '\\\\'), html, flags=re.DOTALL)

with open('j:/pink sky/shop.html', 'w', encoding='utf-8') as f:
    f.write(html)
