import {
  BrainCircuit,
  Boxes,
  History,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link
          to="/"
          className="brand"
        >
          <div className="brand__icon">
            <BrainCircuit
              size={19}
            />
          </div>

          <span>
            Cipher
            <strong>
              DesignLab
            </strong>
          </span>
        </Link>

        <nav className="navbar__nav">
          <Link to="/#problems">
            <Boxes
              size={15}
            />
            Problems
          </Link>

          <Link to="/history">
            <History
              size={15}
            />
            History
          </Link>

          <div className="engine-badge">
            <span className="engine-dot" />

            Rules + AI
          </div>
        </nav>
      </div>
    </header>
  );
}