import { Twitter, Instagram, Linkedin, Dribbble } from 'lucide-react';

export default function SocialShareV1() {
  return (
    <ul>
      <li>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="motion-hover">
          <Twitter size={20} />
        </a>
      </li>
      <li>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="motion-hover">
          <Instagram size={20} />
        </a>
      </li>
      <li>
        <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="motion-hover">
          <Dribbble size={20} />
        </a>
      </li>
      <li>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="motion-hover">
          <Linkedin size={20} />
        </a>
      </li>
    </ul>
  );
}
