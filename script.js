/* ============================================================
   REDCAT TECHNOLOGIES PRODUCT PRIVATE LIMITED — INTERACTIVE SCRIPTS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── PAGE LOADER (FADE OUT) ───
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loader--hidden');
                // Remove from DOM after transition
                setTimeout(() => loader.remove(), 800);
            }, 500);
        });
    }

    // ─── ELEMENTS ───
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // ─── STICKY HEADER WITH BLUR ───
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ─── MOBILE MENU TOGGLE ───
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ─── ACTIVE NAV LINK ON SCROLL ───
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ─── REVEAL ON SCROLL / LOAD ANIMATIONS ───
    const revealElements = document.querySelectorAll('.animate-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── ANIMATED COUNTER (Stats) ───
    const statNumbers = document.querySelectorAll('.stat__number[data-target]');
    let countersStarted = false;

    const animateCounters = () => {
        statNumbers.forEach(numEl => {
            const target = +numEl.getAttribute('data-target');
            const duration = 2000; // ms
            const start = performance.now();

            const step = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);

                // Ease-out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(ease * target);

                numEl.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        });
    };

    // Trigger counters when stats section is in view
    const statsContainer = document.querySelector('.hero__stats');
    if (statsContainer) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsContainer);
    }

    // ─── SMOOTH SCROLL FOR CTA BUTTONS ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const top = targetEl.offsetTop - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ─── PARALLAX GLOW BLOBS ON MOUSE MOVE ───
    const glows = document.querySelectorAll('.hero__glow');

    if (window.matchMedia('(min-width: 769px)').matches) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const moveX = (clientX - centerX) / centerX;
            const moveY = (clientY - centerY) / centerY;

            glows.forEach((glow, i) => {
                const speed = (i + 1) * 12;
                glow.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
            });
        });
    }

    // ─── BUTTON RIPPLE EFFECT ───
    document.querySelectorAll('.btn--primary').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Ripple keyframes (injected once)
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to { transform: scale(2.5); opacity: 0; }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ─── PRODUCT CARD CAROUSELS ───
    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel__slide');
        const dots = carousel.querySelectorAll('.carousel__dot');
        const prevBtn = carousel.querySelector('.carousel__btn--prev');
        const nextBtn = carousel.querySelector('.carousel__btn--next');
        let currentSlide = 0;
        let autoSlideInterval = null;

        const goToSlide = (index) => {
            // Wrap around
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        };

        // Dot click
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goToSlide(+dot.getAttribute('data-slide'));
            });
        });

        // Prev / Next
        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        }

        // Auto-slide
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 4000);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        startAutoSlide();

        // Pause on hover
        const card = carousel.closest('.product-card');
        if (card) {
            card.addEventListener('mouseenter', stopAutoSlide);
            card.addEventListener('mouseleave', startAutoSlide);
        }

        // Touch / Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToSlide(currentSlide + 1); // swipe left → next
                } else {
                    goToSlide(currentSlide - 1); // swipe right → prev
                }
            }
        }, { passive: true });
    });

    // ─── ABOUT CAROUSEL (Horizontal Scroll) ───
    const aboutTrack = document.getElementById('about-carousel-track');
    const aboutPrev = document.getElementById('about-prev');
    const aboutNext = document.getElementById('about-next');
    const aboutProgress = document.getElementById('about-progress-bar');

    if (aboutTrack) {
        const scrollAmount = 344; // card width + gap

        aboutPrev.addEventListener('click', () => {
            aboutTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        aboutNext.addEventListener('click', () => {
            aboutTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // Update progress bar on scroll
        aboutTrack.addEventListener('scroll', () => {
            const maxScroll = aboutTrack.scrollWidth - aboutTrack.clientWidth;
            const progress = maxScroll > 0 ? (aboutTrack.scrollLeft / maxScroll) * 100 : 0;
            aboutProgress.style.width = `${Math.max(15, Math.min(100, progress))}%`;
        }, { passive: true });

        // Drag to scroll
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        aboutTrack.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - aboutTrack.offsetLeft;
            scrollLeft = aboutTrack.scrollLeft;
            aboutTrack.style.cursor = 'grabbing';
        });

        aboutTrack.addEventListener('mouseleave', () => {
            isDragging = false;
            aboutTrack.style.cursor = 'grab';
        });

        aboutTrack.addEventListener('mouseup', () => {
            isDragging = false;
            aboutTrack.style.cursor = 'grab';
        });

        aboutTrack.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - aboutTrack.offsetLeft;
            const walk = (x - startX) * 1.5;
            aboutTrack.scrollLeft = scrollLeft - walk;
        });
    }

    // ─── ABOUT MODAL (Expand Card) ───
    const aboutCards = document.querySelectorAll('.about-card');
    const aboutModal = document.getElementById('about-modal');
    const modalClose = document.getElementById('about-modal-close');
    const modalBackdrop = document.getElementById('about-modal-backdrop');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalDetail = document.getElementById('modal-detail');
    const modalCounter = document.getElementById('modal-counter');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');

    let currentModalIndex = 0;
    const totalCards = aboutCards.length;

    const openModal = (index) => {
        if (index < 0 || index >= totalCards) return;
        currentModalIndex = index;

        const card = aboutCards[index];
        const iconHTML = card.querySelector('.about-card__icon').innerHTML;
        const title = card.querySelector('.about-card__title').textContent;
        const desc = card.querySelector('.about-card__desc').textContent;
        const detail = card.querySelector('.about-card__detail').textContent;

        modalIcon.innerHTML = iconHTML;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalDetail.textContent = detail;
        modalCounter.textContent = `${index + 1} / ${totalCards}`;

        aboutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        aboutModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Card click → open
    aboutCards.forEach((card, i) => {
        card.addEventListener('click', () => openModal(i));
    });

    // Close handlers
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Modal navigation
    if (modalPrev) {
        modalPrev.addEventListener('click', () => {
            openModal((currentModalIndex - 1 + totalCards) % totalCards);
        });
    }
    if (modalNext) {
        modalNext.addEventListener('click', () => {
            openModal((currentModalIndex + 1) % totalCards);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!aboutModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') openModal((currentModalIndex - 1 + totalCards) % totalCards);
        if (e.key === 'ArrowRight') openModal((currentModalIndex + 1) % totalCards);
    });

    // Modal swipe support
    let modalTouchStartX = 0;
    const modalContainer = document.getElementById('about-modal-container');

    if (modalContainer) {
        modalContainer.addEventListener('touchstart', (e) => {
            modalTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        modalContainer.addEventListener('touchend', (e) => {
            const diff = modalTouchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 60) {
                if (diff > 0) {
                    openModal((currentModalIndex + 1) % totalCards);
                } else {
                    openModal((currentModalIndex - 1 + totalCards) % totalCards);
                }
            }
        }, { passive: true });
    }

    // ─── CONTACT FORM HANDLING ───
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Visual feedback
            const originalText = submitBtn.querySelector('span').textContent;
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitBtn.classList.add('btn--loading');
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = 'Message Sent!';
                submitBtn.classList.remove('btn--loading');
                submitBtn.classList.add('btn--success');

                // Reset form
                contactForm.reset();

                // Clear success message after 3 seconds
                setTimeout(() => {
                    submitBtn.querySelector('span').textContent = originalText;
                    submitBtn.classList.remove('btn--success');
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ─── FAQ ACCORDION ───
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');

        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ─── NEWSLETTER FORM ───
    const newsletterForm = document.querySelector('.newsletter__form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const submitBtn = newsletterForm.querySelector('button');
            const originalText = submitBtn.textContent;

            // Show success state
            submitBtn.textContent = 'Subscribed!';
            submitBtn.style.background = '#00c853';
            submitBtn.disabled = true;
            input.value = '';

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    // ─── HOMEPAGE PRODUCTS CAROUSEL ───
    const hpCarouselContainer = document.getElementById('hp-carousel');
    const hpCarouselElement = document.getElementById('hp-carousel-track');
    const hpPrevBtn = document.getElementById('hp-prev');
    const hpNextBtn = document.getElementById('hp-next');

    let hpCurrentSlide = 0;
    let hpAutoPlayInterval;

    const getVisibleHpSlides = () => {
        if (!hpCarouselElement) return [];
        return Array.from(hpCarouselElement.querySelectorAll('.hp-carousel__slide')).filter(
            slide => !slide.classList.contains('is-filtered-out')
        );
    };

    const updateHpCarousel = () => {
        if (!hpCarouselElement) return;
        const visibleSlides = getVisibleHpSlides();
        if (visibleSlides.length === 0) return;
        if (hpCurrentSlide >= visibleSlides.length) hpCurrentSlide = 0;
        if (hpCurrentSlide < 0) hpCurrentSlide = visibleSlides.length - 1;
        hpCarouselElement.style.transform = `translateX(-${hpCurrentSlide * 100}%)`;
    };

    const hpNextSlide = () => {
        const visibleSlides = getVisibleHpSlides();
        if (visibleSlides.length <= 1) return;
        hpCurrentSlide = (hpCurrentSlide + 1) % visibleSlides.length;
        updateHpCarousel();
    };

    const hpPrevSlide = () => {
        const visibleSlides = getVisibleHpSlides();
        if (visibleSlides.length <= 1) return;
        hpCurrentSlide = (hpCurrentSlide - 1 + visibleSlides.length) % visibleSlides.length;
        updateHpCarousel();
    };

    const startHpAutoplay = () => {
        if (!hpCarouselElement) return;
        clearInterval(hpAutoPlayInterval);
        hpAutoPlayInterval = setInterval(hpNextSlide, 3500);
    };

    const resetHpAutoplay = () => {
        clearInterval(hpAutoPlayInterval);
        startHpAutoplay();
    };

    if (hpCarouselElement && hpPrevBtn && hpNextBtn) {
        hpNextBtn.addEventListener('click', () => {
            hpNextSlide();
            resetHpAutoplay();
        });

        hpPrevBtn.addEventListener('click', () => {
            hpPrevSlide();
            resetHpAutoplay();
        });

        if (hpCarouselContainer) {
            hpCarouselContainer.addEventListener('mouseenter', () => clearInterval(hpAutoPlayInterval));
            hpCarouselContainer.addEventListener('mouseleave', () => startHpAutoplay());
        }

        // Touch swipe support
        let hpTouchStartX = 0;
        hpCarouselElement.addEventListener('touchstart', (e) => {
            hpTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        hpCarouselElement.addEventListener('touchend', (e) => {
            const diff = hpTouchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) hpNextSlide();
                else hpPrevSlide();
                resetHpAutoplay();
            }
        }, { passive: true });

        // Start autoplay
        startHpAutoplay();
    }

    // ─── PRODUCT CATEGORY FILTER TABS (SOFTWARE VS HARDWARE) ───
    const categoryNavs = document.querySelectorAll('.product-category-nav');
    categoryNavs.forEach(nav => {
        const tabBtns = nav.querySelectorAll('.category-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter') || 'all';
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter on products.html catalog
                const productCards = document.querySelectorAll('.products-grid .product-card');
                productCards.forEach(card => {
                    const cat = card.getAttribute('data-category');
                    if (filter === 'all' || cat === filter) {
                        card.classList.remove('is-filtered-out');
                    } else {
                        card.classList.add('is-filtered-out');
                    }
                });

                // Filter on index.html homepage carousel
                if (hpCarouselElement) {
                    const slides = hpCarouselElement.querySelectorAll('.hp-carousel__slide');
                    slides.forEach(slide => {
                        const cat = slide.getAttribute('data-category');
                        if (filter === 'all' || cat === filter) {
                            slide.classList.remove('is-filtered-out');
                        } else {
                            slide.classList.add('is-filtered-out');
                        }
                    });
                    hpCurrentSlide = 0;
                    updateHpCarousel();
                    resetHpAutoplay();
                }
            });
        });
    });

    // ─── TEAM MODAL (ABOUT PAGE) ───
    const teamCards = document.querySelectorAll('.team-card');
    const teamModal = document.getElementById('team-modal');

    if (teamCards.length > 0 && teamModal) {
        const teamModalClose = document.getElementById('team-modal-close');
        const teamModalBackdrop = document.getElementById('team-modal-backdrop');

        // Modal DOM elements
        const viewImg = document.getElementById('tm-img');
        const viewName = document.getElementById('tm-name');
        const viewRole = document.getElementById('tm-role');
        const viewBio = document.getElementById('tm-bio');
        const viewExp = document.getElementById('tm-exp');
        const viewEmail = document.getElementById('tm-email');

        const closeTeamModal = () => {
            teamModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        const openTeamModal = (card) => {
            // Extract data from card
            const imgEl = card.querySelector('.team-card__img');
            const nameEl = card.querySelector('.team-card__name');
            const roleEl = card.querySelector('.team-card__role');

            const fullData = card.querySelector('.team-card__full-data');
            const bioEl = fullData ? fullData.querySelector('.bio') : card.querySelector('.team-card__brief');
            const expEl = fullData ? fullData.querySelector('.exp') : null;
            const contactEl = fullData ? fullData.querySelector('.contact') : null;

            // Populate modal
            if (viewImg && imgEl) {
                viewImg.src = imgEl.src;
                viewImg.alt = imgEl.alt || 'Team Profile';
            }
            if (viewName && nameEl) viewName.textContent = nameEl.textContent.trim();
            if (viewRole && roleEl) viewRole.textContent = roleEl.textContent.trim();
            if (viewBio && bioEl) viewBio.innerHTML = bioEl.innerHTML;
            if (viewExp && expEl) viewExp.innerHTML = expEl.innerHTML;
            if (viewEmail && contactEl) {
                const email = contactEl.textContent.trim();
                viewEmail.textContent = email;
                viewEmail.href = `mailto:${email}`;
            }

            // Show modal
            teamModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        teamCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                openTeamModal(card);
            });
        });

        if (teamModalClose) teamModalClose.addEventListener('click', closeTeamModal);
        if (teamModalBackdrop) teamModalBackdrop.addEventListener('click', closeTeamModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && teamModal.classList.contains('active')) {
                closeTeamModal();
            }
        });
    }

    // ─── RC BILLING DETAILS MODAL & GALLERY ───
    const rcModal = document.getElementById('rc-billing-modal');
    const openRcBtn = document.getElementById('open-rc-billing-modal');
    const closeRcBtn = document.getElementById('rc-modal-close');
    const backdropRc = document.getElementById('rc-modal-backdrop');

    if (rcModal && openRcBtn) {
        const openModal = () => {
            rcModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            rcModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        openRcBtn.addEventListener('click', openModal);
        if (closeRcBtn) closeRcBtn.addEventListener('click', closeModal);
        if (backdropRc) backdropRc.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && rcModal.classList.contains('active')) {
                closeModal();
            }
        });

        // Screenshot thumbnail switcher
        const galleryMain = document.getElementById('rc-gallery-main');
        const galleryCaption = document.getElementById('rc-gallery-caption');
        const thumbBtns = rcModal.querySelectorAll('.rc-modal__thumb-btn');

        thumbBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                thumbBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const newImg = btn.getAttribute('data-img');
                const newCaption = btn.getAttribute('data-caption');
                if (galleryMain && newImg) {
                    galleryMain.style.opacity = '0';
                    setTimeout(() => {
                        galleryMain.src = newImg;
                        galleryMain.style.opacity = '1';
                    }, 150);
                }
                if (galleryCaption && newCaption) {
                    galleryCaption.textContent = newCaption;
                }
            });
        });
    }

    // ─── SAFE UR FIN MODAL ───
    const safeModal = document.getElementById('safe-ur-fin-modal');
    const openSafeModalBtn = document.getElementById('open-safe-ur-fin-modal');
    const closeSafeModalBtn = document.getElementById('safe-ur-fin-modal-close');
    const backdropSafe = document.getElementById('safe-ur-fin-backdrop');

    if (safeModal && openSafeModalBtn) {
        const openSafe = () => {
            safeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeSafe = () => {
            safeModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        openSafeModalBtn.addEventListener('click', openSafe);
        if (closeSafeModalBtn) closeSafeModalBtn.addEventListener('click', closeSafe);
        if (backdropSafe) backdropSafe.addEventListener('click', closeSafe);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && safeModal.classList.contains('active')) {
                closeSafe();
            }
        });

        // Screenshot thumbnail switcher for Safe uR Fin
        const safeGalleryMain = document.getElementById('safe-gallery-main');
        const safeGalleryCaption = document.getElementById('safe-gallery-caption');
        const safeThumbBtns = safeModal.querySelectorAll('.rc-modal__thumb-btn');

        safeThumbBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                safeThumbBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const newImg = btn.getAttribute('data-img');
                const newCaption = btn.getAttribute('data-caption');
                if (safeGalleryMain && newImg) {
                    safeGalleryMain.style.opacity = '0';
                    setTimeout(() => {
                        safeGalleryMain.src = newImg;
                        safeGalleryMain.style.opacity = '1';
                    }, 150);
                }
                if (safeGalleryCaption && newCaption) {
                    safeGalleryCaption.textContent = newCaption;
                }
            });
        });
    }

    // ─── SMOOTH SCROLL TO LEADERSHIP / MANAGEMENT SECTION IF HASH IN URL ───
    const handleLeadershipHash = () => {
        const hash = window.location.hash;
        if (hash === '#leadership' || hash === '#team' || hash === '#management') {
            const targetSection = document.getElementById('leadership') || document.getElementById('team');
            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
            }
        }
    };
    window.addEventListener('DOMContentLoaded', handleLeadershipHash);
    window.addEventListener('hashchange', handleLeadershipHash);

    // ─── CATEGORY FILTER TABS (ALL / SOFTWARE / HARDWARE) ───
    const categoryTabs = document.querySelectorAll('.category-tab-btn');
    const productGridCards = document.querySelectorAll('.products-grid .product-card');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            productGridCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (filter === 'all' || cardCat === filter) {
                    card.style.display = '';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ─── PREMIUM QUICK SHORTCUT PILLS (INSTANT NAVIGATION & SPOTLIGHT) ───
    const shortcutPills = document.querySelectorAll('.shortcut-pill');

    shortcutPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const targetId = pill.getAttribute('data-target');
            shortcutPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            if (targetId === 'all') {
                categoryTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-filter') === 'all'));
                productGridCards.forEach(card => {
                    card.style.display = '';
                    card.style.opacity = '1';
                });
                const allSec = document.getElementById('all-products');
                if (allSec) allSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }

            const targetCard = document.getElementById(targetId);
            if (targetCard) {
                // Ensure card category is shown if hidden
                const cat = targetCard.getAttribute('data-category');
                if (cat) {
                    categoryTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-filter') === cat));
                    productGridCards.forEach(card => {
                        const cardCat = card.getAttribute('data-category');
                        card.style.display = (cardCat === cat) ? '' : 'none';
                        card.style.opacity = '1';
                    });
                } else {
                    productGridCards.forEach(card => {
                        card.style.display = '';
                        card.style.opacity = '1';
                    });
                }

                // Smooth scroll to card
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Highlight card
                targetCard.classList.remove('shortcut-focused');
                void targetCard.offsetWidth;
                targetCard.classList.add('shortcut-focused');
                setTimeout(() => targetCard.classList.remove('shortcut-focused'), 2000);
            }
        });
    });

    // ─── HERO SCREEN MULTI-SLIDE AUTO-SWIPER (LEFT-TO-RIGHT SWIPE) ───
    const heroSliderTrack = document.getElementById('hero-slider-track');
    const heroSliderContainer = document.getElementById('hero-screen-slider');
    const heroDots = document.querySelectorAll('#hero-slider-dots .hero-slider__dot');

    if (heroSliderTrack && heroDots.length > 0) {
        let heroCurrentSlide = 0;
        const totalHeroSlides = heroDots.length;
        let heroSliderInterval;

        const updateHeroSlider = (index) => {
            heroCurrentSlide = index;
            heroSliderTrack.style.transform = `translateX(-${heroCurrentSlide * 100}%)`;
            heroDots.forEach((d, i) => {
                d.classList.toggle('active', i === heroCurrentSlide);
            });
        };

        const nextHeroSlide = () => {
            const nextIndex = (heroCurrentSlide + 1) % totalHeroSlides;
            updateHeroSlider(nextIndex);
        };

        const startHeroAutoSlide = () => {
            clearInterval(heroSliderInterval);
            heroSliderInterval = setInterval(nextHeroSlide, 3200);
        };

        heroDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                updateHeroSlider(idx);
                startHeroAutoSlide();
            });
        });

        if (heroSliderContainer) {
            heroSliderContainer.addEventListener('mouseenter', () => clearInterval(heroSliderInterval));
            heroSliderContainer.addEventListener('mouseleave', () => startHeroAutoSlide());
        }

        // Start auto-swiping
        startHeroAutoSlide();
    }

    // ─── DOORBELL KNOCK TRIGGER (CUSTOM SOFTWARE TO WHATSAPP) ───
    const bellKnockButtons = [
        document.getElementById('bell-knock-btn'),
        document.getElementById('bell-knock-btn-products'),
        document.getElementById('bell-knock-btn-about')
    ].filter(Boolean);

    const bellToast = document.getElementById('bell-toast');
    const devKnockOverlay = document.getElementById('dev-knock-overlay');
    const devKnockOverlayAbout = document.getElementById('dev-knock-overlay-about');
    const devTermMsg = document.getElementById('dev-terminal-msg');
    const devTermMsgAbout = document.getElementById('dev-terminal-msg-about');

    bellKnockButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Visual ringing shake
            btn.classList.add('ringing');

            // Interactive developer overlay & status trigger
            if (devKnockOverlay) devKnockOverlay.classList.add('active');
            if (devKnockOverlayAbout) devKnockOverlayAbout.classList.add('active');

            if (devTermMsg) {
                devTermMsg.textContent = '🔔 [ALERT]: INCOMING CLIENT KNOCK DETECTED! CONNECTING LEAD ARCHITECT VIA WHATSAPP...';
            }
            if (devTermMsgAbout) {
                devTermMsgAbout.textContent = '🔔 [ALERT]: INCOMING CLIENT KNOCK DETECTED! CONNECTING LEAD ARCHITECT VIA WHATSAPP...';
            }

            // Show toast feedback
            if (bellToast) {
                bellToast.classList.add('show');
            }

            // Redirect to WhatsApp with pre-filled message
            setTimeout(() => {
                const whatsappUrl = "https://wa.me/917003482511?text=Hello%20RedCat%20Technologies!%20I%20want%20to%20build%20custom%20software%20with%20your%20team.%20Let's%20discuss%20my%20requirements!";
                window.open(whatsappUrl, '_blank');
            }, 850);

            // Reset animation & toast
            setTimeout(() => {
                btn.classList.remove('ringing');
            }, 1200);

            setTimeout(() => {
                if (bellToast) {
                    bellToast.classList.remove('show');
                }
                if (devKnockOverlay) devKnockOverlay.classList.remove('active');
                if (devKnockOverlayAbout) devKnockOverlayAbout.classList.remove('active');

                if (devTermMsg) {
                    devTermMsg.textContent = '[DEV_STATUS]: Active on IDE • Ready for Client Co-Development Request';
                }
                if (devTermMsgAbout) {
                    devTermMsgAbout.textContent = '[DEV_STATUS]: Active on IDE • Ready for Client Co-Development Request';
                }
            }, 4500);
        });
    });

    // ─── CO-DEVELOPMENT STEP CARDS INTERACTIVITY ───
    const codevCards = document.querySelectorAll('.codev-step-card');
    codevCards.forEach(card => {
        card.addEventListener('click', () => {
            codevCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // ─── PREMIUM TESTIMONIALS SECTION DYNAMICS ───
    const filterPills = document.querySelectorAll('.filter-pill');
    const testimonialCards = document.querySelectorAll('.testimonial-card-premium');
    const trackRow1 = document.getElementById('track-row-1');
    const trackRow2 = document.getElementById('track-row-2');
    const marqueeToggle = document.getElementById('marquee-toggle');
    const marqueePrev = document.getElementById('marquee-prev');
    const marqueeNext = document.getElementById('marquee-next');

    // 1. Category Filtering
    if (filterPills.length > 0) {
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                const selectedCategory = pill.getAttribute('data-category');
                testimonialCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category') || '';
                    if (selectedCategory === 'all' || cardCategory.includes(selectedCategory)) {
                        card.classList.remove('is-dimmed');
                    } else {
                        card.classList.add('is-dimmed');
                    }
                });
            });
        });
    }

    // 2. Play / Pause Marquee Controls
    let isMarqueePaused = false;
    if (marqueeToggle && trackRow1 && trackRow2) {
        marqueeToggle.addEventListener('click', () => {
            isMarqueePaused = !isMarqueePaused;
            trackRow1.classList.toggle('is-paused', isMarqueePaused);
            trackRow2.classList.toggle('is-paused', isMarqueePaused);

            const iconPause = marqueeToggle.querySelector('.icon-pause');
            const iconPlay = marqueeToggle.querySelector('.icon-play');
            const btnText = marqueeToggle.querySelector('.btn-text');

            if (isMarqueePaused) {
                if (iconPause) iconPause.style.display = 'none';
                if (iconPlay) iconPlay.style.display = 'block';
                if (btnText) btnText.textContent = 'Play';
            } else {
                if (iconPause) iconPause.style.display = 'block';
                if (iconPlay) iconPlay.style.display = 'none';
                if (btnText) btnText.textContent = 'Pause';
            }
        });
    }

    // 3. Manual Step Controls (Scroll nudges)
    if (marqueePrev && trackRow1 && trackRow2) {
        marqueePrev.addEventListener('click', () => {
            trackRow1.scrollBy({ left: -320, behavior: 'smooth' });
            trackRow2.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }
    if (marqueeNext && trackRow1 && trackRow2) {
        marqueeNext.addEventListener('click', () => {
            trackRow1.scrollBy({ left: 320, behavior: 'smooth' });
            trackRow2.scrollBy({ left: -320, behavior: 'smooth' });
        });
    }

    // 4. Cursor Spotlight Sheen & 3D Tilt on Cards
    testimonialCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 5. Interactive Helpful Likes
    const helpfulBtns = document.querySelectorAll('.helpful-btn');
    helpfulBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const countEl = btn.querySelector('.helpful-count');
            let votes = parseInt(btn.getAttribute('data-votes') || '0', 10);

            if (!btn.classList.contains('voted')) {
                votes += 1;
                btn.classList.add('voted');
            } else {
                votes -= 1;
                btn.classList.remove('voted');
            }
            btn.setAttribute('data-votes', votes);
            if (countEl) countEl.textContent = votes;
        });
    });

    // 6. Review Modal & Rating Picker
    const reviewModal = document.getElementById('review-modal');
    const openReviewBtn = document.getElementById('btn-open-review-modal');
    const closeReviewBtn = document.getElementById('btn-close-review-modal');
    const cancelReviewBtn = document.getElementById('btn-cancel-review');
    const reviewForm = document.getElementById('review-form');
    const starPicker = document.getElementById('star-picker');
    const starValDisplay = document.getElementById('star-val-display');
    const reviewToast = document.getElementById('testimonial-toast');

    const openReviewModal = () => {
        if (reviewModal) {
            reviewModal.classList.add('open');
            reviewModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeReviewModal = () => {
        if (reviewModal) {
            reviewModal.classList.remove('open');
            reviewModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    if (openReviewBtn) openReviewBtn.addEventListener('click', openReviewModal);
    if (closeReviewBtn) closeReviewBtn.addEventListener('click', closeReviewModal);
    if (cancelReviewBtn) cancelReviewBtn.addEventListener('click', closeReviewModal);

    if (reviewModal) {
        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) closeReviewModal();
        });
    }

    // Star Picker Interaction
    if (starPicker) {
        const stars = starPicker.querySelectorAll('.star-pick');
        const starLabels = {
            1: '1.0 / 5.0 (Poor)',
            2: '2.0 / 5.0 (Fair)',
            3: '3.0 / 5.0 (Good)',
            4: '4.0 / 5.0 (Very Good)',
            5: '5.0 / 5.0 (Excellent)'
        };
        let currentRating = 5;

        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const val = parseInt(star.getAttribute('data-val'), 10);
                stars.forEach(s => {
                    const sVal = parseInt(s.getAttribute('data-val'), 10);
                    s.classList.toggle('hovered', sVal <= val);
                });
                if (starValDisplay) starValDisplay.textContent = starLabels[val];
            });

            star.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('hovered'));
                if (starValDisplay) starValDisplay.textContent = starLabels[currentRating];
            });

            star.addEventListener('click', () => {
                currentRating = parseInt(star.getAttribute('data-val'), 10);
                stars.forEach(s => {
                    const sVal = parseInt(s.getAttribute('data-val'), 10);
                    s.classList.toggle('active', sVal <= currentRating);
                });
                if (starValDisplay) starValDisplay.textContent = starLabels[currentRating];
            });
        });
    }

    // Form Submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('review-author-name')?.value || 'Client';

            closeReviewModal();
            reviewForm.reset();

            // Trigger success toast
            if (reviewToast) {
                const toastText = reviewToast.querySelector('.toast-text');
                if (toastText) {
                    toastText.innerHTML = `<strong>Thank you, ${name}!</strong><span>Your verified feedback was received and is under quick validation.</span>`;
                }
                reviewToast.classList.add('show');
                setTimeout(() => {
                    reviewToast.classList.remove('show');
                }, 5000);
            }
        });
    }

    // ─── ROBUST SMOOTH SCROLL & DIRECT SECTION OPENER (MANAGEMENT / LEADERSHIP / QUICK LINKS) ───
    const getHeaderOffset = () => {
        const h = document.getElementById('header');
        return (h ? h.offsetHeight : 76) + 20;
    };

    const scrollToTargetSection = (targetId, triggerPulse = true) => {
        if (!targetId) return;
        let targetEl = document.getElementById(targetId);
        if (!targetEl && (targetId === 'leadership' || targetId === 'management' || targetId === 'team')) {
            targetEl = document.getElementById('leadership') || document.getElementById('team');
        }
        if (!targetEl) return;

        const offset = getHeaderOffset();
        const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = Math.max(0, elementPosition - offset);

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        if (triggerPulse) {
            targetEl.classList.remove('section-highlight-pulse');
            void targetEl.offsetWidth; // trigger reflow
            targetEl.classList.add('section-highlight-pulse');
            setTimeout(() => {
                targetEl.classList.remove('section-highlight-pulse');
            }, 2300);
        }
    };

    // Global in-page anchor click handler (covers Header nav, Footer Quick Links, and in-page buttons)
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href) return;

        let targetHash = '';
        if (href.startsWith('#')) {
            targetHash = href;
        } else {
            try {
                const targetUrl = new URL(anchor.href, window.location.href);
                const currentPath = window.location.pathname.replace(/\/$/, '');
                const targetPath = targetUrl.pathname.replace(/\/$/, '');

                const currentFile = currentPath.split('/').pop() || 'index.html';
                const targetFile = targetPath.split('/').pop() || 'index.html';

                if (targetUrl.origin === window.location.origin && currentFile === targetFile && targetUrl.hash) {
                    targetHash = targetUrl.hash;
                }
            } catch (_) {}
        }

        if (targetHash) {
            const targetId = targetHash.replace(/^#/, '');
            let targetEl = document.getElementById(targetId);
            if (!targetEl && (targetId === 'leadership' || targetId === 'management' || targetId === 'team')) {
                targetEl = document.getElementById('leadership') || document.getElementById('team');
            }

            if (targetEl) {
                e.preventDefault();

                // Close mobile menu if open
                if (navToggle && navMenu) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('open');
                    document.body.style.overflow = '';
                }

                if (history.pushState) {
                    history.pushState(null, '', targetHash);
                }

                scrollToTargetSection(targetId, true);
            }
        }
    });

    // Multi-stage hash handling on initial page load / cross-page navigation
    const checkAndScrollHash = () => {
        const rawHash = window.location.hash;
        if (!rawHash) return;
        const targetId = rawHash.replace(/^#/, '');
        if (targetId) {
            scrollToTargetSection(targetId, true);
            setTimeout(() => scrollToTargetSection(targetId, false), 150);
            setTimeout(() => scrollToTargetSection(targetId, true), 650);
            setTimeout(() => scrollToTargetSection(targetId, false), 1200);
        }
    };

    window.addEventListener('load', checkAndScrollHash);
    window.addEventListener('hashchange', checkAndScrollHash);
    setTimeout(checkAndScrollHash, 100);

});

