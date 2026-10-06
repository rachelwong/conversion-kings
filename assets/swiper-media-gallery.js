if (!customElements.get("swiper-media-gallery")) {
  customElements.define(
    "swiper-media-gallery",
    class SwiperMediaGallery extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        const sliderEl = this.querySelector(".product__image-slider.swiper");
        if (!sliderEl || typeof Swiper === "undefined") return;

        this.initialSlide = Number(this.dataset.initialSlide) || 0;
        this.thumbnailsEl = this.querySelector(
          ".product__image-thumbnail.swiper",
        );

        this.initThumbnails();
        this.initSlider(sliderEl);

        this.variantChangeListener = subscribe(
          PUB_SUB_EVENTS.variantChange,
          (event) => {
            this.goToVariantSlide(event.data.variant);
          },
        );
      }

      disconnectedCallback() {
        if (this.variantChangeListener) this.variantChangeListener();
        // Destroy thumbs first as the main swiper references it
        [this.slider, this.thumbnails].forEach((swiper) => {
          if (swiper && !swiper.destroyed) swiper.destroy(true, true);
        });
      }

      // Elements are scoped to this instance so several galleries on one page
      // don't control each other
      initSlider(sliderEl) {
        if (sliderEl.swiper) return;

        this.slider = new Swiper(sliderEl, {
          slidesPerView: "auto",
          spaceBetween: 16,
          initialSlide: this.initialSlide,
          navigation: {
            nextEl: this.querySelector(".swiper-button-next"),
            prevEl: this.querySelector(".swiper-button-prev"),
          },
          a11y: true,
          thumbs: this.thumbnails ? { swiper: this.thumbnails } : undefined,
        });
      }

      initThumbnails() {
        if (!this.thumbnailsEl || this.thumbnailsEl.swiper) return;

        this.thumbnails = new Swiper(this.thumbnailsEl, {
          direction: "horizontal",
          slidesPerView: "auto",
          spaceBetween: 8,
          watchSlidesProgress: true,
          slideToClickedSlide: true,
          breakpoints: {
            1280: { direction: "vertical" },
          },
        });
      }

      // Go to specific image for that variant
      goToVariantSlide(selectedVariant) {
        if (!this.slider || !selectedVariant?.featured_image) return;

        this.slider.slideTo(selectedVariant.featured_image.position - 1); // -1 because 1 indexed
      }
    },
  );
}
