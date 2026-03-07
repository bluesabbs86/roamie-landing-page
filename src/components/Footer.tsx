import RoamieLogo from "@/components/RoamieLogo";
import { MapPin } from "lucide-react";

const footerLinks = {
  Product: ["Features", "How It Works", "FAQ"],
  Company: ["About", "Blog"],
  Support: ["Help Center", "Contact", "Privacy", "Terms"],
};

const Footer = () => {
  return (
    <footer className="bg-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-7 w-7 text-primary" />
              <span className="font-display text-xl font-900 text-primary-foreground">Roamie</span>
            </div>
            <p className="text-primary-foreground/50 text-sm leading-relaxed">
              Every trip, perfectly budgeted. Plan smarter, travel further.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-bold text-primary-foreground mb-4 text-sm uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-primary-foreground/50 hover:text-primary transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/40 text-sm">© 2026 Roamie. All rights reserved.</p>
          <p className="text-primary-foreground/40 text-sm">100% Free · No hidden fees</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
