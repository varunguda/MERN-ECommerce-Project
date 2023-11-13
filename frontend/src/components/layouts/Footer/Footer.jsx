import React from 'react';
import './Footer.css';
import '../../../index.css';
import IconGithub from '@tabler/icons-react/dist/esm/icons/IconBrandGithub';
import IconLinkedin from '@tabler/icons-react/dist/esm/icons/IconBrandLinkedin';
import { useLocation } from 'react-router';


const Footer = () => {

    const location = useLocation();

    return (
        ["/shipping", "/account"].every(elem => !location.pathname.includes(elem)) && (
            <>
                <section className='footer-section'>

                    <footer className="top">
                        <div to="/" className='logo-new'>
                            <span>ManyIN</span>
                            <img src="/ManyIN_LOGO.png" alt="logo" />
                        </div>
                        <div className='logo-desc'>Your Marketplace, Your Way</div>

                        <div className="links">
                            <div className="links-column">
                                <h2>Departments</h2>
                                <a href="/">Electronics</a>
                                <a href="/">Home Appliances</a>
                                <a href="/">Fashion</a>
                                <a href="/">Beauty</a>
                                <a href="/">Home</a>
                            </div>
                            <div className="links-column">
                                <h2>ToBeFilled</h2>
                                <a href="/">ToBeFilled</a>
                                <a href="/">ToBeFilled</a>
                                <a href="/">ToBeFilled</a>
                                <a href="/">ToBeFilled</a>
                                <a href="/">ToBeFilled</a>
                            </div>
                            <div className="links-column">
                                <h2>ToBeFilled</h2>
                                <a href="/">ToBeFilled</a>
                                <a href="/">ToBeFilled</a>
                                <a href="/">ToBeFilled</a>
                                <a href="/">ToBeFilled</a>
                                <a href="/">ToBeFilled</a>
                            </div>
                            <div className="links-column socials-column">
                                <h2>Contact</h2>
                                <div className="socials">
                                    <a href='https://www.linkedin.com/in/varunguda' target='_blank' rel='noreferrer'>
                                        <IconLinkedin strokeWidth={1.5} size={22} />
                                    </a>
                                    <a href='https://github.com/varunguda' target='_blank' rel='noreferrer'>
                                        <IconGithub strokeWidth={1.5} size={22} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </footer>
                    <footer className="bottom">
                        <p className="copyright">© 2023 All rights reserved</p>
                        <div className="legal">
                            <a href="/"> License </a>
                            <a href="/"> Terms </a>
                            <a href="/"> Privacy </a>
                        </div>
                    </footer>
                </section>
            </>
        )
    )
}

export default Footer
