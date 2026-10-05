const backdrop = document.querySelector('#success-modal');

export const refs = {
  header: document.querySelector('.header'),
  menuButton: document.querySelector('.menu'),
  closeButton: document.querySelector('.close'),
  mobileMenu: document.querySelector('.mobile-menu'),
  mobileLinks: document.querySelectorAll('.mobile-nav a, .mobile-book-btn'),

  feedbacksWrapper: document.querySelector('#feedback-wrapper'),

  portfolioCategoryList: document.querySelector('.portfolio-category-list'),
  portfolioGalleryList: document.querySelector('.portfolio-gallery-list'),
  portfolioShowMoreBtn: document.querySelector('.portfolio-pagination-button'),

  contactsForm: document.querySelector('.contacts-form'),
  contactsBtn: document.querySelector('.contacts-btn'),

  backdrop,
  modal: backdrop?.querySelector('.success-modal'),
  closeModalButton: backdrop?.querySelector('.success-modal-close'),

  scrollUpBtn: document.querySelector('.scroll-up'),
};
