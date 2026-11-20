
import os

ROOT = "."
OUTPUT = "architecture.md"

IGNORE = {
    ".git", "__pycache__", "node_modules",
    ".venv", "venv", "dist", "build"
}

lines = [
    "# Project Architecture",
    "",
    "```mermaid",
    "flowchart TD",
    '    A["Project Root"]'
]

nodes = {}
counter = 0

for current, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in IGNORE]

    relative = os.path.relpath(current, ROOT)

    if relative == ".":
        parent = "A"
    else:
        parent_path = os.path.dirname(relative)
        parent = nodes.get(parent_path, "A")

    for folder in sorted(dirs):
        counter += 1
        node = f"N{counter}"
        nodes[os.path.join(relative, folder)] = node

        label = folder.replace('"', "'")
        lines.append(f'    {parent} --> {node}["📁 {label}"]')

    for file in sorted(files):
        counter += 1
        node = f"N{counter}"
        label = file.replace('"', "'")
        lines.append(f'    {parent} --> {node}["📄 {label}"]')

lines.append("```")

with open(OUTPUT, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Diagram generated: {OUTPUT}")
