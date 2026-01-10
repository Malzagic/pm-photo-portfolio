import { Link } from "react-router-dom";
export function PortfolioPage() {
    return (<div>
      <h1>Portfolio</h1>

      <ul>
        <li>
          <Link to="/portfolio/astro">Astrophotography</Link>
        </li>
        <li>
          <Link to="/portfolio/landscape">Landscape</Link>
        </li>
        <li>
          <Link to="/portfolio/nature">Nature</Link>
        </li>
      </ul>
    </div>);
}
