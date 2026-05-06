import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="py-12 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Eco Centre logo" className="w-8 h-8" />
            <span className="font-bold text-foreground">Eco Centre</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Inform · Inspire · Enable — taking action on climate change together.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
