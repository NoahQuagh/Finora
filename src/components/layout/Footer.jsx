import React from 'react';
import { Link } from 'react-router-dom';
import './../../assets/style/navigation/footer.css';

export function Footer({
                           columns = [],
                           brandName = "Together",
                           slogan = "Votre plateforme collaborative.",
                           version = "1.0.0"
                       }) {
    return (
        <footer>
            <section className="footerSection">
                {columns.map((col, idx) => (
                    <div key={idx}>
                        <h4>{col.title}</h4>
                        <ul>
                            {col.links.map((link, linkIdx) => (
                                <li key={linkIdx}>
                                    {link.external ? (
                                        <a href={link.to} target="_blank" rel="noreferrer">{link.label}</a>
                                    ) : (
                                        <Link to={link.to}>{link.label}</Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="footer-logo-wrap">
                    <div className="fl-spinner">
                        <div className="fl-bg" />
                        <div className="fl-elements">
                            <div className="fl-top">
                                <div className="fl-bar-long" />
                                <div className="fl-bar-short" />
                            </div>
                            <div className="fl-bottom">
                                <div className="fl-block" />
                                <div className="fl-block" />
                            </div>
                        </div>
                        <div className="fl-face">
                            <div className="fl-eyes">
                                <div className="fl-eye" />
                                <div className="fl-eye" />
                            </div>
                            <div className="fl-mouth" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="separator" />

            <section className="footerSection footerSection2">
                <p>
                    Copyright © {new Date().getFullYear()} {brandName} | <Link to="/privacy">Politique de confidentialité</Link> | Version {version}
                </p>
            </section>
        </footer>
    );
}