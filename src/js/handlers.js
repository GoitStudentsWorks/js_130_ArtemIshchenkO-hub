import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';

import {
  fetchPortfolioCategories,
  fetchPortfolioPhotos,
  createOrder,
  fetchFeedbaks,
} from './api-functions';
import {
  addLoadingState,
  clearGallery,
  initActivePortfolioCategory,
  removeLoadingState,
  showError,
  showNotification,
  toggleActiveClass,
  toggleShowMoreBtn,
  validateOrderData,
} from './helpers';
import {
  renderPortfolioCategories,
  renderPortfolioPhotos,
  renderFeedbacks,
} from './render-functions';
import { portfolioPhotosParams } from './constants';
import { refs } from './refs';

const mainState = {
  totalItems: null,
  lastScrollY: window.scrollY,
};

export function updateHeaderOnScroll() {
  const currentScrollY = window.scrollY;

  if (
    currentScrollY > mainState.lastScrollY &&
    currentScrollY > header.offsetHeight
  ) {
    refs.header.classList.add('hidden');
  } else {
    refs.header.classList.remove('hidden');
  }

  mainState.lastScrollY = currentScrollY;
}

export function closeMenu() {
  refs.mobileMenu.classList.remove('is-open');
  document.body.style.overflow = '';
  refs.menuButton.setAttribute('aria-expanded', 'false');
}

export function openMenu() {
  refs.mobileMenu.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  refs.menuButton.setAttribute('aria-expanded', 'true');
}

export async function initFeedbacksSwiper() {
  try {
    const { feedbacks } = await fetchFeedbaks();

    renderFeedbacks(feedbacks);
    new Swiper('.feedbacks-slider', {
      slidesPerView: 1,

      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },

      navigation: {
        nextEl: '.btn-next',
        prevEl: '.btn-prev',
      },

      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      breakpoints: {
        768: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
        1440: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
  } catch (error) {
    showError(error.message);
  }
}

export async function getPortfolioCategories() {
  try {
    const categories = await fetchPortfolioCategories();
    renderPortfolioCategories([
      { _id: 1, category: 'All Photos' },
      ...categories,
    ]);
    initActivePortfolioCategory();
  } catch (error) {
    showError(error.message);
  }
}

export async function initGallery() {
  try {
    const { weddingPhotos, totalItems } = await fetchPortfolioPhotos(true);
    mainState.totalItems = totalItems;
    renderPortfolioPhotos(weddingPhotos);
    toggleShowMoreBtn(mainState.totalItems);
    portfolioPhotosParams.page = 3;
  } catch (error) {
    showError(error.message);
  }
}

export async function handlePortfolioCategoryClick({ target }) {
  const id = target.closest('.portfolio-category-item').id;

  if (Number(id) === 1) {
    portfolioPhotosParams.categoryId = '';
  } else {
    portfolioPhotosParams.categoryId = id;
  }

  portfolioPhotosParams.page = 1;

  try {
    addLoadingState(target);
    const { weddingPhotos, totalItems } = await fetchPortfolioPhotos(true);

    if (!totalItems || totalItems === 0) {
      showNotification('Don`t have images for this category');
      clearGallery();
      toggleActiveClass(target);
      toggleShowMoreBtn(totalItems);
      return;
    }

    mainState.totalItems = totalItems;
    clearGallery();
    toggleActiveClass(target);
    toggleShowMoreBtn(totalItems);
    renderPortfolioPhotos(weddingPhotos);

    portfolioPhotosParams.page = 3;
  } catch (error) {
    showError(error.message);
  } finally {
    removeLoadingState(target);
  }
}

export async function handleShowMoreClick() {
  portfolioPhotosParams.page += 1;

  try {
    addLoadingState(refs.portfolioShowMoreBtn);

    const { weddingPhotos } = await fetchPortfolioPhotos(false);

    renderPortfolioPhotos(weddingPhotos);

    const renderedCardsCount = refs.portfolioGalleryList.children.length;

    if (
      renderedCardsCount >= mainState.totalItems ||
      weddingPhotos.length === 0
    ) {
      showNotification('No more images');
      refs.portfolioShowMoreBtn.style.display = 'none';
    }
  } catch (error) {
    showError(error.message);
  } finally {
    removeLoadingState(refs.portfolioShowMoreBtn);
  }
}

export async function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const orderData = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    message: formData.get('message'),
  };
  const isValid = validateOrderData(orderData);
  if (isValid) {
    try {
      addLoadingState(refs.contactsBtn);
      await createOrder(orderData);
      openSuccessModal();
      event.target.reset();
    } catch (error) {
      showError(error.message);
    } finally {
      removeLoadingState(refs.contactsBtn);
    }
  } else {
    showError('Заповніть поля коректно');
  }
}

export function initAccordion() {
  new Accordion('.faq-list', {
    duration: 300,
    showMultiple: false,
    elementClass: 'faq-item',
    triggerClass: 'faq-question-btn',
    panelClass: 'faq-answer',
  });
}

function openSuccessModal() {
  if (
    !refs.backdrop ||
    !refs.modal ||
    refs.backdrop.classList.contains('is-open')
  )
    return;

  refs.backdrop.classList.add('is-open');
  document.body.classList.add('success-modal-open');
  refs.closeModalButton.focus({ preventScroll: true });

  document.addEventListener('keydown', handleKeydown);
  refs.closeModalButton.addEventListener('click', closeSuccessModal);
  refs.backdrop.addEventListener('click', handleBackdropClick);
}

function closeSuccessModal() {
  if (!refs.backdrop.classList.contains('is-open')) return;

  refs.backdrop.classList.remove('is-open');
  document.body.classList.remove('success-modal-open');
  document.removeEventListener('keydown', handleKeydown);
  refs.closeModalButton.removeEventListener('click', closeSuccessModal);
  refs.backdrop.removeEventListener('click', handleBackdropClick);
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeSuccessModal();
  }

  if (event.key === 'Tab') {
    event.preventDefault();
    refs.closeModalButton.focus({ preventScroll: true });
  }
}

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) closeSuccessModal();
}

export function scrollUp() {
  refs.header.getBoundingClientRect().top;
  window.scrollTo({ top: refs.header });
}

export function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    refs.scrollUpBtn.style.display = 'block';
  } else {
    refs.scrollUpBtn.style.display = 'none';
  }
}
