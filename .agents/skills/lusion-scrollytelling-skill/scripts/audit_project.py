#!/usr/bin/env python3
"""Lightweight project audit for a React/Next.js scrollytelling upgrade."""
from pathlib import Path
import json

ROOT = Path.cwd()
FILES = [
    'package.json', 'next.config.js', 'next.config.mjs', 'vite.config.ts', 'vite.config.js',
    'tailwind.config.js', 'tailwind.config.ts', 'src', 'app', 'pages', 'components', 'public'
]
ANIMATION_KEYS = ['gsap', 'three', '@react-three/fiber', '@react-three/drei', 'lenis', 'framer-motion', '@splinetool/react-spline', '@14islands/r3f-scroll-rig']

def main():
    print('## Project scrollytelling audit')
    for f in FILES:
        p = ROOT / f
        if p.exists():
            print(f'- Found: {f}')
    pkg = ROOT / 'package.json'
    if pkg.exists():
        data = json.loads(pkg.read_text(encoding='utf-8'))
        deps = {**data.get('dependencies', {}), **data.get('devDependencies', {})}
        print('\n## Animation / 3D dependencies')
        for key in ANIMATION_KEYS:
            if key in deps:
                print(f'- {key}: {deps[key]}')
        missing = [k for k in ANIMATION_KEYS if k not in deps]
        print('\n## Missing optional packages')
        for key in missing:
            print(f'- {key}')
    print('\n## Next steps')
    print('- Create a scene map before editing code.')
    print('- Decide GSAP/Three/Spline ownership for each animated property.')
    print('- Add reduced-motion and mobile fallbacks before final polishing.')

if __name__ == '__main__':
    main()
