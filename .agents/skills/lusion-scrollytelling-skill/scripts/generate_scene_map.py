#!/usr/bin/env python3
"""Generate a starter scene-map.json for a portfolio scrollytelling site."""
import json
from pathlib import Path

scene_map = {
  "project": "portfolio-scrollytelling",
  "scenes": [
    {
      "id": "hero",
      "trigger": "#hero-scene",
      "pin": True,
      "scrollLength": "180vh",
      "dom": ["headline", "subtitle", "cta", "scrollIndicator"],
      "webgl": ["mainModel", "ambientParticles"],
      "timeline": ["title mask reveal", "model rotate", "camera push", "subtitle reveal", "fade scroll indicator"],
      "fallback": "static hero image with CSS reveal"
    },
    {
      "id": "about",
      "trigger": "#about-scene",
      "pin": False,
      "scrollLength": "120vh",
      "dom": ["sectionLabel", "bioLines", "techKeywords"],
      "webgl": ["modelShiftLeft"],
      "timeline": ["model moves left", "bio lines stagger", "keywords horizontal drift"],
      "fallback": "normal text layout"
    },
    {
      "id": "projects",
      "trigger": "#projects-scene",
      "pin": False,
      "scrollLength": "160vh",
      "dom": ["projectGrid", "projectCards"],
      "webgl": ["optional card shader planes"],
      "timeline": ["cards blur reveal", "thumbnail scale", "hover magnetic effect"],
      "fallback": "static cards"
    },
    {
      "id": "contact",
      "trigger": "#contact-scene",
      "pin": True,
      "scrollLength": "120vh",
      "dom": ["bigCTA", "contactLinks"],
      "webgl": ["final particles or model dissolve"],
      "timeline": ["big text reveal", "background depth shift", "cta magnetic button"],
      "fallback": "static CTA"
    }
  ]
}

Path('scene-map.json').write_text(json.dumps(scene_map, indent=2), encoding='utf-8')
print('Created scene-map.json')
