import React from 'react';
import './Footer.css';


const Footer = () => {
    return (
        <>
            <section className='footer-section'>
                <footer className="top">
                    <div className='logo-desc'>
                        <div className='logo'>
                            ManyIN
                        </div>
                        <div className='desc'>Your Marketplace, Your Way</div>
                    </div>
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
                                    <i className="fa-brands fa-linkedin" style={{ color: "#000000" }}></i>
                                </a>
                                <a href='https://github.com/varunguda' target='_blank' rel='noreferrer'>
                                    <i className="fa-brands fa-github" style={{ color: "#000000" }}></i>
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
}

export default Footer
