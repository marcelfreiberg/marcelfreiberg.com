"use client";

export default function MobileTerminal() {
  return (
    <div className="font-mono text-sm space-y-3">
      <div className="text-accent">Marcel Freiberg</div>
      <div className="text-muted">ML & Computer Vision Engineer</div>

      <div className="mt-4">
        <span className="text-muted">$</span>{" "}
        <span className="text-text">whoami</span>
      </div>
      <div className="text-text/70">
        Building intelligent systems that see and understand.
      </div>

      <div className="mt-2">
        <span className="text-muted">$</span>{" "}
        <span className="text-text">skills</span>
      </div>
      <div className="text-text/70 leading-relaxed">
        Deep Learning, Computer Vision, Neural Networks, MLOps
      </div>

      <div className="mt-2">
        <span className="text-muted">$</span>{" "}
        <span className="text-text">contact</span>
      </div>
      <div className="text-text/70 leading-relaxed space-y-1">
        <div>
          GitHub:{" "}
          <a href="https://github.com/marcelfreiberg" className="text-accent hover:text-accent-hover">
            github.com/marcelfreiberg
          </a>
        </div>
        <div>
          LinkedIn:{" "}
          <a href="https://linkedin.com/in/marcelfreiberg" className="text-accent hover:text-accent-hover">
            linkedin.com/in/marcelfreiberg
          </a>
        </div>
        <div>
          Email:{" "}
          <a href="mailto:hello@marcelfreiberg.com" className="text-accent hover:text-accent-hover">
            hello@marcelfreiberg.com
          </a>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-muted text-xs">
          Visit on desktop for the interactive terminal experience.
        </div>
      </div>
    </div>
  );
}
